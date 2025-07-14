import { Field, ObjectType } from '@nestjs/graphql';

import { User } from '../../user/types';

@ObjectType()
export class AuthResponse {
  @Field()
  user: User;
}
