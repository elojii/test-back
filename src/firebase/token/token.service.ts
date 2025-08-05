import { Inject, Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class TokenService {
  constructor(
    @Inject('FIREBASE_ADMIN') private readonly firebaseAdmin: admin.app.App,
  ) {}

  public async verifyToken(
    idToken: string,
  ): Promise<admin.auth.DecodedIdToken> {
    return this.firebaseAdmin.auth().verifyIdToken(idToken);
  }
}
