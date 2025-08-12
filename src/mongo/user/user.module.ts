import { Module } from '@nestjs/common';
import { MongoUserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from '@schemas/user.schema';
import { USER_COLLECTION_NAME } from './user.constants';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: USER_COLLECTION_NAME, schema: UserSchema },
    ]),
  ],
  providers: [MongoUserService],
  exports: [MongoUserService],
})
export class MongoUserModule {}
