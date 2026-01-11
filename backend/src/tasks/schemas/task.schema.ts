import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TaskDocument = Task & Document;

@Schema({ timestamps: true })
export class Task {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  dueDate: Date;

  @Prop({ 
    required: true, 
    enum: ['low', 'medium', 'high'],
    default: 'medium' 
  })
  priority: string;

  @Prop({ 
    required: true, 
    enum: ['todo', 'in-progress', 'completed'],
    default: 'todo' 
  })
  status: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  assignedTo: Types.ObjectId;
}

export const TaskSchema = SchemaFactory.createForClass(Task);