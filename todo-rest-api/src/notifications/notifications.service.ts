import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { HttpService } from '@nestjs/axios';
import { Observable } from 'rxjs/internal/Observable';
import axios, { AxiosResponse, AxiosError } from 'axios';

@Injectable()
export class NotificationsService {
  private readonly API_URL = 'http://localhost:3001/api/notifications';
  constructor() {}

  async createNotification(createNotificationDto: CreateNotificationDto) {
    return await axios.post(this.API_URL, createNotificationDto);
  }

  async updateNotification(
    id: string,
    updateNotificationDto: UpdateNotificationDto,
  ) {
    // Make API call to create a notification
    return await axios.post(`${this.API_URL}/${id}`, updateNotificationDto);
  }
  async deleteNotification(id: string) {
    // Make API call to create a notification
    return await axios.delete(`${this.API_URL}/${id}`);
  }
}
