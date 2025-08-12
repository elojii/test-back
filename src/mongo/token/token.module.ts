import { Module } from '@nestjs/common';
import { MongoTokenService } from './token.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongoUserModule } from '@mongo/user/user.module';
import { MongoAuthModule } from '@mongo/auth/auth.module';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
      }),
    }),
    MongoUserModule,
    MongoAuthModule,
  ],
  providers: [MongoTokenService],
  exports: [MongoTokenService],
})
export class MongoTokenModule {}
