// folder.schema.ts
import { Schema } from 'mongoose';

export const CollaboratorSchema = new Schema({
  email: { type: String, required: true },
  userId: { type: String, required: true },
  id: { type: String, required: true },
});

export const FolderSchema = new Schema({
  name: String,
  parentId: String,
  userId: String,
  collaborators: [CollaboratorSchema],
  createdAt: { type: Date, default: Date.now },
});
