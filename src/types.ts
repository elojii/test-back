// export interface FirebaseFolderSchema {
//   name: string;
//   collaborators: Collaborator[];
//   userId: string;
//   parentId: string | null;
// }

// export interface Collaborator {
//   id: string;
//   userId: string;
//   email: string;
// }

export interface GoogleUser {
  accessToken: string;
  refreshToken: string;
  profile: {
    id: string;
    displayName: string;
    name: {
      familyName?: string;
      givenName: string;
    };
    emails: {
      value: string;
      verified?: boolean;
    }[];
    photos: {
      value: string;
    }[];
    provider: string;
    _raw: string;
    _json: {
      sub: string;
      name: string;
      given_name: string;
      picture: string;
      email: string;
      email_verified: boolean;
    };
  };
}
