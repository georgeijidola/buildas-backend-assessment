import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { NotFoundException } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';
import { CreateTaskDto } from '../dto/create-task.dto';
import { faker } from '@faker-js/faker';
import { UpdateTaskDto } from '../dto/update-task.dto';

describe('TasksService', () => {
  let service: TasksService;
  const testDataFilePath = path.join(
    process.cwd(),
    'src/domain/tasks/_data/test-tasks.json',
  );

  const initialData = {
    '127.0.0.1': [
      {
        id: 'task-1',
        ipAddress: '127.0.0.1',
        description: 'Initial Task',
        isCompleted: false,
        completedAt: null,
        createdAt: new Date(),
      },
    ],
  };

  beforeEach(async () => {
    // Create a test data file before each test
    await fs.writeFile(testDataFilePath, JSON.stringify(initialData));

    const module: TestingModule = await Test.createTestingModule({
      providers: [TasksService],
    })
      .overrideProvider(TasksService)
      .useFactory({
        factory: () => {
          const service = new TasksService();
          // Override the dataFilePath to use the test file
          (service as any).dataFilePath = testDataFilePath;
          return service;
        },
      })
      .compile();

    service = module.get<TasksService>(TasksService);
  });

  afterEach(async () => {
    // Clean up the test data file after each test
    await fs.unlink(testDataFilePath);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new task', async () => {
      const createTaskDto: CreateTaskDto = {
        ipAddress: faker.internet.ipv4(),
        description: faker.lorem.sentences(),
        title: faker.lorem.sentences(),
      };

      const newTask = await service.create(createTaskDto);

      expect(newTask).toBeDefined();
      expect(newTask.id).toBeDefined();
      expect(newTask.title).toBe(createTaskDto.title);
      expect(newTask.description).toBe(createTaskDto.description);
      expect(newTask.isCompleted).toBe(false);
      expect(newTask.completedAt).toBeNull();
      expect(newTask.createdAt).toBeInstanceOf(Date);
    });

    it('should store tasks under the correct IP address', async () => {
      const createTaskDto1: CreateTaskDto = {
        ipAddress: '192.168.1.1',
        description: faker.lorem.sentences(),
        title: faker.lorem.sentences(),
      };

      const createTaskDto2: CreateTaskDto = {
        ipAddress: '192.168.1.2',
        description: faker.lorem.sentences(),
        title: faker.lorem.sentences(),
      };

      await service.create(createTaskDto1);
      await service.create(createTaskDto2);

      const tasks1 = await service.findAll('192.168.1.1');
      const tasks2 = await service.findAll('192.168.1.2');

      expect(tasks1.length).toBe(1);
      expect(tasks2.length).toBe(1);
    });
  });

  describe('findAll', () => {
    it('should return all tasks for a given IP address', async () => {
      const tasks = await service.findAll('127.0.0.1');

      expect(tasks.length).toBe(1);
      expect(tasks[0].id).toBe('task-1');
    });

    it('should return an empty array if no tasks exist for the IP address', async () => {
      const tasks = await service.findAll(faker.internet.ipv4());

      expect(tasks).toEqual([]);
    });
  });

  describe('update', () => {
    it('should update an existing task', async () => {
      const updateTaskDto: UpdateTaskDto = {
        description: 'Updated Task',
        isCompleted: true,
      };

      const updatedTask = await service.update(
        'task-1',
        updateTaskDto,
        '127.0.0.1',
      );

      expect(updatedTask.description).toBe('Updated Task');
      expect(updatedTask.isCompleted).toBe(true);
      expect(updatedTask.completedAt).toBeInstanceOf(Date);
    });

    it('should throw NotFoundException if task does not exist', async () => {
      const updateTaskDto: UpdateTaskDto = {
        description: 'Updated Task',
      };

      await expect(
        service.update('non-existent-task', updateTaskDto, '127.0.0.1'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if IP address does not exist', async () => {
      const updateTaskDto: UpdateTaskDto = {
        description: 'Updated Task',
      };
      await expect(
        service.update('task-1', updateTaskDto, 'non-existent-ip'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a task', async () => {
      await service.remove('task-1', '127.0.0.1');
      const tasks = await service.findAll('127.0.0.1');

      console.log('tasks =>', tasks);

      expect(tasks[0]).toBe(null);
    });

    it('should throw NotFoundException if task does not exist', async () => {
      await expect(
        service.remove('non-existent-task', '127.0.0.1'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if IP address does not exist', async () => {
      await expect(service.remove('task-1', 'non-existent-ip')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
