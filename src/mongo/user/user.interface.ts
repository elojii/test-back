import { Document, Types } from 'mongoose';

export interface User {
  _id: Types.ObjectId;
  email: string;
}

export interface UserCollaborator {
  email: string;
  userId: string;
  id: string;
}
