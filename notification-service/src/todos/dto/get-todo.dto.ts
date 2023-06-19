import { PartialType } from '@nestjs/mapped-types';

export class GetTodoDto {
  title: string;
  description: string;
  deadline: Date;
  isCompleate: boolean;
}
