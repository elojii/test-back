import { Document } from 'mongoose';

export interface Collaborator {
  email: string;
  userId: string;
  id: string;
}

export interface Folders extends Document {
  name: string;
  parentId?: string;
  userId: string;
  collaborators: Collaborator[];
  createdAt: Date;
}
