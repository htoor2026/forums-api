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
const comment_1 = require("../../../infrastructure/mongodb/models/comment");
const authMiddleware_1 = require("../../../middleware/authMiddleware");
const logger_1 = __importDefault(require("../../../config/logger"));
const router = express_1.default.Router({ mergeParams: true });
// GET all comments for a post
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const comments = yield comment_1.Comment.find({ postId: req.params.postId }).sort({ createdAt: 1 });
        res.status(200).json(comments);
    }
    catch (error) {
        logger_1.default.error(`GET comments error: ${error.message}`);
        res.status(500).json({ message: error.message });
    }
}));
router.post("/", authMiddleware_1.authenticate, (req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const comment = yield comment_1.Comment.create({
            postId: req.params.postId,
            authorId: req.user.id,
            body: req.body.body
        });
        logger_1.default.info(`Comment created on post ${req.params.postId}`);
        res.status(201).json(comment);
    }
    catch (error) {
        logger_1.default.error(`POST comment error: ${error.message}`);
        res.status(500).json({ message: error.message });
    }
}));
// PUT edit comment (protected)
router.put("/:commentId", authMiddleware_1.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const comment = yield comment_1.Comment.findById(req.params.commentId);
        if (!comment) {
            res.status(404).json({ message: "Comment not found" });
            return;
        }
        if (comment.authorId !== req.user.id && req.user.role !== 'admin') {
            res.status(403).json({ message: "Not authorized" });
            return;
        }
        comment.body = (_a = req.body.body) !== null && _a !== void 0 ? _a : comment.body;
        yield comment.save();
        logger_1.default.info(`Comment ${req.params.commentId} updated`);
        res.status(200).json(comment);
    }
    catch (error) {
        logger_1.default.error(`PUT comment error: ${error.message}`);
        res.status(500).json({ message: error.message });
    }
}));
// DELETE comment 
router.delete("/:commentId", authMiddleware_1.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const comment = yield comment_1.Comment.findById(req.params.commentId);
        if (!comment) {
            res.status(404).json({ message: "Comment not found" });
            return;
        }
        if (comment.authorId !== req.user.id && req.user.role !== 'admin') {
            res.status(403).json({ message: "Not authorized" });
            return;
        }
        yield comment.deleteOne();
        logger_1.default.info(`Comment ${req.params.commentId} deleted`);
        res.status(200).json({ message: "Comment deleted" });
    }
    catch (error) {
        logger_1.default.error(`DELETE comment error: ${error.message}`);
        res.status(500).json({ message: error.message });
    }
}));
exports.default = router;
//# sourceMappingURL=comment.js.map