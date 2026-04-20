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
exports.authRouter = void 0;
const express_1 = require("express");
const authRouter = (authService) => {
    const router = (0, express_1.Router)();
    router.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        try {
            const { username, email, password } = req.body;
            const result = yield authService.register(username, email, password);
            res.status(201).json({
                user: {
                    id: result.user.id,
                    username: result.user.username,
                    email: result.user.email,
                    role: result.user.role,
                },
                token: result.token,
            });
        }
        catch (err) {
            res.status(400).json({ error: (_a = err.message) !== null && _a !== void 0 ? _a : 'Registration failed' });
        }
    }));
    router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _b;
        try {
            const { email, password } = req.body;
            const result = yield authService.login(email, password);
            res.json({
                user: {
                    id: result.user.id,
                    username: result.user.username,
                    email: result.user.email,
                    role: result.user.role,
                },
                token: result.token,
            });
        }
        catch (err) {
            res.status(401).json({ error: (_b = err.message) !== null && _b !== void 0 ? _b : 'Invalid credentials' });
        }
    }));
    return router;
};
exports.authRouter = authRouter;
//# sourceMappingURL=authController.js.map