import { ApiProperty } from '@nestjs/swagger';
import { Collaborator } from '../dto/folder.dto';

export class FolderEntity {
  @ApiProperty({ example: 'folder123', description: 'Folder ID' })
  id: string; // use string, not Types.ObjectId

  @ApiProperty({ example: 'My Folder', description: 'Folder name' })
  name: string;

  @ApiProperty({
    example: null,
    description: 'Parent folder ID if nested',
    nullable: true,
  })
  parentId?: string | null;

  @ApiProperty({ example: 'user123', description: 'Owner user ID' })
  userId: string;

  @ApiProperty({ type: [Collaborator], description: 'List of collaborators' })
  collaborators: Collaborator[];

  @ApiProperty({
    example: '2025-08-13T08:00:00Z',
    description: 'Created at timestamp',
  })
  createdAt: Date;
}
