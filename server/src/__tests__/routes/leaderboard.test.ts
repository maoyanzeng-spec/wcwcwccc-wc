import { describe, it, expect } from 'vitest';
import request from 'supertest';
import db from '../../db/database';
import { app } from '../../app';

describe('GET /api/leaderboard', () => {
  it('returns members ranked by points', async () => {
    const { lastInsertRowid: roomId } = db
      .prepare("INSERT INTO rooms (code, name) VALUES ('LEAD01', 'Leader Room')")
      .run();
    db.prepare("INSERT INTO users (nickname, room_id, token, total_points) VALUES ('Alice', ?, 'token-alice', 6)").run(roomId);
    db.prepare("INSERT INTO users (nickname, room_id, token, total_points) VALUES ('Bob', ?, 'token-bob', 3)").run(roomId);

    const res = await request(app)
      .get('/api/leaderboard')
      .set('Authorization', 'Bearer token-alice');

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
    expect(res.body[0]).toMatchObject({ nickname: 'Alice', rank: 1, is_me: true });
    expect(res.body[1]).toMatchObject({ nickname: 'Bob', rank: 2, is_me: false });
  });

  it('returns 401 without auth', async () => {
    const res = await request(app).get('/api/leaderboard');
    expect(res.status).toBe(401);
  });
});
