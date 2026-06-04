import { beforeEach } from 'vitest';
import db from '../db/database';

beforeEach(() => {
  db.exec('DELETE FROM bonus_picks');
  db.exec('DELETE FROM bonus_questions');
  db.exec('DELETE FROM predictions');
  db.exec('DELETE FROM users');
  db.exec('DELETE FROM rooms');
  db.exec('DELETE FROM matches');
});
