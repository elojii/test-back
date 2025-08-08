import { Module } from '@nestjs/common';
import { MongoAuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AUTH_COLLECTION_NAME } from './auth.constants';
import { AuthSchema } from '@schemas/auth/auth.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AUTH_COLLECTION_NAME, schema: AuthSchema },
    ]),
  ],
  exports: [MongoAuthService],
  providers: [MongoAuthService],
})
export class MongoAuthModule {}
