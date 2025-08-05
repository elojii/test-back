import { Inject, Injectable } from '@nestjs/common';

import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseAuthService {
  constructor(
    @Inject('FIREBASE_ADMIN') private readonly firebaseAdmin: admin.app.App,
  ) {}

  public async getUsersFromEmails(
    emails?: string[],
  ): Promise<{ userId: string; email: string }[]> {
    if (!emails || emails.length === 0) return [];

    const auth = this.firebaseAdmin.auth();

    const users = await Promise.all(
      emails.map((email) =>
        auth.getUserByEmail(email).catch((err) => {
          console.warn(`User with email "${email}" not found:`, err);
          return null;
        }),
      ),
    );

    // Filter out nulls and return only the uid
    return users
      .filter((user): user is admin.auth.UserRecord => user !== null)
      .map((user) => ({ userId: user.uid, email: user.email! }));
  }
}
