import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateTaskDto } from './create-task.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @IsOptional()
  @IsBoolean()
  @ApiPropertyOptional({
    type: Boolean,
    description: 'Task completion status',
    example: true,
  })
  isCompleted?: boolean;
}
