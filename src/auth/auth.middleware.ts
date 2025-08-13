import { MongoTokenService } from '@mongo/token/token.service';
import { Injectable, NestMiddleware } from '@nestjs/common';
import type { Request, Response, NextFunction } from 'express';

@Injectable()
export class CookieAuthMiddleware implements NestMiddleware {
  constructor(private readonly tokenService: MongoTokenService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const accessToken = req.cookies?.['access_token'] as string;

    if (!accessToken) {
      return res.status(401).json({ message: 'No access token provided' });
    }

    try {
      const user = this.tokenService.verifyAccessToken(accessToken);

      if (!user) {
        return res.status(401).json({ message: 'Invalid or expired token' });
      }

      req['user'] = user;

      next();
    } catch {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
  }
}
