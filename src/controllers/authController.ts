import { Request, Response, Router } from 'express';
import { IAuthService } from '../ports/authService';

export const authRouter = (authService: IAuthService): Router => {
  const router = Router();

  router.post('/register', async (req: Request, res: Response) => {
    try {
      const { username, email, password } = req.body;
      const result = await authService.register(username, email, password);
      res.status(201).json({
        user: {
          id: result.user.id,
          username: result.user.username,
          email: result.user.email,
          role: result.user.role,
        },
        token: result.token,
      });
    } catch (err: any) {
      res.status(400).json({ error: err.message ?? 'Registration failed' });
    }
  });

  router.post('/login', async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      res.json({
        user: {
          id: result.user.id,
          username: result.user.username,
          email: result.user.email,
          role: result.user.role,
        },
        token: result.token,
      });
    } catch (err: any) {
      res.status(401).json({ error: err.message ?? 'Invalid credentials' });
    }
  });

  return router;
};