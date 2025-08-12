import { Types } from 'mongoose';

export interface Auth {
  refreshToken: string;
  userId: Types.ObjectId;
}
