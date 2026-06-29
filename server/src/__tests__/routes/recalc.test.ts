import { describe, it, expect } from 'vitest';
import request from 'supertest';
import db from '../../db/database';
import { app } from '../../app';

describe('POST /api/matches/recalc (admin)', () => {
  it('returns 403 without admin key', async () => {
    const res = await request(app).post('/api/matches/recalc');
    expect(res.status).toBe(403);
  });

  it('rebuilds match points and user totals idempotently', async () => {
    const { lastInsertRowid: roomId } = db
      .prepare("INSERT INTO rooms (code, name) VALUES ('RECAL1', 'Recalc Room')")
      .run();
    const { lastInsertRowid: userId } = db
      .prepare("INSERT INTO users (nickname, room_id, token, total_points) VALUES ('Al', ?, 'rc-token', 999)")
      .run(roomId);
    const { lastInsertRowid: matchId } = db
      .prepare("INSERT INTO matches (stage, home_team, away_team, match_time, home_score, away_score, status) VALUES ('GROUP_STAGE','A','B','2026-06-11T19:00:00Z',2,1,'FINISHED')")
      .run();
    // Exact-score prediction worth 3, but points/total left stale.
    db.prepare("INSERT INTO predictions (user_id, match_id, home_score, away_score, points) VALUES (?, ?, 2, 1, NULL)")
      .run(userId, matchId);

    const res = await request(app)
      .post('/api/matches/recalc')
      .set('x-admin-key', 'test-admin-key');

    expect(res.status).toBe(200);
    expect(res.body.recalculated).toBe(1);

    const pred = db.prepare('SELECT points FROM predictions WHERE user_id = ?').get(userId) as any;
    expect(pred.points).toBe(3);
    const user = db.prepare('SELECT total_points FROM users WHERE id = ?').get(userId) as any;
    expect(user.total_points).toBe(3);
  });
});
