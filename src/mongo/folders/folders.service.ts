import { Injectable, NotFoundException } from '@nestjs/common';

import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateFolderInput, Folders } from './folders.interface';
import { FOLDER_COLLECTION_NAME } from './folders.constants';
import { Collaborator } from './dto/folder.dto';

@Injectable()
export class MongoFoldersService {
  constructor(
    @InjectModel(FOLDER_COLLECTION_NAME)
    private readonly FolderModel: Model<Folders>,
  ) {}

  public async createFolder(
    createFolderDto: CreateFolderInput,
  ): Promise<Folders> {
    const newFolder = new this.FolderModel(createFolderDto);
    await newFolder.save();
    return newFolder.toObject();
  }

  public async getRootFolders(userId: Types.ObjectId): Promise<Folders[]> {
    return await this.FolderModel.find({
      parentId: null,
      userId,
    }).lean();
  }

  public async getFoldersByParentId(
    parentId: string,
    userId: Types.ObjectId,
  ): Promise<Folders[]> {
    return this.FolderModel.find({ parentId, userId }).lean();
  }

  public async getCollaboratedFolders(
    userId: Types.ObjectId,
  ): Promise<Folders[]> {
    // Find folders where collaborators array contains an element with userId
    return this.FolderModel.find({
      collaborators: { $elemMatch: { userId } },
    }).lean();
  }

  public async moveFolder(
    folderId: string,
    newParentId: string,
  ): Promise<Folders> {
    const updatedFolder = await this.FolderModel.findByIdAndUpdate(
      folderId,
      { parentId: newParentId },
      { new: true },
    ).lean();

    if (!updatedFolder) {
      throw new NotFoundException(`Folder with ID ${folderId} does not exist.`);
    }
    return updatedFolder;
  }

  public async editFolder(
    folderId: Types.ObjectId,
    name: string,
    collaborators: Collaborator[],
  ): Promise<Folders> {
    const updatedFolder = await this.FolderModel.findByIdAndUpdate(
      folderId,
      { name, collaborators },
      { new: true },
    ).lean();

    if (!updatedFolder) {
      throw new NotFoundException(
        `Folder with ID ${folderId.toString()} does not exist.`,
      );
    }
    return updatedFolder;
  }

  public async deleteFolder(folderId: string): Promise<void> {
    const result = await this.FolderModel.deleteOne({ _id: folderId });
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Folder with ID '${folderId}' not found`);
    }
  }
}
