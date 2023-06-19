import * as mongoose from 'mongoose';

export const NotificationSchema = new mongoose.Schema({
  todoId: { type: String, required: true },
  notificationSendDate: { type: Date, required: true },
});

export interface Notification extends mongoose.Document {
  id: string;
  notificationSendDate: Date;
  itemId: string;
}
