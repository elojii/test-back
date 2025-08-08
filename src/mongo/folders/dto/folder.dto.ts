import { Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class Collaborator {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  id: string;
}

export class CreateFolderDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsOptional()
  @IsString()
  parentId: string | null;

  @IsArray()
  @IsString({ each: true })
  @IsEmail({}, { each: true })
  @Type(() => Collaborator)
  collaborators: Collaborator[];
}

export class EditFolderDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsArray()
  @IsString({ each: true })
  @IsEmail({}, { each: true })
  @Type(() => Collaborator)
  collaborators: Collaborator[];
}
