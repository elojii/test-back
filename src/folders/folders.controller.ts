import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { CreateFolderDto } from '@firebase/folders/dto/create-folder.dto';
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
      const userIds = await this.authService.getUsersFromEmails(
        folderDto.collaboratorEmails,
      );

      delete folderDto.collaboratorEmails;

      const adjustedFolderDto = {
        ...folderDto,
        collaboratorsUserIds: userIds,
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
    console.log(userId, parentId);
    return await this.foldersService.getFoldersByParentId(parentId, userId);
  }

  @Get('test')
  test() {
    return { message: 'sadasdasdasd' };
  }
}
