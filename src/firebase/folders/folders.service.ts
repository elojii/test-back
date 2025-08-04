import { Inject, Injectable } from '@nestjs/common';
import { Firestore } from 'firebase-admin/firestore';
import { CreateFolderDto } from './dto/create-folder.dto';

import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseFoldersService {
  private readonly collectionName = 'folders';

  constructor(
    @Inject('FIREBASE_ADMIN') private readonly firebaseAdmin: admin.app.App,
  ) {}

  private get firestore(): Firestore {
    return this.firebaseAdmin.firestore();
  }

  public async createFolder(createFolderDto: CreateFolderDto) {
    const docRef = this.firestore.collection(this.collectionName).doc();
    console.log('docRef', docRef);
    const folderData = {
      id: docRef.id,
      ...createFolderDto,
    };

    console.log('folderData', folderData);
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
}
