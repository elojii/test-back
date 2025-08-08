import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { AUTH_COLLECTION_NAME } from './auth.constants';
import { Model, Types } from 'mongoose';
import { Auth } from './auth.interface';

@Injectable()
export class MongoAuthService {
  constructor(
    @InjectModel(AUTH_COLLECTION_NAME)
    private readonly AuthModel: Model<Auth>,
  ) {}

  public async upsertAuthInstance({
    userId,
    refreshToken,
  }: {
    userId: Types.ObjectId;
    refreshToken: string;
  }) {
    console.log({
      userId,
      refreshToken,
    });
    return this.AuthModel.findOneAndUpdate(
      { userId },
      { refreshToken },
      { upsert: true, new: true },
    );
  }
}
