import { Module } from '@nestjs/common';
import { FirebaseFoldersModule } from '@firebase/folders/folders.module';
import { FoldersController } from '@folders/folders.controller';

@Module({
  imports: [FirebaseFoldersModule],
  controllers: [FoldersController],
})
export class FoldersModule {}
