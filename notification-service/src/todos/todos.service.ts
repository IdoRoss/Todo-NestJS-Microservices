import axios from 'axios';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class TodosService {
  private readonly API_URL = 'http://localhost:3001/api/notifications';
  async getTodo(id: string) {
    try {
      const res = await axios.get(`${this.API_URL}/${id}`);
      return res.data;
    } catch (e) {
      console.error('Todo: Error in get', e);
    }
  }
}
