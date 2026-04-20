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
const express_1 = __importDefault(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = require("../../../infrastructure/mongodb/models/user");
const router = express_1.default.Router();
// POST /user/create
router.post("/create", (req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userName, userPassword, role } = req.body;
        const existing = yield user_1.User.findOne({ username: userName });
        if (existing) {
            res.status(409).json({ message: "Username already exists" });
            return;
        }
        const passwordHash = yield bcrypt_1.default.hash(userPassword, 10);
        const user = yield user_1.User.create({
            username: userName,
            email: req.body.email || `${userName}@placeholder.com`,
            passwordHash,
            role: role || "user"
        });
        res.status(201).json({
            id: user._id,
            userName: user.username,
            role: user.role
        });
    }
    catch (error) {
        console.log(`Error in user create: ${error.message}`);
        res.status(500).json({ message: error.message });
    }
}));
// POST /user/login
router.post("/login", (req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userName, userPassword } = req.body;
        const user = yield user_1.User.findOne({ username: userName });
        if (!user) {
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }
        const match = yield bcrypt_1.default.compare(userPassword, user.passwordHash);
        if (!match) {
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }
        const secret = process.env.JWT_SECRET;
        if (!secret)
            throw new Error("JWT_SECRET not configured");
        const token = jsonwebtoken_1.default.sign({ sub: user._id.toString(), role: user.role }, secret, { expiresIn: "1h" });
        res.status(200).json({
            message: "User logged in successfully!",
            token,
            user: { id: user._id, userName: user.username, role: user.role }
        });
    }
    catch (error) {
        console.log(`Error in user login: ${error.message}`);
        res.status(500).json({ message: error.message });
    }
}));
module.exports = router;
//# sourceMappingURL=user.js.map