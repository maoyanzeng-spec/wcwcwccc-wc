// Database backup service.
//
// Strategy (see global engineering standards in CLAUDE.md):
//  - Snapshot via SQLite `VACUUM INTO` (consistent, includes committed WAL data).
//  - Backups live on the SAME durable storage as the DB (Railway Volume), so they
//    survive redeploys/restarts. Set BACKUP_DIR to a path on the volume.
//  - Skip snapshotting an empty DB so an accidental wipe can't rotate good backups out.
//  - Rolling retention: keep the most recent N snapshots.
//  - A startup/pre-mutation backup MUST run before any code that could modify data.
import { DatabaseSync } from 'node:sqlite';
import path from 'path';
import fs from 'fs';
import db from '../db/database';

const DB_PATH = process.env.DB_PATH ?? path.join(process.cwd(), 'data', 'worldcup.db');
// Default backups live next to the DB (same volume → survive redeploys).
const BACKUP_DIR = process.env.BACKUP_DIR ?? path.join(path.dirname(DB_PATH), 'backups');
const RETENTION = Number(process.env.BACKUP_RETENTION ?? 30);

function hasUserData(): boolean {
  try {
    const rooms = (db.prepare('SELECT COUNT(*) AS c FROM rooms').get() as any).c;
    const users = (db.prepare('SELECT COUNT(*) AS c FROM users').get() as any).c;
    const predictions = (db.prepare('SELECT COUNT(*) AS c FROM predictions').get() as any).c;
    return rooms > 0 || users > 0 || predictions > 0;
  } catch {
    // Tables may not exist yet on a brand-new DB — nothing worth backing up.
    return false;
  }
}

function pruneOldBackups(): void {
  const files = fs
    .readdirSync(BACKUP_DIR)
    .filter((f) => f.startsWith('worldcup-') && f.endsWith('.db'))
    .sort(); // ISO timestamps sort chronologically
  const excess = files.length - RETENTION;
  for (let i = 0; i < excess; i++) {
    try { fs.unlinkSync(path.join(BACKUP_DIR, files[i])); } catch { /* ignore */ }
  }
}

/**
 * Take a point-in-time backup of the database.
 * Safe to call on startup and before any destructive operation.
 * @param reason short tag recorded in logs (e.g. 'startup', 'pre-reseed')
 * @returns the backup file path, or null if skipped
 */
export function backupDatabase(reason = 'manual'): string | null {
  // In-memory test DB has nothing on disk to snapshot.
  if (DB_PATH === ':memory:') return null;

  if (!hasUserData()) {
    console.log(`[backup] Skipped (${reason}): DB is empty, nothing to back up.`);
    return null;
  }

  if (!fs.existsSync(BACKUP_DIR)) fs.mkdirSync(BACKUP_DIR, { recursive: true });

  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const dest = path.join(BACKUP_DIR, `worldcup-${stamp}.db`);

  // VACUUM INTO writes a clean, consistent copy. Escape single quotes; use a
  // separate connection so it doesn't interfere with the app's WAL connection.
  const literal = dest.replace(/'/g, "''");
  const snap = new DatabaseSync(DB_PATH);
  try {
    snap.exec(`VACUUM INTO '${literal}'`);
  } finally {
    snap.close();
  }

  console.log(`[backup] Wrote ${reason} snapshot → ${dest}`);
  pruneOldBackups();
  return dest;
}

/** Periodic backups every 6 hours, on top of the startup snapshot. */
export function scheduleBackups(): void {
  const SIX_HOURS = 6 * 60 * 60 * 1000;
  setInterval(() => {
    try { backupDatabase('scheduled'); } catch (e) { console.error('[backup] scheduled failed', e); }
  }, SIX_HOURS).unref();
}
