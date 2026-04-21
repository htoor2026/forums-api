import mongoose from 'mongoose';
import { Post as PostModel } from './models/post';
import { PostLike } from './models/postLike';
import { IPostRepository, Post, PostInput } from '../../ports/postRepository';

const toDomainPost = (doc: any): Post => ({
  id: doc._id.toString(),
  userId: doc.userId.toString(),
  title: doc.title,
  content: doc.content,
  createdAt: doc.createdAt,
  updatedAt: doc.updatedAt,
});

export class PostRepositoryMongo implements IPostRepository {
  async createPost(input: PostInput): Promise<Post> {
    const doc = await new PostModel({
      _id: new mongoose.Types.ObjectId(),
      userId: input.userId,
      title: input.title,
      content: input.content,
    }).save();

    return toDomainPost(doc.toObject());
  }

  async getPostById(id: string): Promise<Post | null> {
    const doc = await PostModel.findById(id).exec();
    return doc ? toDomainPost(doc.toObject()) : null;
  }

  async listPosts(): Promise<Post[]> {
    const docs = await PostModel.find().sort({ createdAt: -1 }).exec();
    return docs.map(d => toDomainPost(d.toObject()));
  }

  async updatePost(id: string, input: Partial<PostInput>): Promise<Post | null> {
    const doc = await PostModel
      .findByIdAndUpdate(
        id,
        { ...input, updatedAt: new Date() },
        { new: true },
      )
      .exec();

    return doc ? toDomainPost(doc.toObject()) : null;
  }

  async deletePost(id: string): Promise<void> {
    await PostModel.findByIdAndDelete(id).exec();
    await PostLike.deleteMany({ postId: id }).exec();
  }

  async likePost(postId: string, userId: string): Promise<void> {
    try {
      await new PostLike({
        _id: new mongoose.Types.ObjectId(),
        postId,
        userId,
      }).save();
    } catch (err: any) {
      if (err.code === 11000) {
      
        return;
      }
      throw err;
    }
  }

  async unlikePost(postId: string, userId: string): Promise<void> {
    await PostLike.deleteOne({ postId, userId }).exec();
  }
}