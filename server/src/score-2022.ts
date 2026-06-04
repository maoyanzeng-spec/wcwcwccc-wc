// Restores real WC 2022 results and calculates points for all predictions.
// Run AFTER players have submitted their tips.
// Usage: npm run score:2022
import db from './db/database';
import { wc2022Results } from './data/wc2022';
import { processMatchResults } from './services/scoring';

const updateMatch = db.prepare(`
  UPDATE matches
  SET home_score = ?, away_score = ?, status = 'FINISHED', updated_at = datetime('now')
  WHERE tournament = '2022' AND home_team = ? AND away_team = ? AND stage = ?
  RETURNING id
`);

let updated = 0;
let scored = 0;

db.exec('BEGIN');
for (const m of wc2022Results) {
  const rows = updateMatch.all(m.homeScore, m.awayScore, m.homeTeam, m.awayTeam, m.stage) as { id: number }[];
  updated += rows.length;
  for (const row of rows) {
    db.exec('COMMIT');
    processMatchResults(row.id);
    db.exec('BEGIN');
    scored++;
  }
}
db.exec('COMMIT');

console.log(`Restored results for ${updated} matches, scored ${scored} prediction sets.`);
console.log('Check the leaderboard to see rankings.');
