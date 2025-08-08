import { Module } from '@nestjs/common';
import { MongoFoldersModule } from '@mongo/folders/folders.module';
import { FoldersController } from '@folders/folders.controller';
import { MongoAuthModule } from '@mongo/auth/auth.module';
import { MongoUserModule } from '@mongo/user/user.module';

@Module({
  imports: [MongoFoldersModule, MongoAuthModule, MongoUserModule],
  controllers: [FoldersController],
})
export class FoldersModule {}
