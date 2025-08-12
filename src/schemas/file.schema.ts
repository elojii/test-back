// folder.schema.ts
import { Schema } from 'mongoose';

export const FileSchema = new Schema({
  name: String,
  parentId: String,
  userId: String,
  createdAt: { type: Date, default: Date.now },
});
