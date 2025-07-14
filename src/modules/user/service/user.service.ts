import * as bcrypt from 'bcryptjs';
import { InjectModel, Model } from 'nestjs-dynamoose';
import { v4 as uuidv4 } from 'uuid';

import { Injectable } from '@nestjs/common';

import { CreateUserInput } from '../model/create-user.input';
import { User, UserKey } from '../model/user.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('user')
    private userModel: Model<User, UserKey>,
  ) {}

  async create(createUserDto: CreateUserInput): Promise<User> {
    const hashedPassword = createUserDto.password
      ? await bcrypt.hash(createUserDto.password, 10)
      : undefined;

    return this.userModel.create({
      id: uuidv4(),
      ...createUserDto,
      password: hashedPassword,
      isEmailVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    const users = await this.userModel.scan('email').eq(email).exec();
    return users.count > 0 ? users[0] : null;
  }

  async findById(id: string): Promise<User | null> {
    const users = await this.userModel.scan('id').eq(id).exec();
    return users.count > 0 ? users[0] : null;
  }

  async findByProviderId(providerId: string): Promise<User | null> {
    const users = await this.userModel.scan('providerId').eq(providerId).exec();
    return users.count > 0 ? users[0] : null;
  }

  async findByVerificationToken(token: string): Promise<User[]> {
    const users = await this.userModel
      .scan('verificationToken')
      .eq(token)
      .exec();
    return users;
  }

  async updateVerificationStatus(
    id: string,
    isVerified: boolean,
  ): Promise<User> {
    return this.userModel.update({ id } as UserKey, {
      isEmailVerified: isVerified,
    });
  }

  async updateVerificationToken(
    id: string,
    verificationToken: string | undefined,
    verificationTokenExpiresAt: Date | undefined,
  ): Promise<User> {
    return this.userModel.update({ id } as UserKey, {
      verificationToken,
      verificationTokenExpiresAt,
    });
  }

  async updateTokens(
    id: string,
    accessToken?: string,
    refreshToken?: string,
  ): Promise<User> {
    return this.userModel.update({ id } as UserKey, {
      accessToken,
      refreshToken,
      updatedAt: new Date(),
    });
  }
}
