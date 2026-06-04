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
  { date: '2022-11-20T16:00:00Z', home: ['卡塔尔',     'QAT'], away: ['厄瓜多尔',    'ECU'], homeScore: 0, awayScore: 2, stage: 'GROUP_STAGE', group: 'A', day: 1 },
  { date: '2022-11-25T10:00:00Z', home: ['卡塔尔',     'QAT'], away: ['塞内加尔',    'SEN'], homeScore: 1, awayScore: 3, stage: 'GROUP_STAGE', group: 'A', day: 2 },
  { date: '2022-11-25T13:00:00Z', home: ['荷兰',       'NED'], away: ['厄瓜多尔',    'ECU'], homeScore: 1, awayScore: 1, stage: 'GROUP_STAGE', group: 'A', day: 2 },
  { date: '2022-11-21T13:00:00Z', home: ['塞内加尔',   'SEN'], away: ['荷兰',        'NED'], homeScore: 0, awayScore: 2, stage: 'GROUP_STAGE', group: 'A', day: 1 },
  { date: '2022-11-29T15:00:00Z', home: ['荷兰',       'NED'], away: ['卡塔尔',      'QAT'], homeScore: 2, awayScore: 0, stage: 'GROUP_STAGE', group: 'A', day: 3 },
  { date: '2022-11-29T15:00:00Z', home: ['厄瓜多尔',   'ECU'], away: ['塞内加尔',    'SEN'], homeScore: 1, awayScore: 2, stage: 'GROUP_STAGE', group: 'A', day: 3 },

  // Group B
  { date: '2022-11-21T16:00:00Z', home: ['英格兰',     'ENG'], away: ['伊朗',        'IRN'], homeScore: 6, awayScore: 2, stage: 'GROUP_STAGE', group: 'B', day: 1 },
  { date: '2022-11-21T19:00:00Z', home: ['美国',       'USA'], away: ['威尔士',      'WAL'], homeScore: 1, awayScore: 1, stage: 'GROUP_STAGE', group: 'B', day: 1 },
  { date: '2022-11-25T16:00:00Z', home: ['威尔士',     'WAL'], away: ['伊朗',        'IRN'], homeScore: 0, awayScore: 2, stage: 'GROUP_STAGE', group: 'B', day: 2 },
  { date: '2022-11-25T19:00:00Z', home: ['英格兰',     'ENG'], away: ['美国',        'USA'], homeScore: 0, awayScore: 0, stage: 'GROUP_STAGE', group: 'B', day: 2 },
  { date: '2022-11-29T19:00:00Z', home: ['威尔士',     'WAL'], away: ['英格兰',      'ENG'], homeScore: 0, awayScore: 3, stage: 'GROUP_STAGE', group: 'B', day: 3 },
  { date: '2022-11-29T19:00:00Z', home: ['伊朗',       'IRN'], away: ['美国',        'USA'], homeScore: 0, awayScore: 1, stage: 'GROUP_STAGE', group: 'B', day: 3 },

  // Group C
  { date: '2022-11-22T13:00:00Z', home: ['阿根廷',     'ARG'], away: ['沙特阿拉伯',  'KSA'], homeScore: 1, awayScore: 2, stage: 'GROUP_STAGE', group: 'C', day: 1 },
  { date: '2022-11-22T16:00:00Z', home: ['墨西哥',     'MEX'], away: ['波兰',        'POL'], homeScore: 0, awayScore: 0, stage: 'GROUP_STAGE', group: 'C', day: 1 },
  { date: '2022-11-26T19:00:00Z', home: ['波兰',       'POL'], away: ['沙特阿拉伯',  'KSA'], homeScore: 2, awayScore: 0, stage: 'GROUP_STAGE', group: 'C', day: 2 },
  { date: '2022-11-26T22:00:00Z', home: ['阿根廷',     'ARG'], away: ['墨西哥',      'MEX'], homeScore: 2, awayScore: 0, stage: 'GROUP_STAGE', group: 'C', day: 2 },
  { date: '2022-11-30T19:00:00Z', home: ['波兰',       'POL'], away: ['阿根廷',      'ARG'], homeScore: 0, awayScore: 2, stage: 'GROUP_STAGE', group: 'C', day: 3 },
  { date: '2022-11-30T19:00:00Z', home: ['沙特阿拉伯', 'KSA'], away: ['墨西哥',      'MEX'], homeScore: 1, awayScore: 2, stage: 'GROUP_STAGE', group: 'C', day: 3 },

  // Group D
  { date: '2022-11-22T10:00:00Z', home: ['丹麦',       'DEN'], away: ['突尼斯',      'TUN'], homeScore: 0, awayScore: 0, stage: 'GROUP_STAGE', group: 'D', day: 1 },
  { date: '2022-11-22T19:00:00Z', home: ['法国',       'FRA'], away: ['澳大利亚',    'AUS'], homeScore: 4, awayScore: 1, stage: 'GROUP_STAGE', group: 'D', day: 1 },
  { date: '2022-11-26T10:00:00Z', home: ['突尼斯',     'TUN'], away: ['澳大利亚',    'AUS'], homeScore: 0, awayScore: 1, stage: 'GROUP_STAGE', group: 'D', day: 2 },
  { date: '2022-11-26T16:00:00Z', home: ['法国',       'FRA'], away: ['丹麦',        'DEN'], homeScore: 2, awayScore: 1, stage: 'GROUP_STAGE', group: 'D', day: 2 },
  { date: '2022-11-30T15:00:00Z', home: ['突尼斯',     'TUN'], away: ['法国',        'FRA'], homeScore: 1, awayScore: 0, stage: 'GROUP_STAGE', group: 'D', day: 3 },
  { date: '2022-11-30T15:00:00Z', home: ['澳大利亚',   'AUS'], away: ['丹麦',        'DEN'], homeScore: 1, awayScore: 0, stage: 'GROUP_STAGE', group: 'D', day: 3 },

  // Group E
  { date: '2022-11-23T13:00:00Z', home: ['德国',       'GER'], away: ['日本',        'JPN'], homeScore: 1, awayScore: 2, stage: 'GROUP_STAGE', group: 'E', day: 1 },
  { date: '2022-11-23T16:00:00Z', home: ['西班牙',     'ESP'], away: ['哥斯达黎加',  'CRC'], homeScore: 7, awayScore: 0, stage: 'GROUP_STAGE', group: 'E', day: 1 },
  { date: '2022-11-27T10:00:00Z', home: ['日本',       'JPN'], away: ['哥斯达黎加',  'CRC'], homeScore: 0, awayScore: 1, stage: 'GROUP_STAGE', group: 'E', day: 2 },
  { date: '2022-11-27T19:00:00Z', home: ['西班牙',     'ESP'], away: ['德国',        'GER'], homeScore: 1, awayScore: 1, stage: 'GROUP_STAGE', group: 'E', day: 2 },
  { date: '2022-12-01T19:00:00Z', home: ['日本',       'JPN'], away: ['西班牙',      'ESP'], homeScore: 2, awayScore: 1, stage: 'GROUP_STAGE', group: 'E', day: 3 },
  { date: '2022-12-01T19:00:00Z', home: ['哥斯达黎加', 'CRC'], away: ['德国',        'GER'], homeScore: 2, awayScore: 4, stage: 'GROUP_STAGE', group: 'E', day: 3 },

  // Group F
  { date: '2022-11-23T10:00:00Z', home: ['摩洛哥',     'MAR'], away: ['克罗地亚',    'CRO'], homeScore: 0, awayScore: 0, stage: 'GROUP_STAGE', group: 'F', day: 1 },
  { date: '2022-11-23T19:00:00Z', home: ['比利时',     'BEL'], away: ['加拿大',      'CAN'], homeScore: 1, awayScore: 0, stage: 'GROUP_STAGE', group: 'F', day: 1 },
  { date: '2022-11-27T13:00:00Z', home: ['比利时',     'BEL'], away: ['摩洛哥',      'MAR'], homeScore: 0, awayScore: 2, stage: 'GROUP_STAGE', group: 'F', day: 2 },
  { date: '2022-11-27T16:00:00Z', home: ['克罗地亚',   'CRO'], away: ['加拿大',      'CAN'], homeScore: 4, awayScore: 1, stage: 'GROUP_STAGE', group: 'F', day: 2 },
  { date: '2022-12-01T15:00:00Z', home: ['克罗地亚',   'CRO'], away: ['比利时',      'BEL'], homeScore: 0, awayScore: 0, stage: 'GROUP_STAGE', group: 'F', day: 3 },
  { date: '2022-12-01T15:00:00Z', home: ['摩洛哥',     'MAR'], away: ['加拿大',      'CAN'], homeScore: 2, awayScore: 1, stage: 'GROUP_STAGE', group: 'F', day: 3 },

  // Group G
  { date: '2022-11-24T13:00:00Z', home: ['瑞士',       'SUI'], away: ['喀麦隆',      'CMR'], homeScore: 1, awayScore: 0, stage: 'GROUP_STAGE', group: 'G', day: 1 },
  { date: '2022-11-24T19:00:00Z', home: ['巴西',       'BRA'], away: ['塞尔维亚',    'SRB'], homeScore: 2, awayScore: 0, stage: 'GROUP_STAGE', group: 'G', day: 1 },
  { date: '2022-11-28T13:00:00Z', home: ['喀麦隆',     'CMR'], away: ['塞尔维亚',    'SRB'], homeScore: 3, awayScore: 3, stage: 'GROUP_STAGE', group: 'G', day: 2 },
  { date: '2022-11-28T19:00:00Z', home: ['巴西',       'BRA'], away: ['瑞士',        'SUI'], homeScore: 1, awayScore: 0, stage: 'GROUP_STAGE', group: 'G', day: 2 },
  { date: '2022-12-02T19:00:00Z', home: ['喀麦隆',     'CMR'], away: ['巴西',        'BRA'], homeScore: 1, awayScore: 0, stage: 'GROUP_STAGE', group: 'G', day: 3 },
  { date: '2022-12-02T19:00:00Z', home: ['塞尔维亚',   'SRB'], away: ['瑞士',        'SUI'], homeScore: 2, awayScore: 3, stage: 'GROUP_STAGE', group: 'G', day: 3 },

  // Group H
  { date: '2022-11-24T10:00:00Z', home: ['乌拉圭',     'URU'], away: ['韩国',        'KOR'], homeScore: 0, awayScore: 0, stage: 'GROUP_STAGE', group: 'H', day: 1 },
  { date: '2022-11-24T16:00:00Z', home: ['葡萄牙',     'POR'], away: ['加纳',        'GHA'], homeScore: 3, awayScore: 2, stage: 'GROUP_STAGE', group: 'H', day: 1 },
  { date: '2022-11-28T10:00:00Z', home: ['韩国',       'KOR'], away: ['加纳',        'GHA'], homeScore: 2, awayScore: 3, stage: 'GROUP_STAGE', group: 'H', day: 2 },
  { date: '2022-11-28T16:00:00Z', home: ['葡萄牙',     'POR'], away: ['乌拉圭',      'URU'], homeScore: 2, awayScore: 0, stage: 'GROUP_STAGE', group: 'H', day: 2 },
  { date: '2022-12-02T15:00:00Z', home: ['韩国',       'KOR'], away: ['葡萄牙',      'POR'], homeScore: 2, awayScore: 1, stage: 'GROUP_STAGE', group: 'H', day: 3 },
  { date: '2022-12-02T15:00:00Z', home: ['加纳',       'GHA'], away: ['乌拉圭',      'URU'], homeScore: 0, awayScore: 2, stage: 'GROUP_STAGE', group: 'H', day: 3 },

  // ── Round of 16 ─────────────────────────────────────────────────────────────
  { date: '2022-12-03T15:00:00Z', home: ['荷兰',       'NED'], away: ['美国',        'USA'], homeScore: 3, awayScore: 1, stage: 'LAST_16' },
  { date: '2022-12-03T19:00:00Z', home: ['阿根廷',     'ARG'], away: ['澳大利亚',    'AUS'], homeScore: 2, awayScore: 1, stage: 'LAST_16' },
  { date: '2022-12-04T15:00:00Z', home: ['法国',       'FRA'], away: ['波兰',        'POL'], homeScore: 3, awayScore: 1, stage: 'LAST_16' },
  { date: '2022-12-04T19:00:00Z', home: ['英格兰',     'ENG'], away: ['塞内加尔',    'SEN'], homeScore: 3, awayScore: 0, stage: 'LAST_16' },
  // AET scores used for pen shootout games
  { date: '2022-12-05T15:00:00Z', home: ['日本',       'JPN'], away: ['克罗地亚',    'CRO'], homeScore: 1, awayScore: 1, stage: 'LAST_16' },
  { date: '2022-12-05T19:00:00Z', home: ['巴西',       'BRA'], away: ['韩国',        'KOR'], homeScore: 4, awayScore: 1, stage: 'LAST_16' },
  { date: '2022-12-06T15:00:00Z', home: ['摩洛哥',     'MAR'], away: ['西班牙',      'ESP'], homeScore: 0, awayScore: 0, stage: 'LAST_16' },
  { date: '2022-12-06T19:00:00Z', home: ['葡萄牙',     'POR'], away: ['瑞士',        'SUI'], homeScore: 6, awayScore: 1, stage: 'LAST_16' },

  // ── Quarter-finals ──────────────────────────────────────────────────────────
  { date: '2022-12-09T15:00:00Z', home: ['克罗地亚',   'CRO'], away: ['巴西',        'BRA'], homeScore: 1, awayScore: 1, stage: 'QUARTER_FINALS' },
  { date: '2022-12-09T19:00:00Z', home: ['荷兰',       'NED'], away: ['阿根廷',      'ARG'], homeScore: 2, awayScore: 2, stage: 'QUARTER_FINALS' },
  { date: '2022-12-10T15:00:00Z', home: ['摩洛哥',     'MAR'], away: ['葡萄牙',      'POR'], homeScore: 1, awayScore: 0, stage: 'QUARTER_FINALS' },
  { date: '2022-12-10T19:00:00Z', home: ['法国',       'FRA'], away: ['英格兰',      'ENG'], homeScore: 2, awayScore: 1, stage: 'QUARTER_FINALS' },

  // ── Semi-finals ─────────────────────────────────────────────────────────────
  { date: '2022-12-13T19:00:00Z', home: ['阿根廷',     'ARG'], away: ['克罗地亚',    'CRO'], homeScore: 3, awayScore: 0, stage: 'SEMI_FINALS' },
  { date: '2022-12-14T19:00:00Z', home: ['法国',       'FRA'], away: ['摩洛哥',      'MAR'], homeScore: 2, awayScore: 0, stage: 'SEMI_FINALS' },

  // ── Third place ─────────────────────────────────────────────────────────────
  { date: '2022-12-17T15:00:00Z', home: ['克罗地亚',   'CRO'], away: ['摩洛哥',      'MAR'], homeScore: 2, awayScore: 1, stage: 'THIRD_PLACE' },

  // ── Final ───────────────────────────────────────────────────────────────────
  // AET score: 3-3, Argentina wins 4-2 on penalties
  { date: '2022-12-18T15:00:00Z', home: ['阿根廷',     'ARG'], away: ['法国',        'FRA'], homeScore: 3, awayScore: 3, stage: 'FINAL' },
];

db.exec("DELETE FROM predictions WHERE match_id IN (SELECT id FROM matches WHERE tournament = '2022')");
db.exec("DELETE FROM matches WHERE tournament = '2022'");

const penaltyWinners: Record<string, string> = {
  '日本-克罗地亚':   '克罗地亚',
  '摩洛哥-西班牙':   '摩洛哥',
  '克罗地亚-巴西':   '克罗地亚',
  '荷兰-阿根廷':     '阿根廷',
  '阿根廷-法国':     '阿根廷',
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
