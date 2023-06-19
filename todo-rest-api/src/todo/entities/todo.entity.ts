import * as mongoose from 'mongoose';

export const TodoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  deadline: { type: Date },
  isCompleate: { type: String, required: true },
});

export interface Todo extends mongoose.Document {
  id: string;
  title: string;
  description: string;
  deadline: Date;
  isCompleate: boolean;
}
