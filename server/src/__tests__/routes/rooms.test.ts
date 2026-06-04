import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../../app';

describe('POST /api/rooms', () => {
  it('creates a room and returns a token', async () => {
    const res = await request(app)
      .post('/api/rooms')
      .send({ roomName: 'Test Room', nickname: 'Alice' });

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      roomName: 'Test Room',
      nickname: 'Alice',
      code: expect.stringMatching(/^[A-Z0-9]{6}$/),
      token: expect.any(String),
      roomId: expect.any(Number),
    });
  });

  it('returns 400 when roomName is missing', async () => {
    const res = await request(app)
      .post('/api/rooms')
      .send({ nickname: 'Alice' });
    expect(res.status).toBe(400);
  });

  it('returns 400 when nickname is missing', async () => {
    const res = await request(app)
      .post('/api/rooms')
      .send({ roomName: 'Test Room' });
    expect(res.status).toBe(400);
  });
});

describe('POST /api/rooms/:code/join', () => {
  it('lets a new user join an existing room', async () => {
    const create = await request(app)
      .post('/api/rooms')
      .send({ roomName: 'Test Room', nickname: 'Alice' });

    const res = await request(app)
      .post(`/api/rooms/${create.body.code}/join`)
      .send({ nickname: 'Bob' });

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ nickname: 'Bob', code: create.body.code });
  });

  it('returns the same token when the same nickname re-joins', async () => {
    const create = await request(app)
      .post('/api/rooms')
      .send({ roomName: 'Test Room', nickname: 'Alice' });

    const res = await request(app)
      .post(`/api/rooms/${create.body.code}/join`)
      .send({ nickname: 'Alice' });

    expect(res.status).toBe(200);
    expect(res.body.token).toBe(create.body.token);
  });

  it('returns 404 for an unknown room code', async () => {
    const res = await request(app)
      .post('/api/rooms/XXXXXX/join')
      .send({ nickname: 'Bob' });
    expect(res.status).toBe(404);
  });
});

describe('GET /api/rooms/:code', () => {
  it('returns room info and members when authenticated', async () => {
    const create = await request(app)
      .post('/api/rooms')
      .send({ roomName: 'Test Room', nickname: 'Alice' });
    const { code, token } = create.body;

    const res = await request(app)
      .get(`/api/rooms/${code}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.room.code).toBe(code);
    expect(res.body.members).toHaveLength(1);
    expect(res.body.members[0].nickname).toBe('Alice');
  });

  it('returns 401 without auth', async () => {
    const create = await request(app)
      .post('/api/rooms')
      .send({ roomName: 'Test Room', nickname: 'Alice' });

    const res = await request(app).get(`/api/rooms/${create.body.code}`);
    expect(res.status).toBe(401);
  });
});
