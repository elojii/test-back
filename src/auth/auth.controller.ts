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
import { JwtAccessTokenPayload } from '@mongo/token';
import { MongoUserService } from '@mongo/user/user.service';
import { TokenExpiredError } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly mongoAuthService: MongoAuthService,
    private readonly mongoUserService: MongoUserService,
    private readonly tokenService: MongoTokenService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  @UseGuards(GoogleOAuthGuard)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  // @Get('login')
  // async login(@Req() req: Request, @Res() res: Response) {
  //   const accessToken = req.cookies['access_token'] as string | undefined;
  //   const refreshToken = req.cookies['refresh_token'] as string | undefined;

  //   if (!accessToken && !refreshToken) {
  //     return res.status(401).json({ message: 'Unauthorized' });
  //   }

  //   // Helper to issue new tokens, set cookies, and return response
  //   const issueTokensAndRespond = async (user: JwtAccessTokenPayload) => {
  //     const { newAccessToken, newRefreshToken } =
  //       this.tokenService.issueTokens(user);

  //     await this.mongoAuthService.upsertAuthInstance({
  //       refreshToken: newRefreshToken,
  //       userId: user.userId,
  //     });

  //     res.cookie('access_token', newAccessToken, {
  //       httpOnly: true,
  //       sameSite: 'lax',
  //       maxAge: ACCESS_TOKEN_MAX_AGE,
  //     });

  //     res.cookie('refresh_token', newRefreshToken, {
  //       httpOnly: true,
  //       sameSite: 'lax',
  //       maxAge: REFRESH_TOKEN_MAX_AGE,
  //     });

  //     return res.json({
  //       user,
  //       accessTokenExpiresIn: ACCESS_TOKEN_MAX_AGE,
  //     });
  //   };

  //   try {
  //     if (accessToken) {
  //       const user = this.tokenService.verifyAccessToken(accessToken);
  //       if (user) {
  //         // Issue new tokens even if access token is valid
  //         return await issueTokensAndRespond(user);
  //       }
  //     }

  //     if (refreshToken) {
  //       const authData =
  //         await this.tokenService.verifyRefreshToken(refreshToken);
  //       if (!authData) throw new UnauthorizedException();

  //       const userId = authData.userId;

  //       const user = await this.mongoUserService.findOneById({
  //         _id: userId,
  //       });

  //       if (!user) throw new UnauthorizedException();

  //       const userInfo = {
  //         userId: user._id,
  //         email: user.email,
  //       };

  //       return await issueTokensAndRespond(userInfo);
  //     }

  //     return res.status(401).json({ message: 'Unauthorized' });
  //   } catch (error) {
  //     console.error(error);
  //     return res.status(401).json({ message: 'Unauthorized' });
  //   }
  // }

  @Get('login')
  async login(@Req() req: Request, @Res() res: Response) {
    const accessToken = req.cookies['access_token'] as string | undefined;
    const refreshToken = req.cookies['refresh_token'] as string | undefined;

    if (!accessToken && !refreshToken) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Helper to issue new tokens, set cookies, and return response
    const issueTokensAndRespond = async (user: JwtAccessTokenPayload) => {
      const { newAccessToken, newRefreshToken } =
        this.tokenService.issueTokens(user);

      console.log('issue new tokens', newRefreshToken);

      console.log('issue token to this user: ', user);

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
    };

    try {
      if (accessToken) {
        try {
          const user = this.tokenService.verifyAccessToken(accessToken);

          if (user) {
            return await issueTokensAndRespond(user);
          }
        } catch (error) {
          console.log('error', error);
          if (!(error instanceof TokenExpiredError)) {
            return res
              .status(401)
              .json({ message: 'Unauthorized accesstoken' });
          }
        }
      }

      if (refreshToken) {
        const authData =
          await this.tokenService.verifyRefreshToken(refreshToken);

        console.log('verified refreshtoken', authData);

        if (!authData) throw new UnauthorizedException();

        const userId = authData.userId;

        const user = await this.mongoUserService.findOneById({ _id: userId });
        if (!user) throw new UnauthorizedException();

        const userInfo = {
          userId: user._id,
          email: user.email,
        };

        return await issueTokensAndRespond(userInfo);
      }

      return res.status(401).json({ message: 'Unauthorized' });
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: 'Unauthorized' });
    }
  }
}
