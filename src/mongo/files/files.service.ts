import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FILE_COLLECTION_NAME } from './files.constants';
import { Model, Types } from 'mongoose';
import { CreateFileInput, Files } from './files.interface';

@Injectable()
export class MongoFilesService {
  constructor(
    @InjectModel(FILE_COLLECTION_NAME)
    private readonly FileModel: Model<Files>,
  ) {}

  public async createFile(createFileDto: CreateFileInput): Promise<Files> {
    const newFile = new this.FileModel(createFileDto);
    await newFile.save();
    return newFile.toObject();
  }

  public async getRootFiles(userId: Types.ObjectId): Promise<Files[]> {
    const folders = await this.FileModel.find({
      parentId: null,
      userId,
    }).lean();

    return folders;
  }

  public async getFilesByParentId(
    parentId: string,
    userId: Types.ObjectId,
  ): Promise<Files[]> {
    return this.FileModel.find({ parentId, userId }).lean();
  }

  public async moveFile(fileId: string, newParentId: string): Promise<Files> {
    const updatedFolder = await this.FileModel.findByIdAndUpdate(
      fileId,
      { parentId: newParentId },
      { new: true },
    ).lean();

    if (!updatedFolder) {
      throw new NotFoundException(`Folder with ID ${fileId} does not exist.`);
    }
    return updatedFolder;
  }

  public async editFile(fileId: Types.ObjectId, name: string): Promise<Files> {
    const updatedFile = await this.FileModel.findByIdAndUpdate(
      fileId,
      { name },
      { new: true },
    ).lean();

    if (!updatedFile) {
      throw new NotFoundException(
        `Folder with ID ${fileId.toString()} does not exist.`,
      );
    }
    return updatedFile;
  }

  public async deleteFile(fileId: string): Promise<void> {
    const result = await this.FileModel.deleteOne({ _id: fileId });
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Folder with ID '${fileId}' not found`);
    }
  }
}
