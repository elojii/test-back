import { MongoTokenService } from '@mongo/token/token.service';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly tokenService: MongoTokenService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    //   const authHeader = req.headers.authorization;
    //   if (!authHeader || !authHeader.startsWith('Bearer ')) {
    //     return res.status(401).json({ message: 'No token provided' });
    //   }
    //   const idToken = authHeader.split(' ')[1];
    //   try {
    //     // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    //     const decodedToken = await this.tokenService.verifyToken(idToken);
    //     // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    //     req['user'] = decodedToken;
    //     next();
    //   } catch (error) {
    //     return res.status(401).json(error);
    //   }
  }
}
