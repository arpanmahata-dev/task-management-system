/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task, TaskDocument } from './schemas/task.schema';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
  ) {}

  async create(createTaskDto: CreateTaskDto, userId: string): Promise<Task> {
    const newTask = new this.taskModel({
      title: createTaskDto.title,
      description: createTaskDto.description,
      dueDate: createTaskDto.dueDate,
      priority: createTaskDto.priority,
      status: 'todo',
      createdBy: userId,
      assignedTo: createTaskDto.assignedTo || userId,
    });
    return newTask.save();
  }

  async findAll(userId: string): Promise<Task[]> {
    return this.taskModel
      .find({
        $or: [{ createdBy: userId }, { assignedTo: userId }],
      })
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findMyTasks(userId: string): Promise<Task[]> {
    return this.taskModel
      .find({ assignedTo: userId })
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email')
      .sort({ dueDate: 1 })
      .exec();
  }

  async findCreatedByMe(userId: string): Promise<Task[]> {
    return this.taskModel
      .find({ createdBy: userId })
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOverdue(userId: string): Promise<Task[]> {
    const now = new Date();
    return this.taskModel
      .find({
        $and: [
          { $or: [{ createdBy: userId }, { assignedTo: userId }] },
          { dueDate: { $lt: now } },
          { status: { $ne: 'completed' } },
        ],
      })
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email')
      .sort({ dueDate: 1 })
      .exec();
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.taskModel
      .findById(id)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email')
      .exec();
    
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto, userId: string): Promise<Task> {
  const task = await this.taskModel.findById(id).exec();
  
  if (!task) {
    throw new NotFoundException('Task not found');
  }

  // Check permissions - convert ObjectId to string safely
  const createdById = task.createdBy.toString();
  const assignedToId = task.assignedTo?.toString();

  if (createdById !== userId && assignedToId !== userId) {
    throw new ForbiddenException('You do not have permission to update this task');
  }

  // Update the task
  const updatedTask = await this.taskModel
    .findByIdAndUpdate(id, updateTaskDto, { new: true })
    .populate('createdBy', 'name email')
    .populate('assignedTo', 'name email')
    .exec();

  if (!updatedTask) {
    throw new NotFoundException('Task not found');
  }

  return updatedTask;
}

  async delete(id: string, userId: string): Promise<void> {
    const task = await this.taskModel.findById(id);
    
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (task.createdBy.toString() !== userId) {
      throw new ForbiddenException('You do not have permission to delete this task');
    }

    await this.taskModel.findByIdAndDelete(id);
  }

  async search(query: string, userId: string): Promise<Task[]> {
    return this.taskModel
      .find({
        $and: [
          { $or: [{ createdBy: userId }, { assignedTo: userId }] },
          { $or: [
            { title: { $regex: query, $options: 'i' } },
            { description: { $regex: query, $options: 'i' } },
          ]},
        ],
      })
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email')
      .exec();
  }

  async getStatistics(userId: string) {
    const allTasks = await this.findAll(userId);
    const myTasks = await this.findMyTasks(userId);
    const createdTasks = await this.findCreatedByMe(userId);
    const overdueTasks = await this.findOverdue(userId);

    return {
      total: allTasks.length,
      myTasks: myTasks.length,
      createdByMe: createdTasks.length,
      overdue: overdueTasks.length,
      completed: allTasks.filter(t => t.status === 'completed').length,
      inProgress: allTasks.filter(t => t.status === 'in-progress').length,
      todo: allTasks.filter(t => t.status === 'todo').length,
    };
  }
}