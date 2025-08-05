import { FirebaseTokenModule } from '@firebase/token/token.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [FirebaseTokenModule],
})
export class AuthModule {}
