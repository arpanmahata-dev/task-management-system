import { IsNotEmpty, IsString, IsDateString, IsEnum, IsOptional } from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsDateString()
  dueDate: string;

  @IsNotEmpty()
  @IsEnum(['low', 'medium', 'high'])
  priority: string;

  @IsOptional()
  @IsString()
  assignedTo?: string;
}