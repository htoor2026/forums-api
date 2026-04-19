import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { IAuthService, AuthResult } from '../ports/authService';
import { IUserRepository } from '../ports/userRepository';

const SALT_ROUNDS = 10;

export class AuthServiceImpl implements IAuthService {
  constructor(private readonly userRepo: IUserRepository) {}

  async register(username: string, email: string, password: string): Promise<AuthResult> {
    const existing = await this.userRepo.findByEmail(email);
    if (existing) {
      throw new Error('Email already in use');
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await this.userRepo.createUser({ username, email, passwordHash });

    const token = this.signToken(user.id, user.role);
    return { user, token };
  }

  async login(email: string, password: string): Promise<AuthResult> {
    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      throw new Error('Invalid credentials');
    }

    const token = this.signToken(user.id, user.role);
    return { user, token };
  }

  private signToken(userId: string, role: string): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET not configured');
    }

    return jwt.sign({ sub: userId, role }, secret, { expiresIn: '1h' });
  }
}