import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateFileDto {
  @ApiProperty({ example: 'Document.pdf', description: 'File name' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({
    example: null,
    description: 'Parent folder ID',
    type: String,
  })
  @IsOptional()
  @IsString()
  parentId?: Types.ObjectId;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description: 'File to upload',
  })
  @IsOptional()
  file?: Express.Multer.File | null;
}

export class EditFileDto {
  @ApiProperty({
    example: 'file123',
    description: 'File ID to edit',
    type: String,
  })
  @IsNotEmpty()
  @IsString()
  id: Types.ObjectId;

  @ApiProperty({ example: 'UpdatedDocument.pdf', description: 'New file name' })
  @IsNotEmpty()
  @IsString()
  name: string;
}
