// Uses Node.js built-in sqlite (no npm package, no compilation needed)
// Requires --experimental-sqlite flag (set via .npmrc node-options)
import { DatabaseSync } from 'node:sqlite';
import path from 'path';
import fs from 'fs';

const DB_PATH = process.env.DB_PATH ?? path.join(process.cwd(), 'data', 'worldcup.db');
const dbDir = path.dirname(DB_PATH);
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });

const db = new DatabaseSync(DB_PATH);
db.exec('PRAGMA journal_mode = WAL');
db.exec('PRAGMA foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS rooms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nickname TEXT NOT NULL,
    room_id INTEGER NOT NULL,
    token TEXT UNIQUE NOT NULL,
    total_points INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (room_id) REFERENCES rooms(id),
    UNIQUE(nickname, room_id)
  );

  CREATE TABLE IF NOT EXISTS matches (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    external_id TEXT UNIQUE,
    stage TEXT NOT NULL,
    group_name TEXT,
    match_day INTEGER,
    home_team TEXT NOT NULL,
    away_team TEXT NOT NULL,
    home_team_short TEXT,
    away_team_short TEXT,
    home_team_crest TEXT,
    away_team_crest TEXT,
    match_time TEXT NOT NULL,
    home_score INTEGER,
    away_score INTEGER,
    status TEXT DEFAULT 'SCHEDULED',
    updated_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS predictions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    match_id INTEGER NOT NULL,
    home_score INTEGER NOT NULL,
    away_score INTEGER NOT NULL,
    points INTEGER,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (match_id) REFERENCES matches(id),
    UNIQUE(user_id, match_id)
  );
`);

// Migrations (safe to re-run)
try { db.exec("ALTER TABLE matches ADD COLUMN tournament TEXT DEFAULT '2026'"); } catch {}
try { db.exec("ALTER TABLE rooms ADD COLUMN tournament TEXT DEFAULT '2026'"); } catch {}
try { db.exec("ALTER TABLE rooms ADD COLUMN description TEXT"); } catch {}
try { db.exec("ALTER TABLE matches ADD COLUMN winner_team TEXT"); } catch {}

db.exec(`
  CREATE TABLE IF NOT EXISTS bonus_questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    room_id INTEGER NOT NULL,
    type TEXT NOT NULL,
    label TEXT NOT NULL,
    points_per_pick INTEGER NOT NULL,
    max_picks INTEGER NOT NULL,
    bracket_groups TEXT,
    FOREIGN KEY (room_id) REFERENCES rooms(id)
  );

  CREATE TABLE IF NOT EXISTS bonus_picks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    question_id INTEGER NOT NULL,
    team_name TEXT NOT NULL,
    points INTEGER,
    UNIQUE(user_id, question_id, team_name),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (question_id) REFERENCES bonus_questions(id)
  );
`);

// Must run after bonus_questions table is created
try { db.exec("ALTER TABLE bonus_questions ADD COLUMN bracket_groups TEXT"); } catch {}

// Translate legacy German bonus labels to Chinese
db.exec(`
  UPDATE bonus_questions SET label = '半决赛队伍' WHERE type = 'SEMI_FINALIST' AND label != '半决赛队伍';
  UPDATE bonus_questions SET label = '决赛队伍'   WHERE type = 'FINALIST'      AND label != '决赛队伍';
  UPDATE bonus_questions SET label = '世界杯冠军' WHERE type = 'CHAMPION'      AND label != '世界杯冠军';
`);

export default db;
