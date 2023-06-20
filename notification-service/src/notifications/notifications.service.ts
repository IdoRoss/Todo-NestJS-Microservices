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
  private readonly NOTIFICATION_INTERVAL = 60 * 1000; // 1 minutes in milliseconds

  constructor(
    @InjectModel('Notifications')
    private readonly notificationModel: Model<Notification>,
    private readonly todosService: TodosService,
  ) {
    // When service is created scan relevent notifications every NOTIFICATION_INTERVAL milliseconds
    setInterval(async () => {
      try {
        await this.sendReleventNotifications();
      } catch (error) {
        console.error('Error calling sendReleventNotifications:', error);
      }
    }, this.NOTIFICATION_INTERVAL);
  }

  /**
   * Create a new notification
   * @param createNotificationDto NotificationDto
   * @returns id of new notification
   */
  async create(createNotificationDto: CreateNotificationDto): Promise<string> {
    const newNotification = new this.notificationModel(createNotificationDto);

    const result = await newNotification.save();

    console.log('Created notification', result);

    return result.id;
  }

  /**
   * Updates a notification
   * @param id id of notification to update
   * @param updateNotificationDto NotificationDto
   * @returns success of update
   */
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

  /**
   * Deletes a notification
   * @param id id of notification to delete
   * @returns success of delete
   */
  async deleteNotification(id: string): Promise<boolean> {
    const result = await this.notificationModel.deleteOne({ _id: id }).exec();

    if (result.deletedCount === 0) return false;

    return true;
  }

  // Private method to search for notifications between now and now + NOTIFICATION_INTERVAL
  private sendReleventNotifications() {
    console.log('Scanning for notifications to send');
    const minDate = new Date();

    const maxDate = new Date();
    maxDate.setUTCMilliseconds(
      maxDate.getMilliseconds() + this.NOTIFICATION_INTERVAL,
    );

    // Search for notifications which their date is due
    this.notificationModel
      .find({
        notificationSendDate: { $gte: minDate, $lte: maxDate },
      })
      .exec()
      .then((notifications) => {
        notifications.forEach(async (notification) => {
          // Classify the notification type
          // In case of 'todo' call the todoService to get the todo from the microservice and send its notification
          if (notification.itemType == 'todo') {
            const todo = await this.todosService.getTodo(notification.itemId);
            this.sendNotification(todo);
          } else {
            console.error(
              `notification: ${notification.id} has invalid type ${notification.itemType}.`,
            );
          }
          // Delete the notification after sending it via this service's deleteNotification
          await this.deleteNotification(notification.id);
        });
      });
  }

  // Send notification dunction (Assumed to be implemented)
  private sendNotification(todo: GetTodoDto) {
    console.log('ALERT Notification for todo is due soon.', todo);
  }
}
