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

  @Post()
  async create(@Body() createNotificationDto: CreateNotificationDto) {
    const generatedId = await this.notificationsService.create(
      createNotificationDto,
    );
    return { id: generatedId };
  }

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

  @Delete(':id')
  async deleteNotification(@Param('id') id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid id');
    }

    const success = await this.notificationsService.deleteNotification(id);

    if (!success) throw new NotFoundException(`Notification id ${id} not found`);
  }
}
