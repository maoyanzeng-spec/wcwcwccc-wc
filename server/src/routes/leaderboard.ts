import { Router, Response } from 'express';
import db from '../db/database';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/leaderboard — room leaderboard
router.get('/', requireAuth, (req: AuthRequest, res: Response) => {
  const roomId = req.user!.room_id;

  const rows = db.prepare(`
    SELECT
      u.id,
      u.nickname,
      COUNT(p.id) as predictions_count,
      SUM(CASE WHEN p.points = 3 THEN 1 ELSE 0 END) as exact_scores,
      SUM(CASE WHEN p.points >= 1 THEN 1 ELSE 0 END) as correct_outcomes,
      COALESCE((SELECT SUM(p2.points) FROM predictions p2 WHERE p2.user_id = u.id AND p2.points IS NOT NULL), 0) as match_points,
      COALESCE((SELECT SUM(bp.points) FROM bonus_picks bp WHERE bp.user_id = u.id AND bp.points IS NOT NULL), 0) as bonus_points
    FROM users u
    LEFT JOIN predictions p ON p.user_id = u.id
    WHERE u.room_id = ?
    GROUP BY u.id
    ORDER BY (match_points + bonus_points) DESC, exact_scores DESC, u.created_at ASC
  `).all(roomId) as any[];

  const leaderboard = rows.map((r, i) => ({
    rank: i + 1,
    id: r.id,
    nickname: r.nickname,
    total_points: r.match_points + r.bonus_points,
    match_points: r.match_points,
    bonus_points: r.bonus_points,
    predictions_count: r.predictions_count,
    exact_scores: r.exact_scores ?? 0,
    correct_outcomes: r.correct_outcomes ?? 0,
    is_me: r.id === req.user!.id,
  }));

  res.json(leaderboard);
});

export default router;
