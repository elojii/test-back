import { Document, Types } from 'mongoose';

export interface CollaboratorInterface {
  email: string;
  userId: string;
  id: string;
}

export interface Folders extends Document {
  name: string;
  parentId?: Types.ObjectId;
  userId: string;
  collaborators: CollaboratorInterface[];
  createdAt: Date;
}

export interface CreateFolderInput {
  userId: Types.ObjectId;
  name: string;
  description?: string;
  collaborators: CollaboratorInterface[];
}
