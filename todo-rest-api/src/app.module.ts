import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { TodoModule } from './todo/todo.module';
import { NotificationsService } from './notifications/notifications.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    TodoModule,
  ],
  providers: [NotificationsService],
})
export class AppModule {}
