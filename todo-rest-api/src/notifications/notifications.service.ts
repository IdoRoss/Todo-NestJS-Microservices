import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { HttpService } from '@nestjs/axios';
import { Observable } from 'rxjs/internal/Observable';
import { AxiosResponse } from 'axios';

@Injectable()
export class NotificationsService {
  private readonly API_URL = 'http://localhost:3001/api/notifications';
  constructor(private readonly httpService: HttpService) {}

  async createNotification(
    createNotificationDto: CreateNotificationDto,
  ): Promise<Observable<AxiosResponse<string>>> {
    return this.httpService.post(this.API_URL, createNotificationDto);
  }

  async updateNotification(
    id: string,
    updateNotificationDto: UpdateNotificationDto,
  ): Promise<Observable<AxiosResponse<void>>> {
    // Make API call to create a notification
    return this.httpService.post(
      `${this.API_URL}/${id}`,
      updateNotificationDto,
    );
  }
  async deleteNotification(id: string) {
    // Make API call to create a notification
    return this.httpService.delete(`${this.API_URL}/${id}`);
  }
}
