import { User } from '@decorators/request';
import { CreateFileDto, EditFileDto } from '@mongo/files';
import { MongoFilesService } from '@mongo/files/files.service';
import type { JwtAccessTokenPayload } from '@mongo/token';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('files')
export class FilesController {
  constructor(private readonly mongoFilesService: MongoFilesService) {}

  @Post('create-file')
  @UseInterceptors(FileInterceptor('imageFile'))
  public async createFile(
    @User() user: JwtAccessTokenPayload,
    @UploadedFile() imageFile: Express.Multer.File,
    @Body() fileDto: CreateFileDto,
  ) {
    try {
      const userId = user.userId;

      const fileInput = {
        userId,
        name: fileDto.name,
        parentId: fileDto.parentId,
        imageFile,
      };

      return await this.mongoFilesService.createFile(fileInput);
    } catch (error) {
      console.error(error);
    }
  }

  @Get('get-root-files')
  public async findRootAll(@User() user: JwtAccessTokenPayload) {
    return await this.mongoFilesService.getRootFiles(user.userId);
  }

  @Get('get-nested-files')
  public async findAll(
    @User() user: JwtAccessTokenPayload,
    @Query('folderId') folderId: string,
  ) {
    console.log(folderId);
    return await this.mongoFilesService.getFilesByParentId(
      folderId,
      user.userId,
    );
  }

  @Patch('move-file')
  public async moveFile(@Body() body: { fileId: string; newParentId: string }) {
    console.log(body);
    return await this.mongoFilesService.moveFile(body.fileId, body.newParentId);
  }

  @Patch('edit-file')
  public async editFile(@Body() fileDto: EditFileDto) {
    return await this.mongoFilesService.editFile(fileDto.id, fileDto.name);
  }

  @Delete('delete/:id')
  public async deleteFile(@Param('id') id: string) {
    return await this.mongoFilesService.deleteFile(id);
  }
}
