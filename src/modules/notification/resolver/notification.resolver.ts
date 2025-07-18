import { Inject, forwardRef } from '@nestjs/common';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';

import { CreateNotificationInput } from '../model/create-notification.input';
import { Notification } from '../model/notification.model';
import { UpdateNotificationInput } from '../model/update-notification.input';
import { NotificationService } from '../service/notification.service';

@Resolver(() => Notification)
export class NotificationResolver {
  constructor(
    @Inject(forwardRef(() => NotificationService))
    private readonly notificationService: NotificationService,
  ) {}

  @Mutation(/* istanbul ignore next */ () => Notification)
  createNotification(
    @Args('input', { type: () => CreateNotificationInput })
    input: CreateNotificationInput,
  ) {
    return this.notificationService.create(input);
  }

  @Mutation(/* istanbul ignore next */ () => Notification)
  updateNotification(
    @Args('id', { type: /* istanbul ignore next */ () => ID }) id: string,
    @Args('input', { type: () => UpdateNotificationInput })
    input: UpdateNotificationInput,
  ) {
    return this.notificationService.update({ id }, input);
  }

  @Mutation(/* istanbul ignore next */ () => Notification)
  deleteNotification(
    @Args('id', { type: /* istanbul ignore next */ () => ID }) id: string,
  ) {
    return this.notificationService.delete({ id });
  }

  @Query(/* istanbul ignore next */ () => Notification)
  notification(
    @Args('id', { type: /* istanbul ignore next */ () => ID }) id: string,
  ) {
    return this.notificationService.findOne({ id });
  }

  @Query(/* istanbul ignore next */ () => [Notification])
  notificationByUserId(@Args('userId', { type: () => String }) userId: string) {
    return this.notificationService.findByUserId(userId);
  }

  @Query(/* istanbul ignore next */ () => [Notification])
  notificationByTargetId(
    @Args('targetId', { type: () => String }) targetId: string,
  ) {
    return this.notificationService.findByTargetId(targetId);
  }
}
