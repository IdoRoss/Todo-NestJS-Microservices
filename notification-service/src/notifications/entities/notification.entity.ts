import * as mongoose from 'mongoose';

export const NotificationSchema = new mongoose.Schema({
  itemType: { type: String, required: true },
  itemId: { type: String, required: true },
  notificationSendDate: { type: Date, required: true },
});

export interface Notification extends mongoose.Document {
  id: string;
  notificationSendDate: Date;
  itemType: string;
  itemId: string;
}
