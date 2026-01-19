import { IsOptional, IsString, IsDateString, IsEnum } from 'class-validator';

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
  @IsEnum(['low', 'medium', 'high'])
  priority?: string;

  @IsOptional()
  @IsEnum(['todo', 'in-progress', 'completed'])
  status?: string;

  @IsOptional()
  @IsString()
  assignedTo?: string;
}