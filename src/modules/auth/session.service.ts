import { InjectModel, Model } from 'nestjs-dynamoose';
import { v4 as uuidv4 } from 'uuid';

import { Injectable } from '@nestjs/common';

interface Session {
  sessionId: string;
  userId: string;
  expiresAt: number;
  createdAt: number;
}

@Injectable()
export class SessionService {
  private readonly sessionExpiry: number;

  constructor(
    @InjectModel('session')
    private readonly sessionModel: Model<Session, Session['sessionId']>,
  ) {
    this.sessionExpiry = 24 * 60 * 60; // 24시간 (초 단위)
  }

  async createSession(userId: string): Promise<string> {
    const sessionId = uuidv4();
    const expiresAt = Math.floor(Date.now() / 1000) + this.sessionExpiry;

    await this.sessionModel.create({
      sessionId,
      userId,
      expiresAt,
      createdAt: Math.floor(Date.now() / 1000),
    });

    return sessionId;
  }

  async validateSession(sessionId: string): Promise<string | null> {
    const session = await this.sessionModel.get(sessionId);

    if (!session) {
      return null;
    }

    if (session.expiresAt < Math.floor(Date.now() / 1000)) {
      await this.deleteSession(sessionId);
      return null;
    }

    return session.userId;
  }

  async deleteSession(sessionId: string): Promise<void> {
    await this.sessionModel.delete(sessionId);
  }
}
