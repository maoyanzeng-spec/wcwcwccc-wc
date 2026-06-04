import axios from 'axios';
import db from '../db/database';
import { processMatchResults } from './scoring';

const API_BASE = 'https://api.football-data.org/v4';
const API_KEY = process.env.FOOTBALL_API_KEY;

// Stage mapping from API to our internal names
const STAGE_MAP: Record<string, string> = {
  GROUP_STAGE: 'GROUP_STAGE',
  LAST_32: 'LAST_32',
  LAST_16: 'LAST_16',
  QUARTER_FINALS: 'QUARTER_FINALS',
  SEMI_FINALS: 'SEMI_FINALS',
  THIRD_PLACE: 'THIRD_PLACE',
  FINAL: 'FINAL',
};

interface ApiMatch {
  id: number;
  stage: string;
  group: string | null;
  matchday: number | null;
  utcDate: string;
  status: string;
  homeTeam: { name: string; shortName: string; crest: string };
  awayTeam: { name: string; shortName: string; crest: string };
  score: { fullTime: { home: number | null; away: number | null } };
}

export async function syncMatches(): Promise<void> {
  if (!API_KEY) {
    console.log('No FOOTBALL_API_KEY set, skipping sync. Using existing data.');
    return;
  }

  try {
    const res = await axios.get(`${API_BASE}/competitions/WC/matches?season=2026`, {
      headers: { 'X-Auth-Token': API_KEY },
    });
    const matches: ApiMatch[] = res.data.matches ?? [];

    const upsert = db.prepare(`
      INSERT INTO matches (external_id, stage, group_name, match_day, home_team, away_team, home_team_short, away_team_short, home_team_crest, away_team_crest, match_time, home_score, away_score, status, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
      ON CONFLICT(external_id) DO UPDATE SET
        home_score = excluded.home_score,
        away_score = excluded.away_score,
        status = excluded.status,
        updated_at = datetime('now')
    `);

    db.exec('BEGIN');
    try {
      for (const m of matches) {
        upsert.run(
          String(m.id),
          STAGE_MAP[m.stage] ?? m.stage,
          m.group ?? null,
          m.matchday ?? null,
          m.homeTeam.name,
          m.awayTeam.name,
          m.homeTeam.shortName,
          m.awayTeam.shortName,
          m.homeTeam.crest,
          m.awayTeam.crest,
          m.utcDate,
          m.score.fullTime.home,
          m.score.fullTime.away,
          normalizeStatus(m.status)
        );
      }
      db.exec('COMMIT');
    } catch (e) {
      db.exec('ROLLBACK');
      throw e;
    }

    // Recalculate scores for newly finished matches
    const finished = db
      .prepare("SELECT id FROM matches WHERE status = 'FINISHED' AND home_score IS NOT NULL")
      .all() as { id: number }[];
    for (const { id } of finished) {
      processMatchResults(id);
    }

    console.log(`Synced ${matches.length} matches from football-data.org`);
  } catch (err: any) {
    console.error('Football API sync failed:', err.message);
  }
}

function normalizeStatus(status: string): string {
  const map: Record<string, string> = {
    SCHEDULED: 'SCHEDULED',
    TIMED: 'SCHEDULED',
    IN_PLAY: 'IN_PLAY',
    PAUSED: 'IN_PLAY',
    FINISHED: 'FINISHED',
    SUSPENDED: 'SCHEDULED',
    POSTPONED: 'SCHEDULED',
    CANCELLED: 'SCHEDULED',
  };
  return map[status] ?? 'SCHEDULED';
}
