import {
  Controller,
  Get,
  // Post,
  Body,
  Query,
  Patch,
  Delete,
  Param,
  Post,
} from '@nestjs/common';
import { MongoFoldersService } from '@mongo/folders/folders.service';
import { MongoUserService } from '@mongo/user/user.service';
import { User } from '@decorators/request';
import type { JwtAccessTokenPayload } from '@mongo/token';
import { CreateFolderDto, EditFolderDto } from '@mongo/folders';

@Controller('folders')
export class FoldersController {
  constructor(
    private readonly mongoFoldersService: MongoFoldersService,
    private readonly userService: MongoUserService,
  ) {}

  @Post('create-folder')
  public async createFolder(
    @User() user: JwtAccessTokenPayload,
    @Body() folderDto: CreateFolderDto,
  ) {
    try {
      const userId = user.userId;

      const filteredCollaborators =
        await this.userService.getCollaboratorsFromEmails(
          folderDto.collaborators.map((c) => c.email),
        );

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { collaborators, ...rest } = folderDto;

      const folderInput = {
        ...rest,
        userId,
        collaborators: filteredCollaborators,
      };

      return await this.mongoFoldersService.createFolder(folderInput);
    } catch (error) {
      console.error(error);
    }
  }

  @Get('get-root-folders')
  public async findRootAll(@User() user: JwtAccessTokenPayload) {
    return await this.mongoFoldersService.getRootFolders(user.userId);
  }

  @Get('get-nested-folders')
  public async findAll(
    @User() user: JwtAccessTokenPayload,
    @Query('folderId') folderId: string,
  ) {
    return await this.mongoFoldersService.getFoldersByParentId(
      folderId,
      user.userId,
    );
  }

  @Get('get-collab-folders')
  public async findCollab(@User() user: JwtAccessTokenPayload) {
    return await this.mongoFoldersService.getCollaboratedFolders(user.userId);
  }

  @Patch('move-folder')
  public async moveFolder(
    @Body() body: { folderId: string; newParentId: string },
  ) {
    return await this.mongoFoldersService.moveFolder(
      body.folderId,
      body.newParentId,
    );
  }

  @Patch('edit-folder')
  public async editFolder(@Body() folderDto: EditFolderDto) {
    return await this.mongoFoldersService.editFolder(
      folderDto.id,
      folderDto.name,
      folderDto.collaborators,
    );
  }

  @Delete('delete/:id')
  public async deleteFolder(@Param('id') id: string) {
    return await this.mongoFoldersService.deleteFolder(id);
  }

  @Get('test')
  test() {
    return { message: 'test' };
  }
}
