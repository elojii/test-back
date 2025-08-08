import { MongoAuthService } from '@mongo/auth/auth.service';
import { MongoTokenService } from '@mongo/token/token.service';
import { MongoUserService } from '@mongo/user/user.service';
import { Injectable } from '@nestjs/common';
import { GoogleUser } from 'types';

@Injectable()
export class AuthService {
  constructor(
    private readonly mongoAuthService: MongoAuthService,
    private readonly mongoUserService: MongoUserService,
    private readonly mongoTokenService: MongoTokenService,
  ) {}

  public async googleUserLogin(user: GoogleUser) {
    const { profile } = user;

    const email = profile._json.email;

    const existingUser = await this.mongoUserService.upsertByEmail(email);

    const jwtAccessTokenPayload = {
      email,
      userId: existingUser._id,
    };
    const jwtAccessToken = this.mongoTokenService.createAccessToken(
      jwtAccessTokenPayload,
    );

    const jwtRefreshTokenPayload = {
      userId: existingUser._id,
    };
    const jwtRefreshToken = this.mongoTokenService.createRefreshToken(
      jwtRefreshTokenPayload,
    );

    await this.mongoAuthService.upsertAuthInstance({
      refreshToken: jwtRefreshToken,
      userId: existingUser._id,
    });

    return {
      accessToken: jwtAccessToken,
      refreshToken: jwtRefreshToken,
      user: existingUser,
    };
  }
}
