export interface CreateUserInput {
  username: string;
  email: string;
  passwordHash: string;
  role?: 'user' | 'admin' | 'superuser';
}

export interface User {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  role: 'user' | 'admin' | 'superuser';
  createdAt: Date;
}

export interface IUserRepository {
  createUser(input: CreateUserInput): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
}