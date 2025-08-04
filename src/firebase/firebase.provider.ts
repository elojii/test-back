import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';

export const FirebaseAdminProvider = {
  provide: 'FIREBASE_ADMIN',
  inject: [ConfigService],
  useFactory: (configService: ConfigService): admin.app.App => {
    if (!admin.apps.length) {
      return admin.initializeApp({
        credential: admin.credential.cert({
          projectId: configService.get<string>('FIREBASE_PROJECT_ID'),
          clientEmail: configService.get<string>('FIREBASE_CLIENT_EMAIL'),
          privateKey: configService
            .get<string>('FIREBASE_PRIVATE_KEY')
            ?.replace(/\\n/g, '\n'),
        }),
      });
    }
    return admin.app();
  },
};
