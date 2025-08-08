import { Injectable } from '@nestjs/common';
import { USER_COLLECTION_NAME } from './user.constants';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserCollaborator } from './user.interface';
import { Model, Types } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class MongoUserService {
  constructor(
    @InjectModel(USER_COLLECTION_NAME)
    private readonly UserModel: Model<User>,
  ) {}

  public async findOneByEmail({
    email,
  }: {
    email: string;
  }): Promise<User | null> {
    return await this.UserModel.findOne({ email }).lean();
  }

  public async findOneById({
    _id,
  }: {
    _id: Types.ObjectId;
  }): Promise<User | null> {
    return await this.UserModel.findOne({ _id }).lean();
  }

  public async create({ email }: { email: string }) {
    return await this.UserModel.create({
      email,
    });
  }

  public async upsertByEmail(email: string) {
    return await this.UserModel.findOneAndUpdate(
      { email },
      { $setOnInsert: { email } },
      { upsert: true, new: true },
    ).lean();
  }

  public async getCollaboratorsFromEmails(
    emails?: string[],
  ): Promise<UserCollaborator[]> {
    if (!emails || emails.length === 0) return [];

    const users = await Promise.all(
      emails.map(async (email) => {
        try {
          const user = (await this.findOneByEmail({ email })) as User;

          if (!user) {
            console.warn(`User with email "${email}" not found`);
            return null;
          }

          return {
            userId: user._id.toString(),
            email: user.email,
            id: uuidv4(),
          } as UserCollaborator;
        } catch (err) {
          console.warn(`Error fetching user with email "${email}":`, err);
          return null;
        }
      }),
    );

    // Filter out nulls
    return users.filter((u): u is UserCollaborator => u !== null);
  }
}
