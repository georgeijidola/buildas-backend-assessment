import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { TasksService } from './services/tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  async create(
    @Body() createTaskDto: CreateTaskDto,
    @Query('ipAddress') ipAddress: string,
  ) {
    return await this.tasksService.create(createTaskDto, ipAddress);
  }

  @Get()
  async findAll(@Query('ipAddress') ipAddress: string) {
    return await this.tasksService.findAll(ipAddress);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Query('ipAddress') ipAddress: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return await this.tasksService.update(id, updateTaskDto, ipAddress);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Query('ipAddress') ipAddress: string) {
    return this.tasksService.remove(id, ipAddress);
  }
}
