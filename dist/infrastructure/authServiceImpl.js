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
exports.AuthServiceImpl = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SALT_ROUNDS = 10;
class AuthServiceImpl {
    constructor(userRepo) {
        this.userRepo = userRepo;
    }
    register(username, email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const existing = yield this.userRepo.findByEmail(email);
            if (existing) {
                throw new Error('Email already in use');
            }
            const passwordHash = yield bcrypt_1.default.hash(password, SALT_ROUNDS);
            const user = yield this.userRepo.createUser({ username, email, passwordHash });
            const token = this.signToken(user.id, user.role);
            return { user, token };
        });
    }
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepo.findByEmail(email);
            if (!user) {
                throw new Error('Invalid credentials');
            }
            const ok = yield bcrypt_1.default.compare(password, user.passwordHash);
            if (!ok) {
                throw new Error('Invalid credentials');
            }
            const token = this.signToken(user.id, user.role);
            return { user, token };
        });
    }
    signToken(userId, role) {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error('JWT_SECRET not configured');
        }
        return jsonwebtoken_1.default.sign({ sub: userId, role }, secret, { expiresIn: '1h' });
    }
}
exports.AuthServiceImpl = AuthServiceImpl;
//# sourceMappingURL=authServiceImpl.js.map