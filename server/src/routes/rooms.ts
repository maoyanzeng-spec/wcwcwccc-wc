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
  const { roomName, nickname, tournament = '2026', bonusTypes = ['SEMI_FINALIST', 'FINALIST', 'CHAMPION'] } = req.body;
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
      .prepare('INSERT INTO rooms (code, name, tournament) VALUES (?, ?, ?)')
      .run(code, roomName.trim(), tournament);
    roomId = Number(lastInsertRowid);
    db.prepare('INSERT INTO users (nickname, room_id, token) VALUES (?, ?, ?)').run(
      nickname.trim(), roomId, token
    );
    // Bracket structure per tournament
    const BRACKETS: Record<string, { semi: string[][], final: string[][] }> = {
      '2026': {
        semi:  [['GROUP_A','GROUP_B','GROUP_C'], ['GROUP_D','GROUP_E','GROUP_F'], ['GROUP_G','GROUP_H','GROUP_I'], ['GROUP_J','GROUP_K','GROUP_L']],
        final: [['GROUP_A','GROUP_B','GROUP_C','GROUP_D','GROUP_E','GROUP_F'], ['GROUP_G','GROUP_H','GROUP_I','GROUP_J','GROUP_K','GROUP_L']],
      },
      '2022': {
        semi:  [['GROUP_A','GROUP_B'], ['GROUP_C','GROUP_D'], ['GROUP_E','GROUP_F'], ['GROUP_G','GROUP_H']],
        final: [['GROUP_A','GROUP_B','GROUP_C','GROUP_D'], ['GROUP_E','GROUP_F','GROUP_G','GROUP_H']],
      },
    };
    const bracket = BRACKETS[tournament] ?? BRACKETS['2026'];

    const insertBonus = db.prepare(
      'INSERT INTO bonus_questions (room_id, type, label, points_per_pick, max_picks, bracket_groups) VALUES (?, ?, ?, ?, ?, ?)'
    );

    if ((bonusTypes as string[]).includes('SEMI_FINALIST')) {
      bracket.semi.forEach((groups, i) => {
        const groupLetters = groups.map(g => g.replace('GROUP_', '')).join(', ');
        insertBonus.run(roomId, 'SEMI_FINALIST', `Viertel ${i + 1} (Gruppe ${groupLetters})`, 2, 1, groups.join(','));
      });
    }
    if ((bonusTypes as string[]).includes('FINALIST')) {
      bracket.final.forEach((groups, i) => {
        const letters = groups.map(g => g.replace('GROUP_', ''));
        const label = `Halbfinale ${i + 1} (Gruppe ${letters[0]}–${letters[letters.length - 1]})`;
        insertBonus.run(roomId, 'FINALIST', label, 4, 1, groups.join(','));
      });
    }
    if ((bonusTypes as string[]).includes('CHAMPION')) {
      insertBonus.run(roomId, 'CHAMPION', 'Weltmeister', 10, 1, null);
    }
    db.exec('COMMIT');
  } catch (e) {
    db.exec('ROLLBACK');
    return res.status(500).json({ error: 'Raum konnte nicht erstellt werden' });
  }
  res.json({ token, code, roomName: roomName.trim(), nickname: nickname.trim(), roomId: roomId!, tournament });
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
    });
  }

  const token = uuidv4();
  db.prepare('INSERT INTO users (nickname, room_id, token) VALUES (?, ?, ?)').run(
    nickname.trim(),
    room.id,
    token
  );
  res.json({ token, code: room.code, roomName: room.name, nickname: nickname.trim(), roomId: room.id, tournament: room.tournament ?? '2026' });
});

export default router;
