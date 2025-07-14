import { Field, ID, ObjectType } from '@nestjs/graphql';

import { NotificationStatus } from './notification.enum';

export type NotificationKey = {
  id: string;
};

@ObjectType()
export class Notification {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  targetId: string;

  @Field(() => String)
  userId: string;

  @Field(() => String)
  content: string;

  @Field(() => NotificationStatus)
  status: NotificationStatus;

  @Field(() => String)
  createAt: string;
}
