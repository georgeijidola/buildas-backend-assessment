import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsIP } from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Task title',
    example: faker.lorem.sentence(),
  })
  title: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Task description',
    example: faker.lorem.paragraph(),
  })
  description: string;

  @IsIP()
  @ApiProperty({
    type: String,
    description: 'Task IP address',
    example: faker.internet.ipv4(),
  })
  ipAddress: string;
}
