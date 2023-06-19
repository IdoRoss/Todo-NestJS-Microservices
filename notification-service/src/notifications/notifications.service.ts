import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';

import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel('Notifications')
    private readonly notificationModel: Model<Notification>,
  ) {}

  async create(createNotificationDto: CreateNotificationDto): Promise<string> {
    const newNotification = new this.notificationModel(createNotificationDto);

    const result = await newNotification.save();

    console.log('Created notification', result);

    return result.id;
  }

  async updateNotification(
    id: string,
    updateNotificationDto: UpdateNotificationDto,
  ): Promise<boolean> {
    // Get the notification
    const notification = await this.notificationModel.findById(id);

    if (!notification) {
      return false;
    }
    notification.notificationSendDate =
      updateNotificationDto.notificationSendDate;

    await notification.save();
    return true;
  }

  async deleteNotification(id: string) {
    return `This action removes a #${id} notification`;
  }
}
