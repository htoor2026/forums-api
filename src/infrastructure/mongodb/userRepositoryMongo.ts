import mongoose from 'mongoose';
import { User as UserModel } from './models/user';
import { CreateUserInput, IUserRepository, User } from '../../ports/userRepository';

const toDomainUser = (doc: any): User => ({
  id: doc._id.toString(),
  username: doc.username,
  email: doc.email,
  passwordHash: doc.passwordHash,
  role: doc.role,
  createdAt: doc.createdAt,
});

export class UserRepositoryMongo implements IUserRepository {
  async createUser(input: CreateUserInput): Promise<User> {
    const doc = await new UserModel({
      _id: new mongoose.Types.ObjectId(),
      username: input.username,
      email: input.email,
      passwordHash: input.passwordHash,
      role: input.role ?? 'user',
    }).save();

    return toDomainUser(doc.toObject());
  }

  async findByEmail(email: string): Promise<User | null> {
    const doc = await UserModel.findOne({ email }).exec();
    return doc ? toDomainUser(doc.toObject()) : null;
  }

  async findById(id: string): Promise<User | null> {
    const doc = await UserModel.findById(id).exec();
    return doc ? toDomainUser(doc.toObject()) : null;
  }
}