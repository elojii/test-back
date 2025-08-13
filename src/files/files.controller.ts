import { User } from '@decorators/request';
import { CreateFileDto, EditFileDto, FileEntity } from '@mongo/files';
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
import {
  ApiConsumes,
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('files')
@ApiCookieAuth()
@Controller('files')
export class FilesController {
  constructor(private readonly mongoFilesService: MongoFilesService) {}

  @Post('create-file')
  @UseInterceptors(FileInterceptor('imageFile'))
  @ApiOperation({ summary: 'Create a new file' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({
    status: 201,
    description: 'File created successfully',
    type: FileEntity,
  })
  @ApiResponse({
    status: 401,
    description:
      'Unauthorized — No access token provided or invalid/expired token',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
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
  @ApiOperation({ summary: 'Get all root files for the current user' })
  @ApiResponse({
    status: 200,
    description: 'List of root files',
    type: [FileEntity],
  })
  @ApiResponse({
    status: 401,
    description:
      'Unauthorized — No access token provided or invalid/expired token',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  public async findRootAll(@User() user: JwtAccessTokenPayload) {
    return await this.mongoFilesService.getRootFiles(user.userId);
  }

  @Get('get-nested-files')
  @ApiOperation({ summary: 'Get all files inside a specific folder' })
  @ApiResponse({
    status: 200,
    description: 'List of nested files',
    type: [FileEntity],
  })
  @ApiResponse({
    status: 401,
    description:
      'Unauthorized — No access token provided or invalid/expired token',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  public async findAll(
    @User() user: JwtAccessTokenPayload,
    @Query('folderId') folderId: string,
  ) {
    return await this.mongoFilesService.getFilesByParentId(
      folderId,
      user.userId,
    );
  }

  @Patch('move-file')
  @ApiOperation({ summary: 'Move a file to a new parent folder' })
  @ApiResponse({
    status: 200,
    description: 'File moved successfully',
    type: FileEntity,
  })
  @ApiResponse({
    status: 401,
    description:
      'Unauthorized — No access token provided or invalid/expired token',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  public async moveFile(@Body() body: { fileId: string; newParentId: string }) {
    return await this.mongoFilesService.moveFile(body.fileId, body.newParentId);
  }

  @Patch('edit-file')
  @ApiOperation({ summary: 'Edit file name' })
  @ApiResponse({
    status: 200,
    description: 'File edited successfully',
    type: FileEntity,
  })
  @ApiResponse({
    status: 401,
    description:
      'Unauthorized — No access token provided or invalid/expired token',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  public async editFile(@Body() fileDto: EditFileDto) {
    return await this.mongoFilesService.editFile(fileDto.id, fileDto.name);
  }

  @Delete('delete/:id')
  @ApiOperation({ summary: 'Delete a file by ID' })
  @ApiResponse({
    status: 200,
    description: 'File deleted successfully',
    type: FileEntity,
  })
  @ApiResponse({
    status: 401,
    description:
      'Unauthorized — No access token provided or invalid/expired token',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  public async deleteFile(@Param('id') id: string) {
    return await this.mongoFilesService.deleteFile(id);
  }
}
