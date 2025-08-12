import { Module } from '@nestjs/common';
import { MongoFilesService } from './files.service';
import { MongooseModule } from '@nestjs/mongoose';
import { FILE_COLLECTION_NAME } from './files.constants';
import { FileSchema } from '@schemas/file.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FILE_COLLECTION_NAME, schema: FileSchema },
    ]),
  ],
  exports: [MongoFilesService],
  providers: [MongoFilesService],
})
export class MongoFilesModule {}
