import { Module } from '@nestjs/common';
import { MongoFoldersService } from './folders.service';
import { FolderSchema } from '@schemas/folder.schema';
import { FOLDER_COLLECTION_NAME } from './folders.constants';

import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FOLDER_COLLECTION_NAME, schema: FolderSchema },
    ]),
  ],
  exports: [MongoFoldersService],
  providers: [MongoFoldersService],
})
export class MongoFoldersModule {}
