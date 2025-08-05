import { Module } from '@nestjs/common';
import { FirebaseFoldersModule } from '@firebase/folders/folders.module';
import { FoldersController } from '@folders/folders.controller';
import { FirebaseAuthModule } from '@firebase/auth/auth.module';

@Module({
  imports: [FirebaseFoldersModule, FirebaseAuthModule],
  controllers: [FoldersController],
})
export class FoldersModule {}
