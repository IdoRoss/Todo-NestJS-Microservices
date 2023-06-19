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

  /**
   * Updates a Todo in the db by id
   * @param id Id of the Todo to update
   * @param updateTodoDto Values to update the Todo with
   * @returns Dto of the updated Todo
   */
  async updateTodo(
    id: string,
    updateTodoDto: UpdateTodoDto,
  ): Promise<GetTodoDto> {
    // Get the todo
    const todo = await this.findTodo(id);

    // Update existing params
    if (updateTodoDto.title) {
      todo.title = updateTodoDto.title;
    }
    if (updateTodoDto.description) {
      todo.description = updateTodoDto.description;
    }
    if (updateTodoDto.isCompleate) {
      todo.isCompleate = updateTodoDto.isCompleate;
    }
    if (updateTodoDto.deadline) {
      todo.deadline = updateTodoDto.deadline;
    }

    await todo.save();
    return this.mapTodoModelToTodoDto(todo);
  }

  /**
   * Deletes a Todo from the db by id
   * @param id Id of the Todo to delete
   */
  async deleteTodo(id: string) {
    console.log('Deleting Todo with Id: ', id);

    const result = await this.todoModel.deleteOne({ _id: id }).exec();

    // Error handling
    if (result.deletedCount === 0) {
      const errorMessage = `Todo with Id: ${id} not found`;
      console.error(`Deleting Todo, ${errorMessage}`);
      // Throwing NotFoundError will trigger the global exception handler which will return 404 status code
      throw new NotFoundException(errorMessage);
    }
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
        // Throwing NotFoundError will trigger the global exception handler which will return 404 status code
        throw new NotFoundException(`Todo with Id: ${id} not found`);
      }

      return todo;
    } catch (error) {
      console.error('Fetching Todo with Id: ', id, error);
      throw error;
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
