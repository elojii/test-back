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

    const { newAccessToken, newRefreshToken } =
      this.mongoTokenService.issueTokens({
        email,
        userId: existingUser._id,
      });

    await this.mongoAuthService.upsertAuthInstance({
      refreshToken: newRefreshToken,
      userId: existingUser._id,
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      user: existingUser,
    };
  }
}
