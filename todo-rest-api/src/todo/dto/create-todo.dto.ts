export class CreateTodoDto {
  title: string;
  description: string;
  deadline: Date;
  isCompleate: boolean;
  notifyHoursBeforeDeadline?: number;
}
