import { Router, Response } from 'express';
import db from '../db/database';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { getCorrectTeams, recalcUserTotal } from '../services/scoring';

const router = Router();

function getBonusDeadline(tournament: string): Date | null {
  const first = db.prepare(
    'SELECT match_time FROM matches WHERE tournament = ? ORDER BY match_time ASC LIMIT 1'
  ).get(tournament) as any;
  if (!first) return null;
  return new Date(new Date(first.match_time).getTime() - 30 * 60 * 1000);
}

// GET /api/bonus — questions + user picks + team list for this room
router.get('/', requireAuth, (req: AuthRequest, res: Response) => {
  const roomId = req.user!.room_id;
  const userId = req.user!.id;

  const room = db.prepare('SELECT tournament FROM rooms WHERE id = ?').get(roomId) as any;
  const questions = db.prepare('SELECT * FROM bonus_questions WHERE room_id = ? ORDER BY id').all(roomId) as any[];
  const picks = db.prepare('SELECT * FROM bonus_picks WHERE user_id = ?').all(userId) as any[];

  // Build per-question team lists filtered by bracket_groups
  const questionsWithTeams = questions.map((q: any) => {
    let teamQuery: string;
    const params: any[] = [];
    if (q.bracket_groups) {
      const groups = q.bracket_groups.split(',').map((g: string) => `'${g}'`).join(',');
      teamQuery = `
        SELECT DISTINCT home_team AS name, home_team_short AS short FROM matches
        WHERE tournament = ? AND group_name IN (${groups})
        UNION
        SELECT DISTINCT away_team AS name, away_team_short AS short FROM matches
        WHERE tournament = ? AND group_name IN (${groups})
        ORDER BY name ASC
      `;
      params.push(room.tournament, room.tournament);
    } else {
      teamQuery = `
        SELECT DISTINCT home_team AS name, home_team_short AS short FROM matches WHERE tournament = ?
        UNION
        SELECT DISTINCT away_team AS name, away_team_short AS short FROM matches WHERE tournament = ?
        ORDER BY name ASC
      `;
      params.push(room.tournament, room.tournament);
    }
    return { ...q, teams: db.prepare(teamQuery).all(...params) };
  });

  const deadline = room.tournament === '2022' ? null : getBonusDeadline(room.tournament);
  const isOpen = room.tournament === '2022' || !deadline || new Date() < deadline;

  res.json({ questions: questionsWithTeams, picks, deadline: deadline?.toISOString() ?? null, isOpen });
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

  // Enforce deadline for WM2026
  if (question.tournament !== '2022') {
    const deadline = getBonusDeadline(question.tournament);
    if (deadline && new Date() >= deadline) {
      return res.status(400).json({ error: 'Bonus-Abgabe geschlossen (Abgabe vor dem ersten Spiel)' });
    }
  }

  if (teams.length > question.max_picks) {
    return res.status(400).json({ error: `Maximal ${question.max_picks} Auswahl erlaubt` });
  }

  const correctTeams = getCorrectTeams(question.type, question.tournament, question.bracket_groups);

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

  if (correctTeams.length > 0) recalcUserTotal(userId);

  res.json({ ok: true, evaluated: correctTeams.length > 0 });
});

export default router;
