import express, { Request, Response, NextFunction } from "express";
import { Post } from "../../../infrastructure/mongodb/models/post";
import { PostLike } from "../../../infrastructure/mongodb/models/postLike";
import { authenticate, AuthRequest } from "../../../middleware/authMiddleware";
import commentRouter from "./comment";
import { canModifyPost, toggleLike } from "../../../services/forumService";



const router = express.Router();

// GET all posts
router.get("/", async (_req: Request, res: Response, _next: NextFunction) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

// GET single post
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) { res.status(404).json({ message: "Post not found" }); return; }
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

// POST create post 
router.post("/", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const post = await Post.create({
      title: req.body.title,
      body: req.body.body,
      authorId: req.user!.id
    });
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

// PUT edit post 
router.put("/:id", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) { res.status(404).json({ message: "Post not found" }); return; }

    if (post.authorId !== req.user!.id && req.user!.role !== 'admin') {
      res.status(403).json({ message: "Not authorized" }); return;
    }

    post.title = req.body.title ?? post.title;
    post.body = req.body.body ?? post.body;
    await post.save();
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

// POST like/unlike post 
router.post("/:id/like", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const existing = await PostLike.findOne({ postId: req.params.id, userId: req.user!.id });
    if (existing) {
      await existing.deleteOne();
      res.status(200).json({ message: "Post unliked" }); return;
    }
    await PostLike.create({ postId: req.params.id, userId: req.user!.id });
    res.status(201).json({ message: "Post liked" });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

// Mount comment routes
router.use("/:postId/comments", commentRouter);

export default router;
