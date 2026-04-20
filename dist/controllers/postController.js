"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postRouter = void 0;
const express_1 = require("express");
const postRouter = (postRepo) => {
    const router = (0, express_1.Router)();
    router.get('/', (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const posts = yield postRepo.listPosts();
        res.json(posts);
    }));
    router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const post = yield postRepo.getPostById(req.params.id);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        res.json(post);
    }));
    router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            if (!req.userId) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const { title, content } = req.body;
            const post = yield postRepo.createPost({
                userId: req.userId,
                title,
                content,
            });
            res.status(201).json(post);
        }
        catch (err) {
            res.status(400).json({ error: (_a = err.message) !== null && _a !== void 0 ? _a : 'Failed to create post' });
        }
    }));
    router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const { title, content } = req.body;
        const post = yield postRepo.updatePost(req.params.id, { title, content });
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        res.json(post);
    }));
    router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        yield postRepo.deletePost(req.params.id);
        res.status(204).send();
    }));
    router.post('/:id/like', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        yield postRepo.likePost(req.params.id, req.userId);
        res.status(204).send();
    }));
    router.post('/:id/unlike', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        if (!req.userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        yield postRepo.unlikePost(req.params.id, req.userId);
        res.status(204).send();
    }));
    return router;
};
exports.postRouter = postRouter;
//# sourceMappingURL=postController.js.map