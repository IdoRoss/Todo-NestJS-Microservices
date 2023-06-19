import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { TodoService } from './todo.service';
import { TodoController } from './todo.controller';
import { TodoSchema } from './entities/todo.entity';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Todo', schema: TodoSchema }])],
  controllers: [TodoController],
  providers: [TodoService],
})
export class TodoModule {}
