import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './entities/todo.entity';

@Injectable()
export class TodoService {
  constructor(@InjectModel('Todo') private readonly todoModel: Model<Todo>) {}

  async createTodo(createTodoDto: CreateTodoDto): Promise<string> {
    const newTodo = new this.todoModel(createTodoDto);
    const result = await newTodo.save();
    console.log('Created Todo: ', result);
    return result.id;
  }

  async getAllTodos(): Promise<Todo[]> {
    const todos = await this.todoModel.find().exec();
    console.log('Fetching all Todos: ', todos);
    return todos.map(
      (todo) =>
        ({
          id: todo.id,
          title: todo.title,
          description: todo.description,
          isCompleate: todo.isCompleate,
        } as Todo),
    );
  }

  findOne(id: number) {
    return `This action returns a #${id} todo`;
  }

  update(id: number, updateTodoDto: UpdateTodoDto) {
    return `This action updates a #${id} todo`;
  }

  remove(id: number) {
    return `This action removes a #${id} todo`;
  }
}
