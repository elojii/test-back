import { Schema } from 'mongoose';

export const AuthSchema = new Schema({
  userId: { type: String, required: true },
  refreshToken: { type: String, required: true },
});
