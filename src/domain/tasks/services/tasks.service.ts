import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Task } from '../interfaces/task.interface';
import { TasksData } from '../types/TasksData.type';
import { readFile, writeFile } from 'fs/promises';

@Injectable()
export class TasksService {
  private readonly dataFilePath = path.join(
    process.cwd(),
    'src/domain/tasks/_data/tasks.json',
  );

  private async readData(): Promise<TasksData> {
    const data = await readFile(this.dataFilePath, 'utf-8');
    return JSON.parse(data);
  }

  private async writeData(data: TasksData): Promise<void> {
    await writeFile(this.dataFilePath, JSON.stringify(data, null, 2));
  }

  async create(createTaskDto: CreateTaskDto, ipAddress: string): Promise<Task> {
    const data = await this.readData();

    const taskId = uuidv4();

    const newTask: Task = {
      id: taskId,
      ...createTaskDto,
      isCompleted: false,
      completedAt: null,
      createdAt: new Date(),
    };

    if (!data[ipAddress]) {
      data[ipAddress] = [];
    }

    data[ipAddress].push(newTask);

    await this.writeData(data);

    return newTask;
  }

  async findAll(ipAddress: string): Promise<Task[]> {
    const data = await this.readData();

    return data[ipAddress] ? data[ipAddress] : [];
  }

  async update(
    id: string,
    updateTaskDto: UpdateTaskDto,
    ipAddress: string,
  ): Promise<Task> {
    const data = await this.readData();
    const ipData = data[ipAddress];

    if (!ipData) {
      throw new NotFoundException(
        `Could not find tasks for IP address ${ipAddress}`,
      );
    }

    let taskIndex: number;

    const task = ipData.find((task, index) => {
      taskIndex = index;

      return task.id === id;
    });

    if (!task) {
      throw new NotFoundException(
        `Could not find task for IP address ${ipAddress} with ID ${id}`,
      );
    }

    const updatedTask = { ...task, ...updateTaskDto };

    if (updateTaskDto.isCompleted && !task.isCompleted) {
      updatedTask.completedAt = new Date();
    }

    ipData[taskIndex] = updatedTask;

    await this.writeData(data);

    return updatedTask;
  }

  async remove(id: string, ipAddress: string): Promise<void> {
    const data = await this.readData();
    const ipData = data[ipAddress];

    if (!ipData) {
      throw new NotFoundException(
        `Could not find tasks for IP address ${ipAddress}`,
      );
    }

    const taskIndex = ipData.findIndex((task) => task.id === id);

    if (taskIndex < 0) {
      throw new NotFoundException(
        `Could not find task for IP address ${ipAddress} with ID ${id}`,
      );
    }

    delete ipData[taskIndex];

    await this.writeData(data);
  }
}
