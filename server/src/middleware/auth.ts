import { Request, Response, NextFunction } from 'express';
import db from '../db/database';

export interface AuthRequest extends Request {
  user?: {
    id: number;
    nickname: string;
    room_id: number;
    token: string;
    total_points: number;
  };
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction): void {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Nicht autorisiert' });
    return;
  }
  const token = auth.slice(7);
  const user = db
    .prepare('SELECT id, nickname, room_id, token, total_points FROM users WHERE token = ?')
    .get(token) as AuthRequest['user'] | undefined;

  if (!user) {
    res.status(401).json({ error: 'Ungültiger Token' });
    return;
  }
  req.user = user;
  next();
}
