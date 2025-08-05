export interface FirebaseFolderSchema {
  name: string;
  collaborators: Collaborator[];
  userId: string;
  parentId: string | null;
}

export interface Collaborator {
  userId: string;
  email: string;
}
