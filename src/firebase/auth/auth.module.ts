import { Module } from '@nestjs/common';
import { FirebaseAuthService } from './auth.service';
import { FirebaseModule } from '@firebase/firebase.module';

@Module({
  imports: [FirebaseModule],
  exports: [FirebaseAuthService],
  providers: [FirebaseAuthService],
})
export class FirebaseAuthModule {}
