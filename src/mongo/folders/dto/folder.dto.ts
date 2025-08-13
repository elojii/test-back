import { Types } from 'mongoose';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsArray,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class Collaborator {
  @ApiProperty({
    example: 'john@example.com',
    description: 'Collaborator email',
  })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'user123', description: 'User ID of collaborator' })
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiProperty({
    example: 'collab123',
    description: 'Collaborator internal ID',
  })
  @IsNotEmpty()
  @IsString()
  id: string;
}

export class CreateFolderDto {
  @ApiProperty({ example: 'My Folder', description: 'Folder name' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({
    example: null,
    description: 'Parent folder ID if nested',
  })
  @IsOptional()
  @IsString()
  parentId: Types.ObjectId | null;

  @ApiProperty({ type: [Collaborator], description: 'List of collaborators' })
  @IsArray()
  @Type(() => Collaborator)
  collaborators: Collaborator[];
}

export class EditFolderDto {
  @ApiProperty({ example: 'folder123', description: 'Folder ID to edit' })
  @IsNotEmpty()
  @IsString()
  id: Types.ObjectId;

  @ApiProperty({ example: 'Updated Folder', description: 'New folder name' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    type: [Collaborator],
    description: 'Updated list of collaborators',
  })
  @IsArray()
  @Type(() => Collaborator)
  collaborators: Collaborator[];
}
