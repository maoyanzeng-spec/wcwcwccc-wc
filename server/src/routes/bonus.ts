import { Router, Response } from 'express';
import db from '../db/database';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();

// Derive correct answers for a bonus question from match results
function getCorrectTeams(type: string, tournament: string): string[] {
  if (type === 'SEMI_FINALIST') {
    const rows = db.prepare(
      "SELECT home_team, away_team FROM matches WHERE tournament = ? AND stage = 'SEMI_FINALS' AND home_score IS NOT NULL"
    ).all(tournament) as any[];
    return rows.flatMap(r => [r.home_team, r.away_team]);
  }
  if (type === 'FINALIST') {
    const row = db.prepare(
      "SELECT home_team, away_team FROM matches WHERE tournament = ? AND stage = 'FINAL' AND home_score IS NOT NULL"
    ).get(tournament) as any;
    return row ? [row.home_team, row.away_team] : [];
  }
  if (type === 'CHAMPION') {
    const row = db.prepare(
      "SELECT home_team, away_team, home_score, away_score, winner_team FROM matches WHERE tournament = ? AND stage = 'FINAL' AND home_score IS NOT NULL"
    ).get(tournament) as any;
    if (!row) return [];
    if (row.winner_team) return [row.winner_team];
    if (row.home_score > row.away_score) return [row.home_team];
    if (row.away_score > row.home_score) return [row.away_team];
  }
  return [];
}

function recalcUserBonusPoints(userId: number) {
  const matchPts = (db.prepare(
    'SELECT COALESCE(SUM(points), 0) as t FROM predictions WHERE user_id = ? AND points IS NOT NULL'
  ).get(userId) as any).t;
  const bonusPts = (db.prepare(
    'SELECT COALESCE(SUM(points), 0) as t FROM bonus_picks WHERE user_id = ? AND points IS NOT NULL'
  ).get(userId) as any).t;
  db.prepare('UPDATE users SET total_points = ? WHERE id = ?').run(matchPts + bonusPts, userId);
}

// GET /api/bonus — questions + user picks + team list for this room
router.get('/', requireAuth, (req: AuthRequest, res: Response) => {
  const roomId = req.user!.room_id;
  const userId = req.user!.id;

  const room = db.prepare('SELECT tournament FROM rooms WHERE id = ?').get(roomId) as any;
  const questions = db.prepare('SELECT * FROM bonus_questions WHERE room_id = ? ORDER BY id').all(roomId) as any[];
  const picks = db.prepare('SELECT * FROM bonus_picks WHERE user_id = ?').all(userId) as any[];
  const teams = db.prepare(`
    SELECT DISTINCT home_team AS name, home_team_short AS short FROM matches WHERE tournament = ?
    UNION
    SELECT DISTINCT away_team AS name, away_team_short AS short FROM matches WHERE tournament = ?
    ORDER BY name ASC
  `).all(room.tournament, room.tournament) as any[];

  res.json({ questions, picks, teams });
});

// POST /api/bonus/:id/picks — save picks, auto-score if answers are known
router.post('/:id/picks', requireAuth, (req: AuthRequest, res: Response) => {
  const questionId = Number(req.params.id);
  const userId = req.user!.id;
  const { teams } = req.body;

  if (!Array.isArray(teams)) return res.status(400).json({ error: 'teams muss ein Array sein' });

  const question = db.prepare(
    'SELECT bq.*, r.tournament FROM bonus_questions bq JOIN rooms r ON r.id = bq.room_id WHERE bq.id = ? AND bq.room_id = ?'
  ).get(questionId, req.user!.room_id) as any;
  if (!question) return res.status(404).json({ error: 'Frage nicht gefunden' });

  if (teams.length > question.max_picks) {
    return res.status(400).json({ error: `Maximal ${question.max_picks} Auswahl erlaubt` });
  }

  const correctTeams = getCorrectTeams(question.type, question.tournament);

  db.exec('BEGIN');
  db.prepare('DELETE FROM bonus_picks WHERE user_id = ? AND question_id = ?').run(userId, questionId);
  const insertPick = db.prepare(
    'INSERT INTO bonus_picks (user_id, question_id, team_name, points) VALUES (?, ?, ?, ?)'
  );
  for (const team of teams) {
    const pts = correctTeams.length > 0
      ? (correctTeams.includes(team) ? question.points_per_pick : 0)
      : null;
    insertPick.run(userId, questionId, team, pts);
  }
  db.exec('COMMIT');

  if (correctTeams.length > 0) recalcUserBonusPoints(userId);

  res.json({ ok: true, evaluated: correctTeams.length > 0 });
});

export default router;
