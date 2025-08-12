import { Module } from '@nestjs/common';
import { FilesController } from './files.controller';
import { MongoFilesModule } from '@mongo/files/files.module';

@Module({
  controllers: [FilesController],
  imports: [MongoFilesModule],
})
export class FilesModule {}
