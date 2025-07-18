import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Inject,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  forwardRef,
} from '@nestjs/common';

import { CreateNotificationInput } from '../model/create-notification.input';
import { UpdateNotificationInput } from '../model/update-notification.input';
import { NotificationService } from '../service/notification.service';

@Controller('notification')
export class NotificationController {
  constructor(
    @Inject(forwardRef(() => NotificationService))
    private readonly notificationService: NotificationService,
  ) {}

  @Post()
  create(@Body() body: CreateNotificationInput) {
    return this.notificationService.create(body);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdateNotificationInput) {
    return this.notificationService.update({ id }, body);
  }

  @Post(':id')
  delete(@Param('id') id: string) {
    return this.notificationService.delete({ id });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const noti = await this.notificationService.findOne({ id });
    if (!noti) {
      throw new NotFoundException();
    }
    return noti;
  }

  @Get()
  find(@Query() { userId, targetId }: { userId?: string; targetId?: string }) {
    if (userId && !targetId) {
      return this.notificationService.findByUserId(userId);
    }
    if (targetId && !userId) {
      return this.notificationService.findByTargetId(targetId);
    }
    throw new BadRequestException();
  }
}
