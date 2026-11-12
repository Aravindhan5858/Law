import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export interface AdminRequest extends Request {
  admin?: jwt.JwtPayload;
}

export function requireAdmin(req: AdminRequest, res: Response, next: NextFunction) {
  const secret = process.env.ADMIN_JWT_SECRET;
  const header = req.header('authorization');
  const token = header?.startsWith('Bearer ') ? header.slice(7) : '';
  if (!secret || !token) return res.status(401).json({ error: 'Admin authentication required' });

  try {
    const payload = jwt.verify(token, secret);
    if (typeof payload !== 'object' || (payload.role !== 'admin' && payload.isAdmin !== true)) {
      return res.status(403).json({ error: 'Admin access required' });
    }
    req.admin = payload;
    return next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired admin token' });
  }
}
