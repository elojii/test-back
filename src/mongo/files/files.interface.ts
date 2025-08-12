import { Document, Types } from 'mongoose';

export interface Files extends Document {
  name: string;
  parentId?: Types.ObjectId;
  userId: string;
  createdAt: Date;
  imageFile?: File | null;
}

export interface CreateFileInput {
  userId: Types.ObjectId;
  name: string;
  parentId?: Types.ObjectId;
}
