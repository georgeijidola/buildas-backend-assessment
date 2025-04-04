import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './services/tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { NotFoundException } from '@nestjs/common';
import { faker } from '@faker-js/faker';

describe('TasksController', () => {
  let controller: TasksController;
  let service: TasksService;

  const mockTasksService = {
    create: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
          useValue: mockTasksService,
        },
      ],
    }).compile();

    controller = module.get<TasksController>(TasksController);
    service = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a task', async () => {
      const createTaskDto: CreateTaskDto = {
        ipAddress: faker.internet.ipv4(),
        description: faker.lorem.sentence(),
        title: faker.lorem.sentence(),
      };
      const expectedTask = {
        id: faker.string.uuid(),
        ...createTaskDto,
        isCompleted: false,
        completedAt: null,
        createdAt: new Date(),
      };
      mockTasksService.create.mockResolvedValue(expectedTask);

      const result = await controller.create(createTaskDto);
      expect(result).toEqual(expectedTask);
      expect(service.create).toHaveBeenCalledWith(createTaskDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of tasks', async () => {
      const ipAddress = faker.internet.ipv4();
      const expectedTasks = [
        {
          id: faker.string.uuid(),
          ipAddress,
          description: faker.lorem.sentence(),
          title: faker.lorem.sentence(),
          isCompleted: false,
          completedAt: null,
          createdAt: new Date(),
        },
      ];
      mockTasksService.findAll.mockResolvedValue(expectedTasks);

      const result = await controller.findAll(ipAddress);
      expect(result).toEqual(expectedTasks);
      expect(service.findAll).toHaveBeenCalledWith(ipAddress);
    });
  });

  describe('update', () => {
    it('should update a task', async () => {
      const id = faker.string.uuid();
      const ipAddress = faker.internet.ipv4();
      const updateTaskDto: UpdateTaskDto = {
        description: faker.lorem.sentence(),
        isCompleted: true,
      };
      const expectedTask = {
        id,
        ipAddress,
        ...updateTaskDto,
        completedAt: new Date(),
        createdAt: new Date(),
      };
      mockTasksService.update.mockResolvedValue(expectedTask);

      const result = await controller.update(id, ipAddress, updateTaskDto);
      expect(result).toEqual(expectedTask);
      expect(service.update).toHaveBeenCalledWith(id, updateTaskDto, ipAddress);
    });

    it('should throw NotFoundException if task does not exist', async () => {
      const id = faker.string.uuid();
      const ipAddress = faker.internet.ipv4();
      const updateTaskDto: UpdateTaskDto = {
        description: faker.lorem.sentence(),
      };
      mockTasksService.update.mockRejectedValue(new NotFoundException());

      await expect(
        controller.update(id, ipAddress, updateTaskDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a task', async () => {
      const id = faker.string.uuid();
      const ipAddress = faker.internet.ipv4();
      mockTasksService.remove.mockResolvedValue(undefined);

      await controller.remove(id, ipAddress);
      expect(service.remove).toHaveBeenCalledWith(id, ipAddress);
    });

    it('should throw NotFoundException if task does not exist', async () => {
      const id = faker.string.uuid();
      const ipAddress = faker.internet.ipv4();
      mockTasksService.remove.mockRejectedValue(new NotFoundException());

      await expect(controller.remove(id, ipAddress)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
