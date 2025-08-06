import { Module } from '@nestjs/common';
import { FirebaseTokenService } from './token.service';
import { FirebaseModule } from '@firebase/firebase.module';

@Module({
  imports: [FirebaseModule],
  providers: [FirebaseTokenService],
  exports: [FirebaseTokenService],
})
export class FirebaseTokenModule {}
