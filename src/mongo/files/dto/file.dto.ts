import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateFileDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  parentId?: Types.ObjectId;

  @IsOptional()
  file?: Express.Multer.File | null;
}

export class EditFileDto {
  @IsNotEmpty()
  @IsString()
  id: Types.ObjectId;

  @IsNotEmpty()
  @IsString()
  name: string;
}
