import db from '../db/database';

export function calculatePoints(
  predHome: number, predAway: number,
  actualHome: number, actualAway: number
): number {
  if (predHome === actualHome && predAway === actualAway) return 3;
  const predOutcome = predHome > predAway ? 'H' : predHome < predAway ? 'A' : 'D';
  const actualOutcome = actualHome > actualAway ? 'H' : actualHome < actualAway ? 'A' : 'D';
  if (predOutcome === actualOutcome) return 1;
  return 0;
}

export function processMatchResults(matchId: number): void {
  const match = db
    .prepare('SELECT * FROM matches WHERE id = ? AND status = ? AND home_score IS NOT NULL')
    .get(matchId, 'FINISHED') as any;
  if (!match) return;

  const predictions = db
    .prepare('SELECT * FROM predictions WHERE match_id = ?')
    .all(matchId) as any[];

  const updatePred = db.prepare('UPDATE predictions SET points = ? WHERE id = ?');
  const updateUser = db.prepare(`
    UPDATE users SET total_points = (
      SELECT COALESCE(SUM(points), 0) FROM predictions WHERE user_id = ? AND points IS NOT NULL
    ) + (
      SELECT COALESCE(SUM(points), 0) FROM bonus_picks WHERE user_id = ? AND points IS NOT NULL
    ) WHERE id = ?
  `);

  db.exec('BEGIN');
  try {
    for (const pred of predictions) {
      const pts = calculatePoints(pred.home_score, pred.away_score, match.home_score, match.away_score);
      updatePred.run(pts, pred.id);
      updateUser.run(pred.user_id, pred.user_id, pred.user_id);
    }
    db.exec('COMMIT');
  } catch (e) {
    db.exec('ROLLBACK');
    throw e;
  }
}
