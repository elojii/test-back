import {
  Controller,
  Get,
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
import { CreateFolderDto, EditFolderDto, FolderEntity } from '@mongo/folders';
import {
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('folders')
@ApiCookieAuth()
@Controller('folders')
export class FoldersController {
  constructor(
    private readonly mongoFoldersService: MongoFoldersService,
    private readonly userService: MongoUserService,
  ) {}

  @Post('create-folder')
  @ApiOperation({ summary: 'Create a new folder' })
  @ApiResponse({
    status: 201,
    description: 'Folder created successfully',
    type: FolderEntity,
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
  @ApiOperation({ summary: 'Get all root folders for the current user' })
  @ApiResponse({
    status: 200,
    description: 'List of root folders',
    type: [FolderEntity],
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
    return await this.mongoFoldersService.getRootFolders(user.userId);
  }

  @Get('get-nested-folders')
  @ApiOperation({ summary: 'Get all nested folders inside a parent folder' })
  @ApiResponse({
    status: 200,
    description: 'List of nested folders',
    type: [FolderEntity],
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
    return await this.mongoFoldersService.getFoldersByParentId(
      folderId,
      user.userId,
    );
  }

  @Get('get-collab-folders')
  @ApiOperation({ summary: 'Get folders where the user is a collaborator' })
  @ApiResponse({
    status: 200,
    description: 'List of collaborated folders',
    type: [FolderEntity],
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
  public async findCollab(@User() user: JwtAccessTokenPayload) {
    return await this.mongoFoldersService.getCollaboratedFolders(user.userId);
  }

  @Patch('move-folder')
  @ApiOperation({ summary: 'Move folder to a new parent folder' })
  @ApiResponse({ status: 200, description: 'Folder moved successfully' })
  @ApiResponse({
    status: 401,
    description:
      'Unauthorized — No access token provided or invalid/expired token',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  public async moveFolder(
    @Body() body: { folderId: string; newParentId: string },
  ) {
    await this.mongoFoldersService.moveFolder(body.folderId, body.newParentId);
  }

  @Patch('edit-folder')
  @ApiOperation({ summary: 'Edit folder name or collaborators' })
  @ApiResponse({ status: 200, description: 'Folder edited successfully' })
  @ApiResponse({
    status: 401,
    description:
      'Unauthorized — No access token provided or invalid/expired token',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  public async editFolder(@Body() folderDto: EditFolderDto) {
    await this.mongoFoldersService.editFolder(
      folderDto.id,
      folderDto.name,
      folderDto.collaborators,
    );
  }

  @Delete('delete/:id')
  @ApiOperation({ summary: 'Delete a folder by ID' })
  @ApiResponse({ status: 200, description: 'Folder deleted successfully' })
  @ApiResponse({
    status: 401,
    description:
      'Unauthorized — No access token provided or invalid/expired token',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  public async deleteFolder(@Param('id') id: string) {
    await this.mongoFoldersService.deleteFolder(id);
  }

  @Get('test')
  @ApiOperation({ summary: 'Test endpoint' })
  @ApiResponse({
    status: 200,
    description: 'Test message',
    schema: { example: { message: 'test' } },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
  })
  test() {
    return { message: 'test' };
  }
}
