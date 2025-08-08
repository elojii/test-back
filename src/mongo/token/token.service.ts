import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { JwtAccessTokenPayload, JwtRefreshTokenPayload } from './jwt.interface';
import { ConfigService } from '@nestjs/config';
import { Types } from 'mongoose';
import { MongoUserService } from '@mongo/user/user.service';

@Injectable()
export class MongoTokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mongoUserService: MongoUserService,
  ) {}

  public createAccessToken(
    payload: JwtAccessTokenPayload,
    options?: JwtSignOptions,
  ): string {
    return this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      expiresIn: '15m',
      ...options,
    });
  }

  public verifyAccessToken(token: string): JwtAccessTokenPayload | null | void {
    try {
      const decoded = this.jwtService.verify<JwtAccessTokenPayload>(token, {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
      });

      return decoded;
    } catch {
      console.log('verifyAccessToken error');
    }
  }

  public createRefreshToken(
    payload: Omit<
      JwtRefreshTokenPayload,
      'refreshTokenId' | 'exp' | 'issuedAt'
    >,
    options?: JwtSignOptions,
  ): string {
    const refreshTokenId = new Types.ObjectId();
    const issuedAt = Math.floor(Date.now() / 1000);

    return this.jwtService.sign(
      { ...payload, refreshTokenId, issuedAt },
      {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
        ...options,
      },
    );
  }

  public verifyRefreshToken(token: string): JwtRefreshTokenPayload | null {
    try {
      const decoded = this.jwtService.verify<JwtRefreshTokenPayload>(token, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });
      return decoded;
    } catch {
      return null;
    }
  }

  public async refreshAccessToken(refreshToken: string) {
    const { userId } =
      await this.jwtService.verifyAsync<JwtRefreshTokenPayload>(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });
    const user = await this.mongoUserService.findOneById({
      _id: userId,
    });

    if (!user) throw new UnauthorizedException();

    const authedUser = { userId: user._id, email: user.email };
    const newAccessToken = this.createAccessToken(authedUser);

    return { newAccessToken, user: authedUser };
  }
}
