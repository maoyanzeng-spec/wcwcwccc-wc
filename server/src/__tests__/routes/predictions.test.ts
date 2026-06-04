import { describe, it, expect } from 'vitest';
import request from 'supertest';
import db from '../../db/database';
import { app } from '../../app';

function seedRoom() {
  const { lastInsertRowid: roomId } = db
    .prepare("INSERT INTO rooms (code, name) VALUES ('PRED01', 'Pred Room')")
    .run();
  db.prepare("INSERT INTO users (nickname, room_id, token) VALUES ('Alice', ?, 'pred-token')")
    .run(roomId);
  return { token: 'pred-token' };
}

function insertFutureMatch() {
  const futureTime = new Date(Date.now() + 3600_000).toISOString();
  const { lastInsertRowid } = db
    .prepare("INSERT INTO matches (stage, home_team, away_team, match_time, status) VALUES ('GROUP_STAGE', 'A', 'B', ?, 'SCHEDULED')")
    .run(futureTime);
  return Number(lastInsertRowid);
}

function insertFinishedMatch() {
  const pastTime = new Date(Date.now() - 3600_000).toISOString();
  const { lastInsertRowid } = db
    .prepare("INSERT INTO matches (stage, home_team, away_team, match_time, status) VALUES ('GROUP_STAGE', 'A', 'B', ?, 'FINISHED')")
    .run(pastTime);
  return Number(lastInsertRowid);
}

describe('POST /api/predictions', () => {
  it('submits a prediction for a future match', async () => {
    const { token } = seedRoom();
    const matchId = insertFutureMatch();

    const res = await request(app)
      .post('/api/predictions')
      .set('Authorization', `Bearer ${token}`)
      .send({ match_id: matchId, home_score: 2, away_score: 1 });

    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
  });

  it('rejects prediction for a finished match', async () => {
    const { token } = seedRoom();
    const matchId = insertFinishedMatch();

    const res = await request(app)
      .post('/api/predictions')
      .set('Authorization', `Bearer ${token}`)
      .send({ match_id: matchId, home_score: 1, away_score: 0 });

    expect(res.status).toBe(400);
  });

  it('rejects negative scores', async () => {
    const { token } = seedRoom();
    const matchId = insertFutureMatch();

    const res = await request(app)
      .post('/api/predictions')
      .set('Authorization', `Bearer ${token}`)
      .send({ match_id: matchId, home_score: -1, away_score: 0 });

    expect(res.status).toBe(400);
  });

  it('updates an existing prediction (upsert)', async () => {
    const { token } = seedRoom();
    const matchId = insertFutureMatch();

    await request(app)
      .post('/api/predictions')
      .set('Authorization', `Bearer ${token}`)
      .send({ match_id: matchId, home_score: 1, away_score: 0 });

    const res = await request(app)
      .post('/api/predictions')
      .set('Authorization', `Bearer ${token}`)
      .send({ match_id: matchId, home_score: 3, away_score: 3 });

    expect(res.status).toBe(200);
  });

  it('returns 401 without auth', async () => {
    const res = await request(app)
      .post('/api/predictions')
      .send({ match_id: 1, home_score: 1, away_score: 0 });
    expect(res.status).toBe(401);
  });
});

describe('GET /api/predictions', () => {
  it("returns the user's submitted predictions", async () => {
    const { token } = seedRoom();
    const matchId = insertFutureMatch();

    await request(app)
      .post('/api/predictions')
      .set('Authorization', `Bearer ${token}`)
      .send({ match_id: matchId, home_score: 2, away_score: 0 });

    const res = await request(app)
      .get('/api/predictions')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0]).toMatchObject({ home_score: 2, away_score: 0 });
  });
});
