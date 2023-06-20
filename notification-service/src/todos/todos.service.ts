import axios, { AxiosError, AxiosResponse } from 'axios';
import { Inject, Injectable } from '@nestjs/common';
import { GetTodoDto } from './dto/get-todo.dto';

@Injectable()
export class TodosService {
  private readonly API_URL = 'http://localhost:3000/api/todo';

  /**
   * Get a todo item by id (Needed in case notifications are for a todo item)
   * @param id id of todo
   * @returns A todo item
   */
  async getTodo(id: string): Promise<GetTodoDto> {
    try {
      const res = await axios.get(`${this.API_URL}/${id}`);
      return res.data;
    } catch (e) {
      const error = e as AxiosError;
      console.error('Todo: Error in get', error.message);
    }
  }
}
