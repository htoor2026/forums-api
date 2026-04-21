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
const user_1 = require("../../../infrastructure/mongodb/models/user");
const post_1 = require("../../../infrastructure/mongodb/models/post");
const comment_1 = require("../../../infrastructure/mongodb/models/comment");
const postLike_1 = require("../../../infrastructure/mongodb/models/postLike");
const authMiddleware_1 = require("../../../middleware/authMiddleware");
const logger_1 = __importDefault(require("../../../config/logger"));
const router = express_1.default.Router();
router.get("/stats", authMiddleware_1.authenticate, authMiddleware_1.requireAdmin, (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [totalUsers, totalPosts, totalComments, totalLikes] = yield Promise.all([
            user_1.User.countDocuments(),
            post_1.Post.countDocuments(),
            comment_1.Comment.countDocuments(),
            postLike_1.PostLike.countDocuments()
        ]);
        logger_1.default.info("Admin stats fetched");
        res.status(200).json({ totalUsers, totalPosts, totalComments, totalLikes });
    }
    catch (error) {
        logger_1.default.error(`GET /admin/stats error: ${error.message}`);
        res.status(500).json({ message: error.message });
    }
}));
router.get("/users", authMiddleware_1.authenticate, authMiddleware_1.requireAdmin, (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_1.User.find({}, { passwordHash: 0 }).sort({ createdAt: -1 });
        res.status(200).json(users);
    }
    catch (error) {
        logger_1.default.error(`GET /admin/users error: ${error.message}`);
        res.status(500).json({ message: error.message });
    }
}));
exports.default = router;
//# sourceMappingURL=admin.js.map