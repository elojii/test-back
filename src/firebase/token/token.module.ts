import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { FirebaseModule } from '@firebase/firebase.module';

@Module({
  imports: [FirebaseModule],
  providers: [TokenService],
  exports: [TokenService],
})
export class FirebaseTokenModule {}
