import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { Express } from 'express';

export class StorageObjectDto {
  @ApiProperty({ required: false })
  @IsString()
  comment?: string;

  @ApiProperty({ type: 'string', format: 'number', required: false })
  @IsNumber()
  outletId?: number;

  @ApiProperty({ type: 'string', format: 'binary', required: true })
  file: Express.Multer.File;
}
