import { Router, Response } from 'express';
import db from '../db/database';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { processMatchResults, scoreBonusPicks, recalcUserTotal } from '../services/scoring';
import { syncMatches } from '../services/footballApi';
import { autoSeedIfEmpty } from '../services/autoSeed';
import { backupDatabase } from '../services/backup';

const router = Router();

// GET /api/matches — all matches with user's prediction if any
router.get('/', requireAuth, (req: AuthRequest, res: Response) => {
  const { stage } = req.query;
  const userId = req.user!.id;

  let query = `
    SELECT m.*,
      p.id as pred_id, p.home_score as pred_home, p.away_score as pred_away, p.points as pred_points
    FROM matches m
    LEFT JOIN predictions p ON p.match_id = m.id AND p.user_id = ?
    WHERE m.tournament = (SELECT tournament FROM rooms WHERE id = ?)
  `;
  const params: any[] = [userId, req.user!.room_id];

  if (stage) {
    query += ' AND m.stage = ?';
    params.push(stage);
  }
  query += ' ORDER BY m.match_time ASC';

  const rows = db.prepare(query).all(...params) as any[];
  const matches = rows.map((r) => ({
    id: r.id,
    external_id: r.external_id,
    stage: r.stage,
    group_name: r.group_name,
    match_day: r.match_day,
    home_team: r.home_team,
    away_team: r.away_team,
    home_team_short: r.home_team_short,
    away_team_short: r.away_team_short,
    home_team_crest: r.home_team_crest,
    away_team_crest: r.away_team_crest,
    match_time: r.match_time,
    home_score: r.home_score,
    away_score: r.away_score,
    status: r.status,
    my_prediction: r.pred_id
      ? { id: r.pred_id, home_score: r.pred_home, away_score: r.pred_away, points: r.pred_points }
      : null,
  }));

  res.json(matches);
});

// POST /api/matches/seed — force seed WM 2026 matches (admin)
router.post('/seed', (req: AuthRequest, res: Response) => {
  const adminKey = req.headers['x-admin-key'];
  if (adminKey !== process.env.ADMIN_KEY) {
    return res.status(403).json({ error: 'Keine Berechtigung' });
  }
  // Back up before this destructive reseed so it's recoverable.
  backupDatabase('pre-reseed');
  db.exec("DELETE FROM predictions WHERE match_id IN (SELECT id FROM matches WHERE tournament='2026')");
  db.exec("DELETE FROM matches WHERE tournament='2026'");
  autoSeedIfEmpty();
  const count = (db.prepare("SELECT COUNT(*) as c FROM matches WHERE tournament='2026'").get() as any).c;
  res.json({ ok: true, seeded: count });
});

// POST /api/matches/sync — trigger manual sync (admin)
router.post('/sync', async (req: AuthRequest, res: Response) => {
  const adminKey = req.headers['x-admin-key'];
  if (adminKey !== process.env.ADMIN_KEY) {
    return res.status(403).json({ error: 'Keine Berechtigung' });
  }
  await syncMatches();
  res.json({ ok: true });
});

// POST /api/matches/recalc — idempotent full rebuild of every finished match +
// all bonus picks + every user's total. Safety net if scores ever drift.
router.post('/recalc', (req: AuthRequest, res: Response) => {
  const adminKey = req.headers['x-admin-key'];
  if (adminKey !== process.env.ADMIN_KEY) {
    return res.status(403).json({ error: 'Keine Berechtigung' });
  }
  const finished = db
    .prepare("SELECT id FROM matches WHERE status = 'FINISHED' AND home_score IS NOT NULL")
    .all() as { id: number }[];
  for (const { id } of finished) processMatchResults(id);
  for (const t of ['2026', '2022']) scoreBonusPicks(t);
  // Recompute every user's total so nobody is left stale.
  const users = db.prepare('SELECT id FROM users').all() as { id: number }[];
  for (const { id } of users) recalcUserTotal(id);
  res.json({ ok: true, recalculated: finished.length, users: users.length });
});

// PATCH /api/matches/:id — manually update result (admin)
router.patch('/:id', (req: AuthRequest, res: Response) => {
  const adminKey = req.headers['x-admin-key'];
  if (adminKey !== process.env.ADMIN_KEY) {
    return res.status(403).json({ error: 'Keine Berechtigung' });
  }

  const { home_score, away_score, status } = req.body;
  const matchId = Number(req.params.id);

  db.prepare(`
    UPDATE matches SET home_score = ?, away_score = ?, status = ?, updated_at = datetime('now')
    WHERE id = ?
  `).run(home_score, away_score, status ?? 'FINISHED', matchId);

  if ((status ?? 'FINISHED') === 'FINISHED') {
    processMatchResults(matchId);
    // A finished semi-final/final may resolve bonus questions for that tournament.
    const m = db.prepare('SELECT tournament FROM matches WHERE id = ?').get(matchId) as any;
    if (m) scoreBonusPicks(m.tournament);
  }

  res.json({ ok: true });
});

export default router;
