// Seeds all 64 FIFA World Cup 2022 (Qatar) matches with real results
// Usage: npm run seed:2022
import db from './db/database';

interface Match2022 {
  date: string;
  home: [string, string];
  away: [string, string];
  homeScore: number;
  awayScore: number;
  stage: string;
  group?: string;
  day?: number;
}

const matches: Match2022[] = [
  // ── Group Stage ─────────────────────────────────────────────────────────────
  // Group A
  { date: '2022-11-20T16:00:00Z', home: ['Katar',       'QAT'], away: ['Ecuador',      'ECU'], homeScore: 0, awayScore: 2, stage: 'GROUP_STAGE', group: 'A', day: 1 },
  { date: '2022-11-25T10:00:00Z', home: ['Katar',       'QAT'], away: ['Senegal',       'SEN'], homeScore: 1, awayScore: 3, stage: 'GROUP_STAGE', group: 'A', day: 2 },
  { date: '2022-11-25T13:00:00Z', home: ['Niederlande', 'NED'], away: ['Ecuador',       'ECU'], homeScore: 1, awayScore: 1, stage: 'GROUP_STAGE', group: 'A', day: 2 },
  { date: '2022-11-21T13:00:00Z', home: ['Senegal',     'SEN'], away: ['Niederlande',   'NED'], homeScore: 0, awayScore: 2, stage: 'GROUP_STAGE', group: 'A', day: 1 },
  { date: '2022-11-29T15:00:00Z', home: ['Niederlande', 'NED'], away: ['Katar',         'QAT'], homeScore: 2, awayScore: 0, stage: 'GROUP_STAGE', group: 'A', day: 3 },
  { date: '2022-11-29T15:00:00Z', home: ['Ecuador',     'ECU'], away: ['Senegal',       'SEN'], homeScore: 1, awayScore: 2, stage: 'GROUP_STAGE', group: 'A', day: 3 },

  // Group B
  { date: '2022-11-21T16:00:00Z', home: ['England',     'ENG'], away: ['Iran',          'IRN'], homeScore: 6, awayScore: 2, stage: 'GROUP_STAGE', group: 'B', day: 1 },
  { date: '2022-11-21T19:00:00Z', home: ['USA',         'USA'], away: ['Wales',         'WAL'], homeScore: 1, awayScore: 1, stage: 'GROUP_STAGE', group: 'B', day: 1 },
  { date: '2022-11-25T16:00:00Z', home: ['Wales',       'WAL'], away: ['Iran',          'IRN'], homeScore: 0, awayScore: 2, stage: 'GROUP_STAGE', group: 'B', day: 2 },
  { date: '2022-11-25T19:00:00Z', home: ['England',     'ENG'], away: ['USA',           'USA'], homeScore: 0, awayScore: 0, stage: 'GROUP_STAGE', group: 'B', day: 2 },
  { date: '2022-11-29T19:00:00Z', home: ['Wales',       'WAL'], away: ['England',       'ENG'], homeScore: 0, awayScore: 3, stage: 'GROUP_STAGE', group: 'B', day: 3 },
  { date: '2022-11-29T19:00:00Z', home: ['Iran',        'IRN'], away: ['USA',           'USA'], homeScore: 0, awayScore: 1, stage: 'GROUP_STAGE', group: 'B', day: 3 },

  // Group C
  { date: '2022-11-22T13:00:00Z', home: ['Argentinien', 'ARG'], away: ['Saudi-Arabien', 'KSA'], homeScore: 1, awayScore: 2, stage: 'GROUP_STAGE', group: 'C', day: 1 },
  { date: '2022-11-22T16:00:00Z', home: ['Mexiko',      'MEX'], away: ['Polen',         'POL'], homeScore: 0, awayScore: 0, stage: 'GROUP_STAGE', group: 'C', day: 1 },
  { date: '2022-11-26T19:00:00Z', home: ['Polen',       'POL'], away: ['Saudi-Arabien', 'KSA'], homeScore: 2, awayScore: 0, stage: 'GROUP_STAGE', group: 'C', day: 2 },
  { date: '2022-11-26T22:00:00Z', home: ['Argentinien', 'ARG'], away: ['Mexiko',        'MEX'], homeScore: 2, awayScore: 0, stage: 'GROUP_STAGE', group: 'C', day: 2 },
  { date: '2022-11-30T19:00:00Z', home: ['Polen',       'POL'], away: ['Argentinien',   'ARG'], homeScore: 0, awayScore: 2, stage: 'GROUP_STAGE', group: 'C', day: 3 },
  { date: '2022-11-30T19:00:00Z', home: ['Saudi-Arabien','KSA'], away: ['Mexiko',       'MEX'], homeScore: 1, awayScore: 2, stage: 'GROUP_STAGE', group: 'C', day: 3 },

  // Group D
  { date: '2022-11-22T10:00:00Z', home: ['Dänemark',    'DEN'], away: ['Tunesien',      'TUN'], homeScore: 0, awayScore: 0, stage: 'GROUP_STAGE', group: 'D', day: 1 },
  { date: '2022-11-22T19:00:00Z', home: ['Frankreich',  'FRA'], away: ['Australien',    'AUS'], homeScore: 4, awayScore: 1, stage: 'GROUP_STAGE', group: 'D', day: 1 },
  { date: '2022-11-26T10:00:00Z', home: ['Tunesien',    'TUN'], away: ['Australien',    'AUS'], homeScore: 0, awayScore: 1, stage: 'GROUP_STAGE', group: 'D', day: 2 },
  { date: '2022-11-26T16:00:00Z', home: ['Frankreich',  'FRA'], away: ['Dänemark',      'DEN'], homeScore: 2, awayScore: 1, stage: 'GROUP_STAGE', group: 'D', day: 2 },
  { date: '2022-11-30T15:00:00Z', home: ['Tunesien',    'TUN'], away: ['Frankreich',    'FRA'], homeScore: 1, awayScore: 0, stage: 'GROUP_STAGE', group: 'D', day: 3 },
  { date: '2022-11-30T15:00:00Z', home: ['Australien',  'AUS'], away: ['Dänemark',      'DEN'], homeScore: 1, awayScore: 0, stage: 'GROUP_STAGE', group: 'D', day: 3 },

  // Group E
  { date: '2022-11-23T13:00:00Z', home: ['Deutschland', 'GER'], away: ['Japan',         'JPN'], homeScore: 1, awayScore: 2, stage: 'GROUP_STAGE', group: 'E', day: 1 },
  { date: '2022-11-23T16:00:00Z', home: ['Spanien',     'ESP'], away: ['Costa Rica',    'CRC'], homeScore: 7, awayScore: 0, stage: 'GROUP_STAGE', group: 'E', day: 1 },
  { date: '2022-11-27T10:00:00Z', home: ['Japan',       'JPN'], away: ['Costa Rica',    'CRC'], homeScore: 0, awayScore: 1, stage: 'GROUP_STAGE', group: 'E', day: 2 },
  { date: '2022-11-27T19:00:00Z', home: ['Spanien',     'ESP'], away: ['Deutschland',   'GER'], homeScore: 1, awayScore: 1, stage: 'GROUP_STAGE', group: 'E', day: 2 },
  { date: '2022-12-01T19:00:00Z', home: ['Japan',       'JPN'], away: ['Spanien',       'ESP'], homeScore: 2, awayScore: 1, stage: 'GROUP_STAGE', group: 'E', day: 3 },
  { date: '2022-12-01T19:00:00Z', home: ['Costa Rica',  'CRC'], away: ['Deutschland',   'GER'], homeScore: 2, awayScore: 4, stage: 'GROUP_STAGE', group: 'E', day: 3 },

  // Group F
  { date: '2022-11-23T10:00:00Z', home: ['Marokko',     'MAR'], away: ['Kroatien',      'CRO'], homeScore: 0, awayScore: 0, stage: 'GROUP_STAGE', group: 'F', day: 1 },
  { date: '2022-11-23T19:00:00Z', home: ['Belgien',     'BEL'], away: ['Kanada',        'CAN'], homeScore: 1, awayScore: 0, stage: 'GROUP_STAGE', group: 'F', day: 1 },
  { date: '2022-11-27T13:00:00Z', home: ['Belgien',     'BEL'], away: ['Marokko',       'MAR'], homeScore: 0, awayScore: 2, stage: 'GROUP_STAGE', group: 'F', day: 2 },
  { date: '2022-11-27T16:00:00Z', home: ['Kroatien',    'CRO'], away: ['Kanada',        'CAN'], homeScore: 4, awayScore: 1, stage: 'GROUP_STAGE', group: 'F', day: 2 },
  { date: '2022-12-01T15:00:00Z', home: ['Kroatien',    'CRO'], away: ['Belgien',       'BEL'], homeScore: 0, awayScore: 0, stage: 'GROUP_STAGE', group: 'F', day: 3 },
  { date: '2022-12-01T15:00:00Z', home: ['Marokko',     'MAR'], away: ['Kanada',        'CAN'], homeScore: 2, awayScore: 1, stage: 'GROUP_STAGE', group: 'F', day: 3 },

  // Group G
  { date: '2022-11-24T13:00:00Z', home: ['Schweiz',     'SUI'], away: ['Kamerun',       'CMR'], homeScore: 1, awayScore: 0, stage: 'GROUP_STAGE', group: 'G', day: 1 },
  { date: '2022-11-24T19:00:00Z', home: ['Brasilien',   'BRA'], away: ['Serbien',       'SRB'], homeScore: 2, awayScore: 0, stage: 'GROUP_STAGE', group: 'G', day: 1 },
  { date: '2022-11-28T13:00:00Z', home: ['Kamerun',     'CMR'], away: ['Serbien',       'SRB'], homeScore: 3, awayScore: 3, stage: 'GROUP_STAGE', group: 'G', day: 2 },
  { date: '2022-11-28T19:00:00Z', home: ['Brasilien',   'BRA'], away: ['Schweiz',       'SUI'], homeScore: 1, awayScore: 0, stage: 'GROUP_STAGE', group: 'G', day: 2 },
  { date: '2022-12-02T19:00:00Z', home: ['Kamerun',     'CMR'], away: ['Brasilien',     'BRA'], homeScore: 1, awayScore: 0, stage: 'GROUP_STAGE', group: 'G', day: 3 },
  { date: '2022-12-02T19:00:00Z', home: ['Serbien',     'SRB'], away: ['Schweiz',       'SUI'], homeScore: 2, awayScore: 3, stage: 'GROUP_STAGE', group: 'G', day: 3 },

  // Group H
  { date: '2022-11-24T10:00:00Z', home: ['Uruguay',     'URU'], away: ['Südkorea',      'KOR'], homeScore: 0, awayScore: 0, stage: 'GROUP_STAGE', group: 'H', day: 1 },
  { date: '2022-11-24T16:00:00Z', home: ['Portugal',    'POR'], away: ['Ghana',         'GHA'], homeScore: 3, awayScore: 2, stage: 'GROUP_STAGE', group: 'H', day: 1 },
  { date: '2022-11-28T10:00:00Z', home: ['Südkorea',    'KOR'], away: ['Ghana',         'GHA'], homeScore: 2, awayScore: 3, stage: 'GROUP_STAGE', group: 'H', day: 2 },
  { date: '2022-11-28T16:00:00Z', home: ['Portugal',    'POR'], away: ['Uruguay',       'URU'], homeScore: 2, awayScore: 0, stage: 'GROUP_STAGE', group: 'H', day: 2 },
  { date: '2022-12-02T15:00:00Z', home: ['Südkorea',    'KOR'], away: ['Portugal',      'POR'], homeScore: 2, awayScore: 1, stage: 'GROUP_STAGE', group: 'H', day: 3 },
  { date: '2022-12-02T15:00:00Z', home: ['Ghana',       'GHA'], away: ['Uruguay',       'URU'], homeScore: 0, awayScore: 2, stage: 'GROUP_STAGE', group: 'H', day: 3 },

  // ── Round of 16 ─────────────────────────────────────────────────────────────
  { date: '2022-12-03T15:00:00Z', home: ['Niederlande', 'NED'], away: ['USA',           'USA'], homeScore: 3, awayScore: 1, stage: 'LAST_16' },
  { date: '2022-12-03T19:00:00Z', home: ['Argentinien', 'ARG'], away: ['Australien',    'AUS'], homeScore: 2, awayScore: 1, stage: 'LAST_16' },
  { date: '2022-12-04T15:00:00Z', home: ['Frankreich',  'FRA'], away: ['Polen',         'POL'], homeScore: 3, awayScore: 1, stage: 'LAST_16' },
  { date: '2022-12-04T19:00:00Z', home: ['England',     'ENG'], away: ['Senegal',       'SEN'], homeScore: 3, awayScore: 0, stage: 'LAST_16' },
  // AET scores used for pen shootout games
  { date: '2022-12-05T15:00:00Z', home: ['Japan',       'JPN'], away: ['Kroatien',      'CRO'], homeScore: 1, awayScore: 1, stage: 'LAST_16' },
  { date: '2022-12-05T19:00:00Z', home: ['Brasilien',   'BRA'], away: ['Südkorea',      'KOR'], homeScore: 4, awayScore: 1, stage: 'LAST_16' },
  { date: '2022-12-06T15:00:00Z', home: ['Marokko',     'MAR'], away: ['Spanien',       'ESP'], homeScore: 0, awayScore: 0, stage: 'LAST_16' },
  { date: '2022-12-06T19:00:00Z', home: ['Portugal',    'POR'], away: ['Schweiz',       'SUI'], homeScore: 6, awayScore: 1, stage: 'LAST_16' },

  // ── Quarter-finals ──────────────────────────────────────────────────────────
  { date: '2022-12-09T15:00:00Z', home: ['Kroatien',    'CRO'], away: ['Brasilien',     'BRA'], homeScore: 1, awayScore: 1, stage: 'QUARTER_FINALS' },
  { date: '2022-12-09T19:00:00Z', home: ['Niederlande', 'NED'], away: ['Argentinien',   'ARG'], homeScore: 2, awayScore: 2, stage: 'QUARTER_FINALS' },
  { date: '2022-12-10T15:00:00Z', home: ['Marokko',     'MAR'], away: ['Portugal',      'POR'], homeScore: 1, awayScore: 0, stage: 'QUARTER_FINALS' },
  { date: '2022-12-10T19:00:00Z', home: ['Frankreich',  'FRA'], away: ['England',       'ENG'], homeScore: 2, awayScore: 1, stage: 'QUARTER_FINALS' },

  // ── Semi-finals ─────────────────────────────────────────────────────────────
  { date: '2022-12-13T19:00:00Z', home: ['Argentinien', 'ARG'], away: ['Kroatien',      'CRO'], homeScore: 3, awayScore: 0, stage: 'SEMI_FINALS' },
  { date: '2022-12-14T19:00:00Z', home: ['Frankreich',  'FRA'], away: ['Marokko',       'MAR'], homeScore: 2, awayScore: 0, stage: 'SEMI_FINALS' },

  // ── Third place ─────────────────────────────────────────────────────────────
  { date: '2022-12-17T15:00:00Z', home: ['Kroatien',    'CRO'], away: ['Marokko',       'MAR'], homeScore: 2, awayScore: 1, stage: 'THIRD_PLACE' },

  // ── Final ───────────────────────────────────────────────────────────────────
  // AET score: 3-3, Argentina wins 4-2 on penalties
  { date: '2022-12-18T15:00:00Z', home: ['Argentinien', 'ARG'], away: ['Frankreich',    'FRA'], homeScore: 3, awayScore: 3, stage: 'FINAL' },
];

db.exec("DELETE FROM predictions WHERE match_id IN (SELECT id FROM matches WHERE tournament = '2022')");
db.exec("DELETE FROM matches WHERE tournament = '2022'");

const penaltyWinners: Record<string, string> = {
  'Japan-Kroatien':            'Kroatien',
  'Marokko-Spanien':           'Marokko',
  'Kroatien-Brasilien':        'Kroatien',
  'Niederlande-Argentinien':   'Argentinien',
  'Argentinien-Frankreich':    'Argentinien',
};

const insert = db.prepare(`
  INSERT INTO matches
    (stage, group_name, match_day, home_team, away_team, home_team_short, away_team_short,
     match_time, home_score, away_score, status, tournament, winner_team)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'FINISHED', '2022', ?)
`);

db.exec('BEGIN');
for (const m of matches) {
  const key = `${m.home[0]}-${m.away[0]}`;
  const winner = penaltyWinners[key] ?? null;
  insert.run(
    m.stage,
    m.group ? `GROUP_${m.group}` : null,
    m.day ?? null,
    m.home[0], m.away[0],
    m.home[1], m.away[1],
    m.date,
    m.homeScore, m.awayScore,
    winner,
  );
}
db.exec('COMMIT');

console.log(`Seeded ${matches.length} WC 2022 matches (all FINISHED with real scores).`);
