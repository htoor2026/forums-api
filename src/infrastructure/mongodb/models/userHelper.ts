import mongoose from 'mongoose';
import { User } from './user';

const createUser = async (username: string, email: string, passwordHash: string, role = 'user') => {
  const result = await new User({
    _id: new mongoose.Types.ObjectId(),
    username,
    email,
    passwordHash,
    role,
  }).save();

  return result.toObject();
};

export default {
  createUser,
};