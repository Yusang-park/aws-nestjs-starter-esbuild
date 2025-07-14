import { IsNotEmpty, IsString } from 'class-validator';

import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateNotificationInput {
  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  targetId: string;

  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  userId: string;

  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  content: string;
}
