export interface PostInput {
  userId: string;
  title: string;
  content: string;
}

export interface Post {
  id: string;
  userId: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
  likesCount?: number;
}

export interface IPostRepository {
  createPost(input: PostInput): Promise<Post>;
  getPostById(id: string): Promise<Post | null>;
  listPosts(): Promise<Post[]>;
  updatePost(id: string, input: Partial<PostInput>): Promise<Post | null>;
  deletePost(id: string): Promise<void>;
  likePost(postId: string, userId: string): Promise<void>;
  unlikePost(postId: string, userId: string): Promise<void>;
}