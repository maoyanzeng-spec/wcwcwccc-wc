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

// Recompute a user's total from their scored match predictions + scored bonus picks.
export function recalcUserTotal(userId: number): void {
  db.prepare(`
    UPDATE users SET total_points = (
      SELECT COALESCE(SUM(points), 0) FROM predictions WHERE user_id = ? AND points IS NOT NULL
    ) + (
      SELECT COALESCE(SUM(points), 0) FROM bonus_picks WHERE user_id = ? AND points IS NOT NULL
    ) WHERE id = ?
  `).run(userId, userId, userId);
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

  db.exec('BEGIN');
  try {
    for (const pred of predictions) {
      const pts = calculatePoints(pred.home_score, pred.away_score, match.home_score, match.away_score);
      updatePred.run(pts, pred.id);
    }
    db.exec('COMMIT');
  } catch (e) {
    db.exec('ROLLBACK');
    throw e;
  }

  // Recompute totals outside the prediction transaction.
  for (const pred of predictions) recalcUserTotal(pred.user_id);
}

// Derive the correct answers for a bonus question from finished match results.
// bracketGroups limits which teams count (e.g. only semi-finalists from those groups).
// Returns [] while the relevant stage hasn't produced a result yet.
export function getCorrectTeams(type: string, tournament: string, bracketGroups?: string | null): string[] {
  const inBracket = (team: string): boolean => {
    if (!bracketGroups) return true;
    const groups = bracketGroups.split(',');
    const row = db.prepare(
      `SELECT group_name FROM matches WHERE tournament = ? AND (home_team = ? OR away_team = ?) AND group_name IS NOT NULL LIMIT 1`
    ).get(tournament, team, team) as any;
    return row ? groups.includes(row.group_name) : false;
  };

  if (type === 'SEMI_FINALIST') {
    const rows = db.prepare(
      "SELECT home_team, away_team FROM matches WHERE tournament = ? AND stage = 'SEMI_FINALS' AND home_score IS NOT NULL"
    ).all(tournament) as any[];
    return rows.flatMap(r => [r.home_team, r.away_team]).filter(inBracket);
  }
  if (type === 'FINALIST') {
    const row = db.prepare(
      "SELECT home_team, away_team FROM matches WHERE tournament = ? AND stage = 'FINAL' AND home_score IS NOT NULL"
    ).get(tournament) as any;
    if (!row) return [];
    return [row.home_team, row.away_team].filter(inBracket);
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

// Re-score every bonus pick for a tournament as knockout stages resolve, then
// recompute affected users' totals. Picks for stages not yet decided stay null.
// Safe to call repeatedly (idempotent).
export function scoreBonusPicks(tournament: string): void {
  const questions = db.prepare(`
    SELECT bq.id, bq.type, bq.points_per_pick, bq.bracket_groups
    FROM bonus_questions bq JOIN rooms r ON r.id = bq.room_id
    WHERE r.tournament = ?
  `).all(tournament) as any[];

  const updatePick = db.prepare('UPDATE bonus_picks SET points = ? WHERE id = ?');
  const affectedUsers = new Set<number>();

  db.exec('BEGIN');
  try {
    for (const q of questions) {
      const correct = getCorrectTeams(q.type, tournament, q.bracket_groups);
      if (correct.length === 0) continue; // stage not resolved yet — leave picks unscored
      const picks = db.prepare('SELECT id, user_id, team_name FROM bonus_picks WHERE question_id = ?').all(q.id) as any[];
      for (const p of picks) {
        updatePick.run(correct.includes(p.team_name) ? q.points_per_pick : 0, p.id);
        affectedUsers.add(p.user_id);
      }
    }
    db.exec('COMMIT');
  } catch (e) {
    db.exec('ROLLBACK');
    throw e;
  }

  for (const userId of affectedUsers) recalcUserTotal(userId);
}
