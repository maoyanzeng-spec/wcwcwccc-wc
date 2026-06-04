// Opens predictions for WM2022 by setting matches to SCHEDULED with near-future dates.
// Run BEFORE players submit their tips.
// Usage: npm run open:2022
import db from './db/database';

const matches = db.prepare("SELECT id FROM matches WHERE tournament = '2022' ORDER BY id ASC").all() as { id: number }[];

// Spread match times starting from 1 hour from now, 30 min apart
const base = Date.now() + 60 * 60 * 1000;

db.exec('BEGIN');
const update = db.prepare(`
  UPDATE matches
  SET status = 'SCHEDULED', match_time = ?
  WHERE id = ?
`);
matches.forEach((m, i) => {
  const t = new Date(base + i * 30 * 60 * 1000).toISOString();
  update.run(t, m.id);
});
db.exec('COMMIT');

console.log(`Opened predictions for ${matches.length} WC 2022 matches (real scores kept for auto-evaluation).`);
console.log('Points are calculated automatically the moment a tip is submitted.');
