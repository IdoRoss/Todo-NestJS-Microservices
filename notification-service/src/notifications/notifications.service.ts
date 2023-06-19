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
    private readonly todoModel: Model<Notification>,
  ) {}

  async create(createNotificationDto: CreateNotificationDto): Promise<string> {
    const newNotification = new this.todoModel(createNotificationDto);

    const result = await newNotification.save();

    console.log('Created notification', result);

    return result.id;
  }

  async updateNotification(
    id: string,
    updateNotificationDto: UpdateNotificationDto,
  ) {
    return `This action updates a #${id} notification`;
  }

  async deleteNotification(id: string) {
    return `This action removes a #${id} notification`;
  }
}
