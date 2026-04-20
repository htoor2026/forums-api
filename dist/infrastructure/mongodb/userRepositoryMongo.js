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
exports.UserRepositoryMongo = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const user_1 = require("./models/user");
const toDomainUser = (doc) => ({
    id: doc._id.toString(),
    username: doc.username,
    email: doc.email,
    passwordHash: doc.passwordHash,
    role: doc.role,
    createdAt: doc.createdAt,
});
class UserRepositoryMongo {
    createUser(input) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const doc = yield new user_1.User({
                _id: new mongoose_1.default.Types.ObjectId(),
                username: input.username,
                email: input.email,
                passwordHash: input.passwordHash,
                role: (_a = input.role) !== null && _a !== void 0 ? _a : 'user',
            }).save();
            return toDomainUser(doc.toObject());
        });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const doc = yield user_1.User.findOne({ email }).exec();
            return doc ? toDomainUser(doc.toObject()) : null;
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const doc = yield user_1.User.findById(id).exec();
            return doc ? toDomainUser(doc.toObject()) : null;
        });
    }
}
exports.UserRepositoryMongo = UserRepositoryMongo;
//# sourceMappingURL=userRepositoryMongo.js.map