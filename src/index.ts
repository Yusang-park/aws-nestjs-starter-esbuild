import {
  ApiGatewayManagementApiClient,
  PostToConnectionCommand,
} from '@aws-sdk/client-apigatewaymanagementapi';
import serverlessExpress from '@vendia/serverless-express';
import {
  APIGatewayEventRequestContext,
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
  Context,
  Handler,
} from 'aws-lambda';
import cookieParser from 'cookie-parser';
import express from 'express';

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';

import { AppModule } from './app.module';

// WebSocket 이벤트 컨텍스트 타입 확장
interface WebSocketEventContext extends APIGatewayEventRequestContext {
  connectionId: string;
  domainName: string;
  stage: string;
}

interface WebSocketEvent extends APIGatewayProxyEvent {
  requestContext: WebSocketEventContext;
}

// WebSocket 인증 이벤트 타입
interface WebSocketAuthEvent extends APIGatewayProxyEvent {
  methodArn: string;
  headers: {
    Auth?: string;
  };
}

let cachedServer: Handler;

const bootstrapServer = async (): Promise<Handler> => {
  const expressApp = express();
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
  );
  app.useGlobalPipes(new ValidationPipe({ forbidUnknownValues: true }));
  expressApp.use(cookieParser());
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });
  await app.init();
  return serverlessExpress({
    app: expressApp,
  });
};

// WebSocket 연결 핸들러
export const connect: APIGatewayProxyHandler = async (
  _event: APIGatewayProxyEvent,
  _context: Context,
): Promise<APIGatewayProxyResult> => {
  try {
    // 연결 성공 시 200 상태 코드와 함께 빈 객체 반환
    return {
      statusCode: 200,
      body: JSON.stringify({}),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  } catch (error) {
    console.error('Connection error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }
};

// WebSocket 연결 해제 핸들러
export const disconnect: APIGatewayProxyHandler = async (
  _event,
  _context,
  _callback,
) => {
  return {
    statusCode: 200,
    body: 'Disconnected.',
  };
};

// 기본 WebSocket 메시지 핸들러
export const handlerSocket = async (
  event: WebSocketEvent,
  _context: Context,
): Promise<APIGatewayProxyResult> => {
  const client = new ApiGatewayManagementApiClient({
    apiVersion: '2018-11-29',
    endpoint: `https://${event.requestContext.domainName}/${event.requestContext.stage}`,
  });

  try {
    const command = new PostToConnectionCommand({
      ConnectionId: event.requestContext.connectionId,
      Data: `default route received: ${event.body}`,
    });
    await client.send(command);

    return {
      statusCode: 200,
      body: 'Sent.',
    };
  } catch (error) {
    console.error('Error sending message:', error);
    return {
      statusCode: 500,
      body: 'Error sending message',
    };
  }
};

// WebSocket 인증 핸들러
export const auth = async (event: WebSocketAuthEvent, _context: Context) => {
  // return policy statement that allows to invoke the connect function.
  // in a real world application, you'd verify that the header in the event
  // object actually corresponds to a user, and return an appropriate statement accordingly

  console.log(event);
  const res = {
    principalId: 'user',
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: 'Allow',
          Resource: event.methodArn,
        },
      ],
    },
  };
  return res;
};

// 기존 HTTP 핸들러
export const handler: APIGatewayProxyHandler = async (
  event,
  context,
  callback,
) => {
  if (!cachedServer) {
    cachedServer = await bootstrapServer();
  }
  return cachedServer(event, context, callback);
};
