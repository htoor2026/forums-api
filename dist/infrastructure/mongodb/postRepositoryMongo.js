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
exports.PostRepositoryMongo = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const post_1 = require("./models/post");
const postLike_1 = require("./models/postLike");
const toDomainPost = (doc) => ({
    id: doc._id.toString(),
    userId: doc.userId.toString(),
    title: doc.title,
    content: doc.content,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
});
class PostRepositoryMongo {
    createPost(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const doc = yield new post_1.Post({
                _id: new mongoose_1.default.Types.ObjectId(),
                userId: input.userId,
                title: input.title,
                content: input.content,
            }).save();
            return toDomainPost(doc.toObject());
        });
    }
    getPostById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const doc = yield post_1.Post.findById(id).exec();
            return doc ? toDomainPost(doc.toObject()) : null;
        });
    }
    listPosts() {
        return __awaiter(this, void 0, void 0, function* () {
            const docs = yield post_1.Post.find().sort({ createdAt: -1 }).exec();
            return docs.map(d => toDomainPost(d.toObject()));
        });
    }
    updatePost(id, input) {
        return __awaiter(this, void 0, void 0, function* () {
            const doc = yield post_1.Post
                .findByIdAndUpdate(id, Object.assign(Object.assign({}, input), { updatedAt: new Date() }), { new: true })
                .exec();
            return doc ? toDomainPost(doc.toObject()) : null;
        });
    }
    deletePost(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield post_1.Post.findByIdAndDelete(id).exec();
            yield postLike_1.PostLike.deleteMany({ postId: id }).exec();
        });
    }
    likePost(postId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield new postLike_1.PostLike({
                    _id: new mongoose_1.default.Types.ObjectId(),
                    postId,
                    userId,
                }).save();
            }
            catch (err) {
                if (err.code === 11000) {
                    return;
                }
                throw err;
            }
        });
    }
    unlikePost(postId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield postLike_1.PostLike.deleteOne({ postId, userId }).exec();
        });
    }
}
exports.PostRepositoryMongo = PostRepositoryMongo;
//# sourceMappingURL=postRepositoryMongo.js.map