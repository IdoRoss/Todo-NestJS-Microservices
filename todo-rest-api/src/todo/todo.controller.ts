import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

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
  getTodo(@Param('id') id: string) {
    return this.todoService.getTodo(id);
  }

  @Patch(':id')
  updateTodo(@Param('id') id: string, @Body() updateTodoDto: UpdateTodoDto) {
    return this.todoService.updateTodo(+id, updateTodoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.todoService.remove(+id);
  }
}
