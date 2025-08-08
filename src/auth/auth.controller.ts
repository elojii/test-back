import {
  Controller,
  Get,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { GoogleOAuthGuard } from 'guard/google-oauth.guard';
import { GoogleUser } from 'types';
import { AuthService } from './auth.service';
import { MongoTokenService } from '@mongo/token/token.service';
import { ACCESS_TOKEN_MAX_AGE, REFRESH_TOKEN_MAX_AGE } from './auth.constants';
import { MongoAuthService } from '@mongo/auth/auth.service';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mongoAuthService: MongoAuthService,
    private readonly tokenService: MongoTokenService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  @UseGuards(GoogleOAuthGuard)
  async googleAuth(@Req() req: Request) {}

  @Get('google-redirect')
  @UseGuards(GoogleOAuthGuard)
  public async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    try {
      const authedUser = await this.authService.googleUserLogin(
        req?.user as GoogleUser,
      );

      if (!authedUser) {
        return res.status(401).send('No user from Google');
      }

      res.cookie('access_token', authedUser.accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: ACCESS_TOKEN_MAX_AGE,
      });

      res.cookie('refresh_token', authedUser.refreshToken, {
        httpOnly: true,
        secure: true, // set to true in production
        sameSite: 'lax',
        maxAge: REFRESH_TOKEN_MAX_AGE,
      });

      return res.redirect('http://localhost:5173/dashboard');
    } catch (error) {
      console.error(error);
    }
  }

  @Get('login')
  async login(@Req() req: Request, @Res() res: Response) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const accessToken = req.cookies['access_token'] as string;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const refreshToken = req.cookies['refresh_token'] as string;

    if (!accessToken && !refreshToken) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
      // Access token exists → verify and return user
      if (accessToken) {
        const user = this.tokenService.verifyAccessToken(accessToken);
        if (user) {
          return res.json({
            user,
            accessTokenExpiresIn: ACCESS_TOKEN_MAX_AGE,
          });
        }
      }

      if (refreshToken) {
        const refreshedAccessInfo =
          await this.tokenService.refreshAccessToken(refreshToken);

        if (!refreshedAccessInfo.user || !refreshedAccessInfo.newAccessToken) {
          throw new UnauthorizedException();
        }

        const { user } = refreshedAccessInfo;

        const newAccessToken = refreshedAccessInfo.newAccessToken;
        const newRefreshToken = this.tokenService.createRefreshToken({
          userId: user.userId,
        });

        await this.mongoAuthService.upsertAuthInstance({
          refreshToken: newRefreshToken,
          userId: user.userId,
        });

        res.cookie('access_token', newAccessToken, {
          httpOnly: true,
          sameSite: 'lax',
          maxAge: ACCESS_TOKEN_MAX_AGE,
        });

        res.cookie('refresh_token', newRefreshToken, {
          httpOnly: true,
          sameSite: 'lax',
          maxAge: REFRESH_TOKEN_MAX_AGE,
        });

        return res.json({
          user,
          accessTokenExpiresIn: ACCESS_TOKEN_MAX_AGE,
        });
      }
    } catch (error) {
      console.log(error);
      res.status(401).json({ message: 'Unauthorized' });
    }
  }
}
