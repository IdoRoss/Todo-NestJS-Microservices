import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import * as mongoose from 'mongoose';

@Controller('api/todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  /**
   * Creates a Todo instance in the db
   * @param createTodoDto Create Todo Data Transfare Object
   * @returns The Mongo generated Id
   */
  @Post()
  async createTodo(@Body() createTodoDto: CreateTodoDto) {
    const generatedId = await this.todoService.createTodo(createTodoDto);

    // Returns 201 by default
    return { id: generatedId };
  }

  /**
   * Gets all Todos from the db
   * @returns A array of all Todos
   */
  @Get()
  async getAllTodos() {
    const allTodos = await this.todoService.getAllTodos();
    return allTodos;
  }

  /**
   * Gets a Todo from the db by id
   * @param id Id of the Todo to get
   * @returns The Todo
   */
  @Get(':id')
  async getTodo(@Param('id') id: string) {
    // Validate id
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid id');
    }

    const todo = await this.todoService.getTodo(id);

    // Return 404 if not found
    if (!todo) throw new NotFoundException(`Todo id ${id} not found`);

    return todo;
  }

  /**
   * Updates a Todo in the db by id
   * @param id Id of the Todo to update
   * @param updateTodoDto Values to update the Todo with
   * @returns Dto of the updated Todo
   */
  @Patch(':id')
  async updateTodo(
    @Param('id') id: string,
    @Body() updateTodoDto: UpdateTodoDto,
  ) {
    // Validate id
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid id');
    }

    const todo = await this.todoService.updateTodo(id, updateTodoDto);

    // Return 404 if not found
    if (!todo) throw new NotFoundException(`Todo id ${id} not found`);

    return todo;
  }

  /**
   * Deletes a Todo from the db by id
   * @param id Id of the Todo to delete
   */
  @Delete(':id')
  async deleteTodo(@Param('id') id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid id');
    }

    const success = await this.todoService.deleteTodo(id);

    // Return 404 if not found
    if (!success) throw new NotFoundException(`Todo id ${id} not found`);
  }
}
