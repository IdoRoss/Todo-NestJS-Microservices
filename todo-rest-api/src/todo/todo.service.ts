import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './entities/todo.entity';
import { NotFoundError } from 'rxjs';

@Injectable()
export class TodoService {
  constructor(@InjectModel('Todo') private readonly todoModel: Model<Todo>) {}

  /**
   * Creates a Todo instance in the db
   * @param createTodoDto Create Todo Data Transfare Object
   * @returns The Mongo generated Id
   */
  async createTodo(createTodoDto: CreateTodoDto): Promise<string> {
    // Create the new todo model
    const newTodo = new this.todoModel(createTodoDto);

    // Save the new todo model
    const result = await newTodo.save();

    console.log('Created Todo: ', result);
    return result.id;
  }

  /**
   * Gets all Todos from the db
   * @returns A array of all Todos
   */
  async getAllTodos(): Promise<Todo[]> {
    // Find all todos
    const todos = await this.todoModel.find().exec();

    console.log('Fetching all Todos: ', todos);

    // Map the todos to a Todo object
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
  /**
   * Gets a Todo from the db by id
   * @param id Id of the Todo to get
   * @returns The Todo
   */
  async getTodo(id: string): Promise<Todo> {
    // Find todo
    const todoModel = await this.todoModel.findById(id);

    if (!todoModel) {
      throw new Error('Todo not found');
    }

    const todo: Todo = {
      id: todoModel.id,
      title: todoModel.title,
      description: todoModel.description,
      isCompleate: todoModel.isCompleate,
      deadline: todoModel.deadline,
    };

    return todo;
  }

  update(id: number, updateTodoDto: UpdateTodoDto) {
    return `This action updates a #${id} todo`;
  }

  remove(id: number) {
    return `This action removes a #${id} todo`;
  }
}
