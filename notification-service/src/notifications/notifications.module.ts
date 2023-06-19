import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { NotificationSchema } from './entities/notification.entity';
import { TodosService } from 'src/todos/todos.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Notifications', schema: NotificationSchema },
    ]),
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService, TodosService],
})
export class NotificationsModule {}
