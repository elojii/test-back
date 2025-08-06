import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Patch,
  Delete,
  Param,
} from '@nestjs/common';
import {
  CreateFolderDto,
  EditFolderDto,
} from '@firebase/folders/dto/folder.dto';
import { FirebaseFoldersService } from '@firebase/folders/folders.service';
import { FirebaseAuthService } from '@firebase/auth/auth.service';

@Controller('folders')
export class FoldersController {
  constructor(
    private readonly foldersService: FirebaseFoldersService,
    private readonly authService: FirebaseAuthService,
  ) {}

  @Post('create-folder')
  public async create(@Body() folderDto: CreateFolderDto) {
    try {
      console.log('folderDto', folderDto.collaborators);

      const transformedCollaborators =
        await this.authService.getCollaboratorsFromEmails(
          folderDto.collaborators?.map((collaborator) => collaborator.email),
        );

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { collaborators, ...rest } = folderDto;

      const adjustedFolderDto = {
        ...rest,
        collaborators: transformedCollaborators,
      };

      return await this.foldersService.createFolder(adjustedFolderDto);
    } catch (error) {
      console.error(error);
    }
  }

  @Get('get-root-folders')
  public async findRootAll(@Query('userId') userId: string) {
    return await this.foldersService.getRootFolders(userId);
  }

  @Get('get-nested-folders')
  public async findAll(
    @Query('userId') userId: string,
    @Query('parentId') parentId: string,
  ) {
    return await this.foldersService.getFoldersByParentId(parentId, userId);
  }

  @Get('get-collab-folders')
  public async findCollab(@Query('userId') userId: string) {
    return await this.foldersService.getCollaboratedFolders(userId);
  }

  @Patch('move-folder')
  public async moveFolder(
    @Body() body: { folderId: string; newParentId: string; userId: string },
  ) {
    return this.foldersService.moveFolder(body.folderId, body.newParentId);
  }

  @Patch('edit-folder')
  public async editFolder(@Body() folderDto: EditFolderDto) {
    return this.foldersService.editFolder(
      folderDto.id,
      folderDto.name,
      folderDto.collaborators,
    );
  }

  @Delete('delete/:id')
  public async deleteFolder(@Param('id') id: string) {
    return this.foldersService.deleteFolder(id);
  }

  @Get('test')
  test() {
    return { message: 'test' };
  }
}
