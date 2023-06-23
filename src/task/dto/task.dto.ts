import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  IsBoolean,
  IsOptional,
  IsNumber,
} from 'class-validator';

export class TaskInput {
  @IsString()
  @MinLength(5)
  @MaxLength(65)
  @IsNotEmpty()
  @ApiProperty()
  title: string;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({ default: false })
  done: boolean;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  folderId: number;
}

export class PutTaskInput {
  @IsString()
  @MinLength(5)
  @MaxLength(65)
  @IsNotEmpty()
  @ApiProperty()
  title: string;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty()
  done: boolean;
}
export class PatchTaskInput {
  @IsOptional()
  @IsString()
  @ApiProperty()
  title: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty()
  done: boolean;

  @IsOptional()
  @IsNumber()
  @ApiProperty()
  folderId: number;
}
