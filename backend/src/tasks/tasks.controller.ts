import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto, @Request() req) {
    return this.tasksService.create(createTaskDto, req.user.userId);
  }

  @Get()
  findAll(@Request() req) {
    return this.tasksService.findAll(req.user.userId);
  }

  @Get('my-tasks')
  findMyTasks(@Request() req) {
    return this.tasksService.findMyTasks(req.user.userId);
  }

  @Get('created-by-me')
  findCreatedByMe(@Request() req) {
    return this.tasksService.findCreatedByMe(req.user.userId);
  }

  @Get('overdue')
  findOverdue(@Request() req) {
    return this.tasksService.findOverdue(req.user.userId);
  }

  @Get('statistics')
  getStatistics(@Request() req) {
    return this.tasksService.getStatistics(req.user.userId);
  }

  @Get('search')
  search(@Query('q') query: string, @Request() req) {
    return this.tasksService.search(query, req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @Request() req,
  ) {
    return this.tasksService.update(id, updateTaskDto, req.user.userId);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @Request() req) {
    return this.tasksService.delete(id, req.user.userId);
  }
}