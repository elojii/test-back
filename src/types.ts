import { JwtAccessTokenPayload } from '@mongo/token';
import type { Request } from 'express';

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

export interface RequestWithUser extends Request {
  user: JwtAccessTokenPayload;
}
