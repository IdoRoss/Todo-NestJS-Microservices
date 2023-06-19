import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { NotificationsModule } from './notifications/notifications.module';
import { TodosService } from './todos/todos.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    NotificationsModule,
  ],
  providers: [TodosService],
})
export class AppModule {}
