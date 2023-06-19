import axios, { AxiosError } from 'axios';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class TodosService {
  private readonly API_URL = 'http://localhost:3000/api/todo';
  async getTodo(id: string) {
    try {
      const res = await axios.get(`${this.API_URL}/${id}`);
      return res.data;
    } catch (e) {
      const error = e as AxiosError;
      console.error('Todo: Error in get', error.message);
    }
  }
}
