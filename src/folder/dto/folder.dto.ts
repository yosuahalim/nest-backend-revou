import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
} from 'class-validator';

export class FolderInput {
  @IsString()
  @MinLength(5)
  @MaxLength(65)
  @IsNotEmpty()
  @ApiProperty()
  title: string;

  // @IsNotEmpty()
  // @ApiProperty()
  // userEmail: string;
}

export class UpdateFolder {
  @IsOptional()
  @IsString()
  @ApiProperty()
  title: string;
}
