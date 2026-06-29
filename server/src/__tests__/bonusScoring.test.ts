import { describe, it, expect, beforeEach } from 'vitest';
import './setup';
import db from '../db/database';
import { scoreBonusPicks } from '../services/scoring';

// Helpers to build a minimal room/user/champion-question scenario.
function makeRoom(tournament = '2026') {
  const room = db.prepare("INSERT INTO rooms (code, name, tournament) VALUES (?, ?, ?)")
    .run('TEST01', 'Test', tournament);
  const roomId = Number(room.lastInsertRowid);
  const user = db.prepare("INSERT INTO users (nickname, room_id, token) VALUES (?, ?, ?)")
    .run('alice', roomId, 'tok-' + Math.random());
  const userId = Number(user.lastInsertRowid);
  const q = db.prepare(
    "INSERT INTO bonus_questions (room_id, type, label, points_per_pick, max_picks) VALUES (?, 'CHAMPION', '世界杯冠军', 10, 1)"
  ).run(roomId);
  return { roomId, userId, questionId: Number(q.lastInsertRowid) };
}

describe('scoreBonusPicks', () => {
  beforeEach(() => {
    db.exec('DELETE FROM bonus_picks');
    db.exec('DELETE FROM bonus_questions');
    db.exec('DELETE FROM users');
    db.exec('DELETE FROM rooms');
    db.exec('DELETE FROM matches');
  });

  it('leaves picks unscored while the final is not finished', () => {
    const { userId, questionId } = makeRoom();
    db.prepare("INSERT INTO bonus_picks (user_id, question_id, team_name, points) VALUES (?, ?, '阿根廷', NULL)")
      .run(userId, questionId);

    scoreBonusPicks('2026');

    const pick = db.prepare('SELECT points FROM bonus_picks WHERE user_id = ?').get(userId) as any;
    expect(pick.points).toBeNull();
    const u = db.prepare('SELECT total_points FROM users WHERE id = ?').get(userId) as any;
    expect(u.total_points).toBe(0);
  });

  it('awards champion points once the final is finished, and 0 for a wrong pick', () => {
    const { userId, questionId } = makeRoom();
    db.prepare("INSERT INTO bonus_picks (user_id, question_id, team_name, points) VALUES (?, ?, '阿根廷', NULL)")
      .run(userId, questionId);
    // Argentina beats France in the final.
    db.prepare(`INSERT INTO matches (stage, home_team, away_team, match_time, home_score, away_score, status, tournament)
      VALUES ('FINAL', '阿根廷', '法国', '2026-07-19T19:00:00Z', 2, 0, 'FINISHED', '2026')`).run();

    scoreBonusPicks('2026');

    const win = db.prepare('SELECT points FROM bonus_picks WHERE user_id = ?').get(userId) as any;
    expect(win.points).toBe(10);
    const u = db.prepare('SELECT total_points FROM users WHERE id = ?').get(userId) as any;
    expect(u.total_points).toBe(10);

    // A different user who picked the loser gets 0.
    const loser = db.prepare("INSERT INTO users (nickname, room_id, token) VALUES (?, (SELECT id FROM rooms LIMIT 1), ?)")
      .run('bob', 'tok-bob');
    const loserId = Number(loser.lastInsertRowid);
    db.prepare("INSERT INTO bonus_picks (user_id, question_id, team_name, points) VALUES (?, ?, '法国', NULL)")
      .run(loserId, questionId);

    scoreBonusPicks('2026');

    const lose = db.prepare('SELECT points FROM bonus_picks WHERE user_id = ?').get(loserId) as any;
    expect(lose.points).toBe(0);
  });
});
