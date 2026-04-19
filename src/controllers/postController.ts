import { Request, Response, Router } from 'express';
import { IPostRepository } from '../ports/postRepository';

// Assume you have middleware that sets req.userId from JWT
interface AuthedRequest extends Request {
  userId?: string;
  userRole?: string;
}

export const postRouter = (postRepo: IPostRepository): Router => {
  const router = Router();

  router.get('/', async (_req, res) => {
    const posts = await postRepo.listPosts();
    res.json(posts);
  });

  router.get('/:id', async (req, res) => {
    const post = await postRepo.getPostById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json(post);
  });

  router.post('/', async (req: AuthedRequest, res: Response) => {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { title, content } = req.body;
      const post = await postRepo.createPost({
        userId: req.userId,
        title,
        content,
      });

      res.status(201).json(post);
    } catch (err: any) {
      res.status(400).json({ error: err.message ?? 'Failed to create post' });
    }
  });

  router.put('/:id', async (req: AuthedRequest, res: Response) => {
    if (!req.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { title, content } = req.body;
    const post = await postRepo.updatePost(req.params.id, { title, content });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json(post);
  });

  router.delete('/:id', async (req: AuthedRequest, res: Response) => {
    if (!req.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await postRepo.deletePost(req.params.id);
    res.status(204).send();
  });

  router.post('/:id/like', async (req: AuthedRequest, res: Response) => {
    if (!req.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await postRepo.likePost(req.params.id, req.userId);
    res.status(204).send();
  });

  router.post('/:id/unlike', async (req: AuthedRequest, res: Response) => {
    if (!req.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    await postRepo.unlikePost(req.params.id, req.userId);
    res.status(204).send();
  });

  return router;
};