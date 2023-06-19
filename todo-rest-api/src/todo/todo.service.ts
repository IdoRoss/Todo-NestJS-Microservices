import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './entities/todo.entity';
import { NotFoundError } from 'rxjs';
import { GetTodoDto } from './dto/get-todo.dto';

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
  async getAllTodos(): Promise<GetTodoDto[]> {
    // Find all todos
    const todos = await this.todoModel.find().exec();

    console.log('Fetching all Todos: ', todos);

    // Map the todos to a Todo object
    return todos.map((todo) => this.mapTodoModelToTodoDto(todo));
  }
  /**
   * Gets a Todo from the db by id
   * @param id Id of the Todo to get
   * @returns The Todo
   */
  async getTodo(id: string): Promise<GetTodoDto> {
    return this.mapTodoModelToTodoDto(await this.findTodo(id));
  }

  async updateTodo(id: number, updateTodoDto: UpdateTodoDto) {
    return `This action updates a #${id} todo`;
  }

  remove(id: number) {
    return `This action removes a #${id} todo`;
  }

  /**
   * Helper method to find a Todo Mongose Document by id
   * @param id Id of the Todo to get
   * @returns The Todo Mongose Document
   */
  private async findTodo(id: string): Promise<Todo> {
    // Find todo
    console.log('Fetching Todo with Id: ', id);
    try {
      const todo = await this.todoModel.findById(id);

      if (!todo) {
        throw new NotFoundException();
      }

      return todo;
    } catch (error) {
      console.log(error);
      throw new NotFoundException(`Todo with Id: ${id} not found`);
    }
  }

  /**
   * Helper function to map a Todo Mongose Document to a Todo Data Transfare Object
   * @param todo Todo Mongose Document
   * @returns Todo Data Transfare Object
   */
  private mapTodoModelToTodoDto(todo: Todo): GetTodoDto {
    const dto: GetTodoDto = {
      id: todo.id,
      title: todo.title,
      description: todo.description,
      isCompleate: todo.isCompleate,
      deadline: todo.deadline,
    };
    return dto;
  }
}
