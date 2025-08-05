import { Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

class Collaborator {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsEmail()
  email: string;
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
