import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import db from '../db/database';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();

function generateCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

// POST /api/rooms — create room + register creator
router.post('/', (req: Request, res: Response) => {
  const { roomName, nickname, tournament = '2026', bonusTypes = ['SEMI_FINALIST', 'FINALIST', 'CHAMPION'], description = '' } = req.body;
  if (!roomName?.trim() || !nickname?.trim()) {
    return res.status(400).json({ error: 'Raumname und Spitzname dürfen nicht leer sein' });
  }
  if (!['2022', '2026'].includes(tournament)) {
    return res.status(400).json({ error: 'Ungültiges Turnier' });
  }

  let code = generateCode();
  while (db.prepare('SELECT id FROM rooms WHERE code = ?').get(code)) {
    code = generateCode();
  }

  const token = uuidv4();

  let roomId: number;
  db.exec('BEGIN');
  try {
    const { lastInsertRowid } = db
      .prepare('INSERT INTO rooms (code, name, tournament, description) VALUES (?, ?, ?, ?)')
      .run(code, roomName.trim(), tournament, description.trim().slice(0, 200) || null);
    roomId = Number(lastInsertRowid);
    db.prepare('INSERT INTO users (nickname, room_id, token) VALUES (?, ?, ?)').run(
      nickname.trim(), roomId, token
    );
    const insertBonus = db.prepare(
      'INSERT INTO bonus_questions (room_id, type, label, points_per_pick, max_picks, bracket_groups) VALUES (?, ?, ?, ?, ?, ?)'
    );
    const bonusConfig = [
      { type: 'SEMI_FINALIST', label: 'Halbfinalisten', points: 2,  max: 4 },
      { type: 'FINALIST',      label: 'Finalisten',     points: 4,  max: 2 },
      { type: 'CHAMPION',      label: 'Weltmeister',    points: 10, max: 1 },
    ];
    for (const b of bonusConfig) {
      if ((bonusTypes as string[]).includes(b.type)) {
        insertBonus.run(roomId, b.type, b.label, b.points, b.max, null);
      }
    }
    db.exec('COMMIT');
  } catch (e) {
    db.exec('ROLLBACK');
    return res.status(500).json({ error: 'Raum konnte nicht erstellt werden' });
  }
  res.json({ token, code, roomName: roomName.trim(), nickname: nickname.trim(), roomId: roomId!, tournament, description: description.trim().slice(0, 200) || null });
});

// GET /api/rooms/:code — get room info + members
router.get('/:code', requireAuth, (req: AuthRequest, res: Response) => {
  const room = db.prepare('SELECT * FROM rooms WHERE code = ?').get(req.params.code) as any;
  if (!room) return res.status(404).json({ error: 'Raum nicht gefunden' });

  const members = db
    .prepare(
      'SELECT id, nickname, total_points FROM users WHERE room_id = ? ORDER BY total_points DESC, created_at ASC'
    )
    .all(room.id);

  res.json({ room, members });
});

// POST /api/rooms/:code/join — join existing room
router.post('/:code/join', (req: Request, res: Response) => {
  const { nickname } = req.body;
  if (!nickname?.trim()) return res.status(400).json({ error: 'Spitzname darf nicht leer sein' });

  const room = db.prepare('SELECT * FROM rooms WHERE code = ?').get(req.params.code) as any;
  if (!room) return res.status(404).json({ error: 'Raum nicht gefunden, bitte Einladungscode prüfen' });

  const existing = db
    .prepare('SELECT * FROM users WHERE nickname = ? AND room_id = ?')
    .get(nickname.trim(), room.id) as any;

  if (existing) {
    return res.json({
      token: existing.token,
      code: room.code,
      roomName: room.name,
      nickname: existing.nickname,
      roomId: room.id,
      tournament: room.tournament ?? '2026',
      description: room.description ?? null,
    });
  }

  const token = uuidv4();
  db.prepare('INSERT INTO users (nickname, room_id, token) VALUES (?, ?, ?)').run(
    nickname.trim(),
    room.id,
    token
  );
  res.json({ token, code: room.code, roomName: room.name, nickname: nickname.trim(), roomId: room.id, tournament: room.tournament ?? '2026', description: room.description ?? null });
});

export default router;
