import { Inject, Injectable } from '@nestjs/common';
import { Firestore } from 'firebase-admin/firestore';

import * as admin from 'firebase-admin';
import { Collaborator, FirebaseFolderSchema } from 'types';

@Injectable()
export class FirebaseFoldersService {
  private readonly collectionName = 'folders';

  constructor(
    @Inject('FIREBASE_ADMIN') private readonly firebaseAdmin: admin.app.App,
  ) {}

  private get firestore(): Firestore {
    return this.firebaseAdmin.firestore();
  }

  public async createFolder(createFolderDto: FirebaseFolderSchema) {
    const docRef = this.firestore.collection(this.collectionName).doc();
    const folderData = {
      id: docRef.id,
      ...createFolderDto,
    };

    await docRef.set(folderData);
    return folderData;
  }

  public async getRootFolders(userId: string) {
    const snapshot = await this.firestore
      .collection(this.collectionName)
      .where('parentId', '==', null)
      .where('userId', '==', userId)
      .get();

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  }

  public async getFoldersByParentId(parentId: string, userId: string) {
    const snapshot = await this.firestore
      .collection(this.collectionName)
      .where('parentId', '==', parentId)
      .where('userId', '==', userId)
      .get();

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  }

  public async getCollaboratedFolders(userId: string) {
    const snapshot = await this.firestore
      .collection(this.collectionName)
      .where('collaboratorUserIds', 'array-contains', userId)
      .get();

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  }

  public async moveFolder(folderId: string, newParentId: string) {
    const folderRef = this.firestore
      .collection(this.collectionName)
      .doc(folderId);
    const folderSnapshot = await folderRef.get();

    if (!folderSnapshot.exists) {
      throw new Error(`Folder with ID ${folderId} does not exist.`);
    }

    await folderRef.update({ parentId: newParentId });

    const updatedFolder = (await folderRef.get()).data();
    return updatedFolder;
  }

  public async editFolder(
    folderId: string,
    name: string,
    collaborators: Collaborator[],
  ) {
    const folderRef = this.firestore
      .collection(this.collectionName)
      .doc(folderId);

    const folderSnapshot = await folderRef.get();

    if (!folderSnapshot.exists) {
      throw new Error(`Folder with ID ${folderId} does not exist.`);
    }

    await folderRef.update({
      name,
      collaborators,
    });

    const updatedSnapshot = await folderRef.get();
    return updatedSnapshot.data();
  }

  public async deleteFolder(folderId: string): Promise<void> {
    const folderRef = this.firestore.collection('folders').doc(folderId);
    const folderDoc = await folderRef.get();

    if (!folderDoc.exists) {
      throw new Error(`Folder with ID '${folderId}' not found`);
    }

    await folderRef.delete();
  }
}
