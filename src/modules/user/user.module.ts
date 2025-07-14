import { DynamooseModule } from 'nestjs-dynamoose';

import { Module } from '@nestjs/common';

import { UserSchema } from './schema/user.schema';
import { UsersService } from './service/user.service';

@Module({
  imports: [
    DynamooseModule.forFeature([
      {
        name: 'user',
        schema: UserSchema,
      },
    ]),
  ],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
