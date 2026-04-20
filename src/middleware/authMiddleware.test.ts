import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { authenticate, requireAdmin, AuthRequest } from '../../authMiddleware';

process.env.JWT_SECRET = 'test-secret';

describe('authenticate middleware', () => {
  it('should return 401 if no authorization header exists', () => {
    const req = {
      headers: {}
    } as AuthRequest;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as unknown as Response;

    const next = jest.fn() as NextFunction;

    authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'No token provided' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 if authorization header does not start with Bearer', () => {
    const req = {
      headers: { authorization: 'Token abc123' }
    } as AuthRequest;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as unknown as Response;

    const next = jest.fn() as NextFunction;

    authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'No token provided' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 if token is invalid', () => {
    const req = {
      headers: { authorization: 'Bearer invalidtoken' }
    } as AuthRequest;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as unknown as Response;

    const next = jest.fn() as NextFunction;

    authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid or expired token' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should set req.user and call next for valid token', () => {
    const token = jwt.sign(
      { sub: 'user1', role: 'user' },
      'test-secret',
      { expiresIn: '1h' }
    );

    const req = {
      headers: { authorization: `Bearer ${token}` }
    } as AuthRequest;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as unknown as Response;

    const next = jest.fn() as NextFunction;

    authenticate(req, res, next);

    expect(req.user).toEqual({ id: 'user1', role: 'user' });
    expect(next).toHaveBeenCalled();
  });
});

describe('requireAdmin middleware', () => {
  it('should return 403 if user is not admin', () => {
    const req = {
      user: { id: 'user1', role: 'user' }
    } as AuthRequest;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    } as unknown as Response;

    const next = jest.fn() as NextFunction;

    requireAdmin(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ message: 'Admin access required' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next if user is admin', () => {
    const req = {
      user: { id: 'admin1', role: 'admin' }
    } as AuthRequest;

    const res = {} as Response;
    const next = jest.fn() as NextFunction;

    requireAdmin(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});