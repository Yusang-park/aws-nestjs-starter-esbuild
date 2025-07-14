import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

import { Field, InputType } from '@nestjs/graphql';

import { UserProvider } from '../types';

@InputType()
export class CreateUserInput {
  @Field()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  @MinLength(6)
  password?: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsNotEmpty()
  provider: UserProvider;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  providerId?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  accessToken?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  refreshToken?: string;
}
