import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class FileEntity {
  @ApiProperty({ example: 'file123', description: 'File ID' })
  id: string; // use string for Swagger, even if in DB it's ObjectId

  @ApiProperty({ example: 'Document.pdf', description: 'File name' })
  name: string;

  @ApiProperty({
    example: null,
    description: 'Parent folder ID',
    nullable: true,
  })
  parentId?: string | null;

  @ApiProperty({ example: 'user123', description: 'Owner user ID' })
  userId: string;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description: 'Uploaded file content',
  })
  file?: string;

  @ApiProperty({
    example: '2025-08-13T08:00:00.000Z',
    description: 'Creation date',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2025-08-13T08:00:00.000Z',
    description: 'Last update date',
  })
  updatedAt: Date;
}
