import { User } from './userRepository';

export interface AuthResult {
  user: User;
  token: string;
}

export interface IAuthService {
  register(username: string, email: string, password: string): Promise<AuthResult>;
  login(email: string, password: string): Promise<AuthResult>;
}