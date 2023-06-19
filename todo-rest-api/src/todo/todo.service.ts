import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './entities/todo.entity';
import { GetTodoDto } from './dto/get-todo.dto';
import { NotificationsService } from 'src/notifications/notifications.service';
import { CreateNotificationDto } from 'src/notifications/dto/create-notification.dto';
import { UpdateNotificationDto } from 'src/notifications/dto/update-notification.dto';
import { HttpStatusCode } from 'axios';

@Injectable()
export class TodoService {
  private readonly NOTIFICATIONS_HOUR_BEFORE_DEADLINE = 12;
  constructor(
    @InjectModel('Todo') private readonly todoModel: Model<Todo>,
    private readonly notificationsService: NotificationsService,
  ) {}

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

    // Create notification for the new todo
    // Calculate notification date
    const notificationDate = result.deadline;
    notificationDate.setHours(
      result.deadline.getHours() - this.NOTIFICATIONS_HOUR_BEFORE_DEADLINE,
    );

    // Create notification dto
    const notificationDto: CreateNotificationDto = {
      notificationSendDate: notificationDate,
      itemId: result.id,
    };
    // Make the API call to notification microservice and update existing todo with notificationId
    console.log('Creating notification: ', notificationDto);
    this.notificationsService
      .createNotification(notificationDto)
      .subscribe((res) => {
        if (res.status === HttpStatusCode.Created) {
          newTodo.notificationId = res.data;
          newTodo.save();
        }
      });

    // Return the id of the new todo
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
    const todo = await this.todoModel.findById(id);
    if (!todo) {
      return null;
    }
    return this.mapTodoModelToTodoDto(todo);
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
    const todo = await this.todoModel.findById(id);

    if (!todo) {
      return null;
    }

    // Handle updating notification
    // If todo wasnt compleated before and is compleated now and it has a notification
    if (!todo.isCompleate && updateTodoDto.isCompleate && todo.notificationId) {
      this.notificationsService
        .deleteNotification(todo.notificationId)
        .subscribe((res) => {
          if (res.status != HttpStatusCode.Ok) {
            console.error('Error deleting notification: ', res);
          }
        });
    } else if (updateTodoDto.deadline && todo.notificationId) {
      // If deadline was updated and it has a notification
      // Calculate notification date
      const notificationDate = updateTodoDto.deadline;
      notificationDate.setHours(
        updateTodoDto.deadline.getHours() -
          this.NOTIFICATIONS_HOUR_BEFORE_DEADLINE,
      );

      // Update notification dto
      const notificationDto: UpdateNotificationDto = {
        notificationSendDate: notificationDate,
      };
      // Make the API call to notification microservice to update notificationSendDate
      console.log('Creating notification: ', notificationDto);
      this.notificationsService
        .updateNotification(todo.notificationId, notificationDto)
        .subscribe((res) => {
          if (res.status !== HttpStatusCode.Ok) {
            console.error('Error updating notification: ', res);
          }
        });
    }

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
  async deleteTodo(id: string): Promise<boolean> {
    console.log('Deleting Todo with Id: ', id);

    // Get the notificationId for the notification to delete
    const todoToDelete = await this.todoModel.findById(id);
    if (!todoToDelete) {
      return false;
    }
    const notificationId = todoToDelete.notificationId;

    // Delete the todo
    const result = await this.todoModel.deleteOne({ _id: id }).exec();

    if (result.deletedCount === 0) return false;

    // Delete the notification if exists
    if (notificationId) {
      this.notificationsService
        .deleteNotification(notificationId)
        .subscribe((res) => {
          if (res.status != HttpStatusCode.Ok) {
            console.error('Error deleting notification: ', res);
          }
        });
    }
    return true;
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
