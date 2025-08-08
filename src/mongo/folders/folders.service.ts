import { Injectable, NotFoundException } from '@nestjs/common';

import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Folders } from './folders.interface';
import { FOLDER_COLLECTION_NAME } from './folders.constants';
import { Collaborator, CreateFolderDto } from './dto/folder.dto';
import { MongoUserService } from '@mongo/user/user.service';

@Injectable()
export class MongoFoldersService {
  constructor(
    @InjectModel(FOLDER_COLLECTION_NAME)
    private readonly FolderModel: Model<Folders>,
  ) {}

  public async createFolder(
    createFolderDto: CreateFolderDto,
  ): Promise<Folders> {
    const newFolder = new this.FolderModel(createFolderDto);
    await newFolder.save();
    return newFolder.toObject();
  }

  public async getRootFolders(userId: string): Promise<Folders[]> {
    const folders = await this.FolderModel.find({
      parentId: null,
      userId,
    }).lean();

    console.log(folders);
    return folders;
  }
  // /*
  // public async getFoldersByParentId(parentId: string, userId: string) {
  //   const snapshot = await this.firestore
  //     .collection(this.collectionName)
  //     .where('parentId', '==', parentId)
  //     .where('userId', '==', userId)
  //     .get();
  //
  //   return snapshot.docs.map((doc) => ({
  //     id: doc.id,
  //     ...doc.data(),
  //   }));
  // }
  // */
  public async getFoldersByParentId(
    parentId: string,
    userId: string,
  ): Promise<Folders[]> {
    return this.FolderModel.find({ parentId, userId }).lean();
  }

  // /*
  // public async getCollaboratedFolders(userId: string) {
  //   const snapshot = await this.firestore.collection(this.collectionName).get();
  //
  //   const folders = snapshot.docs
  //     .map((doc) => {
  //       const data = doc.data();
  //
  //       return {
  //         id: doc.id,
  //         ...data,
  //       } as { id: string; collaborators: Collaborator[] };
  //     })
  //     .filter(
  //       (folder) =>
  //         Array.isArray(folder.collaborators) &&
  //         folder.collaborators.some((collab) => collab.userId === userId),
  //     );
  //
  //   console.log(folders);
  //
  //   return folders;
  // }
  // */
  public async getCollaboratedFolders(userId: string): Promise<Folders[]> {
    // Find folders where collaborators array contains an element with userId
    return this.FolderModel.find({
      collaborators: { $elemMatch: { userId } },
    }).lean();
  }

  // /*
  // public async moveFolder(folderId: string, newParentId: string) {
  //   const folderRef = this.firestore
  //     .collection(this.collectionName)
  //     .doc(folderId);
  //   const folderSnapshot = await folderRef.get();
  //
  //   if (!folderSnapshot.exists) {
  //     throw new Error(`Folder with ID ${folderId} does not exist.`);
  //   }
  //
  //   await folderRef.update({ parentId: newParentId });
  //
  //   const updatedFolder = (await folderRef.get()).data();
  //   return updatedFolder;
  // }
  // */
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

  // /*
  // public async editFolder(
  //   folderId: string,
  //   name: string,
  //   collaborators: Collaborator[],
  // ) {
  //   const folderRef = this.firestore
  //     .collection(this.collectionName)
  //     .doc(folderId);
  //
  //   const folderSnapshot = await folderRef.get();
  //
  //   if (!folderSnapshot.exists) {
  //     throw new Error(`Folder with ID ${folderId} does not exist.`);
  //   }
  //
  //   await folderRef.update({
  //     name,
  //     collaborators,
  //   });
  //
  //   const updatedSnapshot = await folderRef.get();
  //   return updatedSnapshot.data();
  // }
  // */
  public async editFolder(
    folderId: string,
    name: string,
    collaborators: Collaborator[],
  ): Promise<Folders> {
    const updatedFolder = await this.FolderModel.findByIdAndUpdate(
      folderId,
      { name, collaborators },
      { new: true },
    ).lean();

    if (!updatedFolder) {
      throw new NotFoundException(`Folder with ID ${folderId} does not exist.`);
    }
    return updatedFolder;
  }

  // /*
  // public async deleteFolder(folderId: string): Promise<void> {
  //   const folderRef = this.firestore.collection('folders').doc(folderId);
  //   const folderDoc = await folderRef.get();
  //
  //   if (!folderDoc.exists) {
  //     throw new Error(`Folder with ID '${folderId}' not found`);
  //   }
  //
  //   await folderRef.delete();
  // }
  // */
  public async deleteFolder(folderId: string): Promise<void> {
    console.log('folderId', folderId);
    const result = await this.FolderModel.deleteOne({ _id: folderId });
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Folder with ID '${folderId}' not found`);
    }
  }

  // public async getCollaboratorsFromEmails(
  //   emails?: string[],
  // ): Promise<Collaborator[]> {
  //   if (!emails || emails.length === 0) return [];

  //   const auth = this.firebaseAdmin.auth();

  //   const users = await Promise.all(
  //     emails.map((email) =>
  //       auth.getUserByEmail(email).catch((err) => {
  //         console.warn(`User with email "${email}" not found:`, err);
  //         return null;
  //       }),
  //     ),
  //   );

  //   // Filter out nulls and return only the uid
  //   return users
  //     .filter((user): user is admin.auth.UserRecord => user !== null)
  //     .map((user) => ({ userId: user.uid, email: user.email!, id: uuidv4() }));
  // }
}
