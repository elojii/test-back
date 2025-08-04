import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { CreateFolderDto } from '@firebase/folders/dto/create-folder.dto';
import { FirebaseFoldersService } from '@firebase/folders/folders.service';

@Controller('folders')
export class FoldersController {
  constructor(private readonly foldersService: FirebaseFoldersService) {}

  @Post('create-folder')
  public async create(@Body() folderDto: CreateFolderDto) {
    try {
      return await this.foldersService.createFolder(folderDto);
    } catch (error) {
      console.log(error);
    }
  }

  @Get('get-root-folders')
  public async findRootAll(@Query('userId') userId: string) {
    console.log("userId", userId)
    return await this.foldersService.getRootFolders(userId);
  }
  @Get('get-nested-folders')
  public async findAll(@Query() userId: string, @Query() parentId: string) {
    return await this.foldersService.getFoldersByParentId(parentId, userId);
  }

  @Get('test')
  test() {
    return { message: 'sadasdasdasd' };
  }
}
