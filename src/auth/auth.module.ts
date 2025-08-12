import { MongoTokenModule } from '@mongo/token/token.module';
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { MongoAuthModule } from '@mongo/auth/auth.module';
import { GoogleStrategy } from './strategies/google.strategy';
import { AuthService } from './auth.service';
import { MongoUserModule } from '@mongo/user/user.module';

@Module({
  imports: [MongoTokenModule, MongoAuthModule, MongoUserModule],
  providers: [GoogleStrategy, AuthService],
  controllers: [AuthController],
  exports: [MongoTokenModule],
})
export class AuthModule {}
