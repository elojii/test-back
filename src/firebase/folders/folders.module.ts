import { Module } from '@nestjs/common';
import { FirebaseFoldersService } from './folders.service';
import { FirebaseModule } from '@firebase/firebase.module';

@Module({
  imports: [FirebaseModule],
  exports: [FirebaseFoldersService],
  providers: [FirebaseFoldersService],
})
export class FirebaseFoldersModule {}
