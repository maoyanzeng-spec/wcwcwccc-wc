import { describe, it, expect } from 'vitest';
import request from 'supertest';
import db from '../../db/database';
import { app } from '../../app';

function seedRoom() {
  const { lastInsertRowid: roomId } = db
    .prepare("INSERT INTO rooms (code, name) VALUES ('MATCH1', 'Test Room')")
    .run();
  db.prepare("INSERT INTO users (nickname, room_id, token) VALUES ('Alice', ?, 'match-token')")
    .run(roomId);
  return { token: 'match-token' };
}

function insertMatch(status = 'SCHEDULED', stage = 'GROUP_STAGE') {
  const matchTime = new Date(Date.now() + 3600_000).toISOString();
  const { lastInsertRowid } = db
    .prepare("INSERT INTO matches (stage, home_team, away_team, match_time, status) VALUES (?, 'Team A', 'Team B', ?, ?)")
    .run(stage, matchTime, status);
  return Number(lastInsertRowid);
}

describe('GET /api/matches', () => {
  it('returns all matches for an authenticated user', async () => {
    const { token } = seedRoom();
    insertMatch();

    const res = await request(app)
      .get('/api/matches')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0]).toMatchObject({ home_team: 'Team A', my_prediction: null });
  });

  it('returns 401 without auth', async () => {
    const res = await request(app).get('/api/matches');
    expect(res.status).toBe(401);
  });

  it('filters by stage', async () => {
    const { token } = seedRoom();
    insertMatch('SCHEDULED', 'GROUP_STAGE');
    insertMatch('SCHEDULED', 'FINAL');

    const res = await request(app)
      .get('/api/matches?stage=FINAL')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].stage).toBe('FINAL');
  });
});

describe('PATCH /api/matches/:id (admin)', () => {
  it('returns 403 without admin key', async () => {
    const matchId = insertMatch();
    const res = await request(app)
      .patch(`/api/matches/${matchId}`)
      .send({ home_score: 2, away_score: 1 });
    expect(res.status).toBe(403);
  });

  it('updates match result with valid admin key', async () => {
    const matchId = insertMatch();
    const res = await request(app)
      .patch(`/api/matches/${matchId}`)
      .set('x-admin-key', 'test-admin-key')
      .send({ home_score: 2, away_score: 1, status: 'FINISHED' });

    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
  });
});
