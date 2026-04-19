import mongoose from 'mongoose';
import { Post } from './post';

const createPost = async (userId: string, title: string, content: string) => {
  const result = await new Post({
    _id: new mongoose.Types.ObjectId(),
    userId,
    title,
    content,
  }).save();

  return result.toObject();
};

export default {
  createPost,
};