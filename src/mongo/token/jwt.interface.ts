import { Types } from 'mongoose';

export interface JwtAccessTokenPayload {
  userId: Types.ObjectId;
  email: string;
}

export interface JwtRefreshTokenPayload {
  userId: Types.ObjectId;
  refreshTokenId: Types.ObjectId;
  exp: Date;
  issuedAt: Date;
}
