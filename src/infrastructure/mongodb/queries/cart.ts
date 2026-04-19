import mongoose from 'mongoose';

const createPost = async (PostModel: any, { userId, title, content }: any) => {
  const result = await new PostModel({
    _id: new mongoose.Types.ObjectId(),
    userId,
    title,
    content,
    createdAt: new Date(),
  }).save();

  return result.toObject();
};

export default {
  createPost,
};