import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';

import { Notification } from './entities/notification.entity';
import { TodosService } from 'src/todos/todos.service';
import { GetTodoDto } from 'src/todos/dto/get-todo.dto';

@Injectable()
export class NotificationsService {
  private readonly NOTIFICATION_INTERVAL = 30 * 1000; // 30 seconds in milliseconds
  constructor(
    @InjectModel('Notifications')
    private readonly notificationModel: Model<Notification>,
    private readonly todosService: TodosService,
  ) {
    setInterval(async () => {
      try {
        await this.sendReleventNotifications();
      } catch (error) {
        console.error('Error calling sendReleventNotifications:', error);
      }
    }, this.NOTIFICATION_INTERVAL);
  }

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

  async deleteNotification(id: string): Promise<boolean> {
    const result = await this.notificationModel.deleteOne({ _id: id }).exec();

    if (result.deletedCount === 0) return false;

    return true;
  }

  private sendReleventNotifications() {
    console.log('Sending notifications');
    const minDate = new Date();
    minDate.setUTCMilliseconds(
      minDate.getMilliseconds() - this.NOTIFICATION_INTERVAL,
    );

    const maxDate = new Date();
    maxDate.setUTCMilliseconds(
      maxDate.getMilliseconds() + this.NOTIFICATION_INTERVAL,
    );

    this.notificationModel
      .find({
        notificationSendDate: { $gte: minDate, $lte: maxDate },
      })
      .exec()
      .then((notifications) => {
        notifications.forEach(async (notification) => {
          const todo = await this.todosService.getTodo(notification.itemId);
          this.sendNotification(todo);
        });
      });
  }

  // Send notification dunction (Assumed to be implemented)
  private sendNotification(todo: GetTodoDto) {
    console.log('ALERT Notification for todo is due soon.', todo);
  }
}
