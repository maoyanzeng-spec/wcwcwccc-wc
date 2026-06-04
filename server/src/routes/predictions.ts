import { Router, Response } from 'express';
import db from '../db/database';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { calculatePoints } from '../services/scoring';

const router = Router();

// POST /api/predictions — submit or update prediction
router.post('/', requireAuth, (req: AuthRequest, res: Response) => {
  const { match_id, home_score, away_score } = req.body;
  const userId = req.user!.id;

  if (match_id == null || home_score == null || away_score == null) {
    return res.status(400).json({ error: 'Fehlende Parameter' });
  }
  if (!Number.isInteger(home_score) || !Number.isInteger(away_score) || home_score < 0 || away_score < 0) {
    return res.status(400).json({ error: 'Ergebnis muss eine nicht-negative ganze Zahl sein' });
  }

  const match = db.prepare('SELECT status, match_time, home_score, away_score, tournament FROM matches WHERE id = ?').get(match_id) as any;
  if (!match) return res.status(404).json({ error: 'Spiel nicht gefunden' });

  const now = new Date();
  const matchTime = new Date(match.match_time);
  const is2022 = match.tournament === '2022';
  const deadline = new Date(matchTime.getTime() - 30 * 60 * 1000);
  if ((!is2022 && now >= deadline) || match.status === 'IN_PLAY' || match.status === 'FINISHED') {
    return res.status(400).json({ error: 'Tipp-Abgabe geschlossen (Abgabe bis 30 Min. vor Spielbeginn)' });
  }

  // If the match already has a result (test/historical mode), score immediately
  const hasResult = match.home_score != null && match.away_score != null;
  const points = hasResult
    ? calculatePoints(home_score, away_score, match.home_score, match.away_score)
    : null;

  db.prepare(`
    INSERT INTO predictions (user_id, match_id, home_score, away_score, points)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(user_id, match_id) DO UPDATE SET
      home_score = excluded.home_score,
      away_score = excluded.away_score,
      points = excluded.points
  `).run(userId, match_id, home_score, away_score, points);

  if (hasResult) {
    db.prepare(
      'UPDATE users SET total_points = (SELECT COALESCE(SUM(points), 0) FROM predictions WHERE user_id = ? AND points IS NOT NULL) WHERE id = ?'
    ).run(userId, userId);
  }

  res.json({ ok: true, points });
});

// GET /api/predictions — user's predictions
router.get('/', requireAuth, (req: AuthRequest, res: Response) => {
  const predictions = db
    .prepare('SELECT * FROM predictions WHERE user_id = ?')
    .all(req.user!.id);
  res.json(predictions);
});

export default router;
