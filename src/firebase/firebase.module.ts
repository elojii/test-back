import { Module } from '@nestjs/common';
import { FirebaseAdminProvider } from './firebase.provider';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  exports: [FirebaseAdminProvider],
  providers: [FirebaseAdminProvider],
})
export class FirebaseModule {}
