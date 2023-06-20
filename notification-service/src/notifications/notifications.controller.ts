import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import * as mongoose from 'mongoose';

@Controller('api/notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  /**
   * Create a new notification
   * @param createNotificationDto NotificationDto
   * @returns id of new notification
   */
  @Post()
  async create(@Body() createNotificationDto: CreateNotificationDto) {
    const generatedId = await this.notificationsService.create(
      createNotificationDto,
    );
    // Returns 201 by default
    return { id: generatedId };
  }

  /**
   * Updates a notification
   * @param id id of notification to update
   * @param updateNotificationDto NotificationDto
   * @returns success of update
   */
  @Patch(':id')
  async UpdateNotification(
    @Param('id') id: string,
    @Body() updateNotificationDto: UpdateNotificationDto,
  ) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid id');
    }

    const success = await this.notificationsService.updateNotification(
      id,
      updateNotificationDto,
    );
    if (!success) {
      throw new NotFoundException(`Notification id ${id} not found`);
    }
  }

  /**
   * Deletes a notification
   * @param id id of notification to delete
   * @returns success of delete
   */
  @Delete(':id')
  async deleteNotification(@Param('id') id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid id');
    }

    const success = await this.notificationsService.deleteNotification(id);

    if (!success)
      throw new NotFoundException(`Notification id ${id} not found`);
  }
}
