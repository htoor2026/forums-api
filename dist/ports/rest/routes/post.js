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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const post_1 = require("../../../infrastructure/mongodb/models/post");
const postLike_1 = require("../../../infrastructure/mongodb/models/postLike");
const authMiddleware_1 = require("../../../middleware/authMiddleware");
const comment_1 = __importDefault(require("./comment"));
const router = express_1.default.Router();
// GET all posts
router.get("/", (_req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const posts = yield post_1.Post.find().sort({ createdAt: -1 });
        res.status(200).json(posts);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
// GET single post
router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const post = yield post_1.Post.findById(req.params.id);
        if (!post) {
            res.status(404).json({ message: "Post not found" });
            return;
        }
        res.status(200).json(post);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
// POST create post 
router.post("/", authMiddleware_1.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const post = yield post_1.Post.create({
            title: req.body.title,
            body: req.body.body,
            authorId: req.user.id
        });
        res.status(201).json(post);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
// PUT edit post 
router.put("/:id", authMiddleware_1.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const post = yield post_1.Post.findById(req.params.id);
        if (!post) {
            res.status(404).json({ message: "Post not found" });
            return;
        }
        if (post.authorId !== req.user.id && req.user.role !== 'admin') {
            res.status(403).json({ message: "Not authorized" });
            return;
        }
        post.title = (_a = req.body.title) !== null && _a !== void 0 ? _a : post.title;
        post.body = (_b = req.body.body) !== null && _b !== void 0 ? _b : post.body;
        yield post.save();
        res.status(200).json(post);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
// POST like/unlike post 
router.post("/:id/like", authMiddleware_1.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existing = yield postLike_1.PostLike.findOne({ postId: req.params.id, userId: req.user.id });
        if (existing) {
            yield existing.deleteOne();
            res.status(200).json({ message: "Post unliked" });
            return;
        }
        yield postLike_1.PostLike.create({ postId: req.params.id, userId: req.user.id });
        res.status(201).json({ message: "Post liked" });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}));
// Mount comment routes
router.use("/:postId/comments", comment_1.default);
exports.default = router;
//# sourceMappingURL=post.js.map