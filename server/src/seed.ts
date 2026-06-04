// Seeds the real 2026 FIFA World Cup group stage schedule (72 matches)
// Source: ESPN / NBC Sports / Fox Sports official schedules
// Times converted from ET (UTC-4) to UTC
// Usage: npm run seed
import db from './db/database';

type Team = [string, string]; // [name_zh, short_code]

interface MatchEntry {
  date: string;      // ISO UTC
  home: Team;
  away: Team;
  group: string;
  day: number;
}

const matches: MatchEntry[] = [
  // ── Matchday 1 ─────────────────────────────────────────────────────────────
  { date: '2026-06-11T19:00:00Z', home: ['墨西哥',        'MEX'], away: ['南非',          'RSA'], group: 'A', day: 1 },
  { date: '2026-06-12T02:00:00Z', home: ['韩国',          'KOR'], away: ['捷克',          'CZE'], group: 'A', day: 1 },
  { date: '2026-06-12T19:00:00Z', home: ['加拿大',        'CAN'], away: ['波黑',          'BIH'], group: 'B', day: 1 },
  { date: '2026-06-13T01:00:00Z', home: ['美国',          'USA'], away: ['巴拉圭',        'PAR'], group: 'D', day: 1 },
  { date: '2026-06-13T19:00:00Z', home: ['卡塔尔',        'QAT'], away: ['瑞士',          'SUI'], group: 'B', day: 1 },
  { date: '2026-06-13T22:00:00Z', home: ['巴西',          'BRA'], away: ['摩洛哥',        'MAR'], group: 'C', day: 1 },
  { date: '2026-06-14T01:00:00Z', home: ['海地',          'HAI'], away: ['苏格兰',        'SCO'], group: 'C', day: 1 },
  { date: '2026-06-14T04:00:00Z', home: ['澳大利亚',      'AUS'], away: ['土耳其',        'TUR'], group: 'D', day: 1 },
  { date: '2026-06-14T17:00:00Z', home: ['德国',          'GER'], away: ['库拉索',        'CUW'], group: 'E', day: 1 },
  { date: '2026-06-14T20:00:00Z', home: ['荷兰',          'NED'], away: ['日本',          'JPN'], group: 'F', day: 1 },
  { date: '2026-06-14T23:00:00Z', home: ['科特迪瓦',      'CIV'], away: ['厄瓜多尔',      'ECU'], group: 'E', day: 1 },
  { date: '2026-06-15T02:00:00Z', home: ['瑞典',          'SWE'], away: ['突尼斯',        'TUN'], group: 'F', day: 1 },
  { date: '2026-06-15T17:00:00Z', home: ['西班牙',        'ESP'], away: ['佛得角',        'CPV'], group: 'H', day: 1 },
  { date: '2026-06-15T22:00:00Z', home: ['比利时',        'BEL'], away: ['埃及',          'EGY'], group: 'G', day: 1 },
  { date: '2026-06-15T22:00:00Z', home: ['沙特阿拉伯',    'KSA'], away: ['乌拉圭',        'URU'], group: 'H', day: 1 },
  { date: '2026-06-16T04:00:00Z', home: ['伊朗',          'IRN'], away: ['新西兰',        'NZL'], group: 'G', day: 1 },
  { date: '2026-06-16T19:00:00Z', home: ['法国',          'FRA'], away: ['塞内加尔',      'SEN'], group: 'I', day: 1 },
  { date: '2026-06-16T22:00:00Z', home: ['伊拉克',        'IRQ'], away: ['挪威',          'NOR'], group: 'I', day: 1 },
  { date: '2026-06-17T01:00:00Z', home: ['阿根廷',        'ARG'], away: ['阿尔及利亚',    'ALG'], group: 'J', day: 1 },
  { date: '2026-06-17T04:00:00Z', home: ['奥地利',        'AUT'], away: ['约旦',          'JOR'], group: 'J', day: 1 },
  { date: '2026-06-17T17:00:00Z', home: ['葡萄牙',        'POR'], away: ['刚果（金）',    'COD'], group: 'K', day: 1 },
  { date: '2026-06-17T20:00:00Z', home: ['英格兰',        'ENG'], away: ['克罗地亚',      'CRO'], group: 'L', day: 1 },
  { date: '2026-06-17T23:00:00Z', home: ['加纳',          'GHA'], away: ['巴拿马',        'PAN'], group: 'L', day: 1 },
  { date: '2026-06-18T02:00:00Z', home: ['乌兹别克斯坦',  'UZB'], away: ['哥伦比亚',      'COL'], group: 'K', day: 1 },

  // ── Matchday 2 ─────────────────────────────────────────────────────────────
  { date: '2026-06-18T16:00:00Z', home: ['捷克',          'CZE'], away: ['南非',          'RSA'], group: 'A', day: 2 },
  { date: '2026-06-18T19:00:00Z', home: ['瑞士',          'SUI'], away: ['波黑',          'BIH'], group: 'B', day: 2 },
  { date: '2026-06-18T22:00:00Z', home: ['加拿大',        'CAN'], away: ['卡塔尔',        'QAT'], group: 'B', day: 2 },
  { date: '2026-06-19T03:00:00Z', home: ['墨西哥',        'MEX'], away: ['韩国',          'KOR'], group: 'A', day: 2 },
  { date: '2026-06-19T19:00:00Z', home: ['美国',          'USA'], away: ['澳大利亚',      'AUS'], group: 'D', day: 2 },
  { date: '2026-06-19T22:00:00Z', home: ['苏格兰',        'SCO'], away: ['摩洛哥',        'MAR'], group: 'C', day: 2 },
  { date: '2026-06-20T01:00:00Z', home: ['巴西',          'BRA'], away: ['海地',          'HAI'], group: 'C', day: 2 },
  { date: '2026-06-20T04:00:00Z', home: ['土耳其',        'TUR'], away: ['巴拉圭',        'PAR'], group: 'D', day: 2 },
  { date: '2026-06-20T17:00:00Z', home: ['荷兰',          'NED'], away: ['瑞典',          'SWE'], group: 'F', day: 2 },
  { date: '2026-06-20T20:00:00Z', home: ['德国',          'GER'], away: ['科特迪瓦',      'CIV'], group: 'E', day: 2 },
  { date: '2026-06-21T00:00:00Z', home: ['厄瓜多尔',      'ECU'], away: ['库拉索',        'CUW'], group: 'E', day: 2 },
  { date: '2026-06-21T04:00:00Z', home: ['突尼斯',        'TUN'], away: ['日本',          'JPN'], group: 'F', day: 2 },
  { date: '2026-06-21T16:00:00Z', home: ['西班牙',        'ESP'], away: ['沙特阿拉伯',    'KSA'], group: 'H', day: 2 },
  { date: '2026-06-21T19:00:00Z', home: ['比利时',        'BEL'], away: ['伊朗',          'IRN'], group: 'G', day: 2 },
  { date: '2026-06-21T22:00:00Z', home: ['乌拉圭',        'URU'], away: ['佛得角',        'CPV'], group: 'H', day: 2 },
  { date: '2026-06-22T01:00:00Z', home: ['新西兰',        'NZL'], away: ['埃及',          'EGY'], group: 'G', day: 2 },
  { date: '2026-06-22T17:00:00Z', home: ['阿根廷',        'ARG'], away: ['奥地利',        'AUT'], group: 'J', day: 2 },
  { date: '2026-06-22T21:00:00Z', home: ['法国',          'FRA'], away: ['伊拉克',        'IRQ'], group: 'I', day: 2 },
  { date: '2026-06-23T00:00:00Z', home: ['挪威',          'NOR'], away: ['塞内加尔',      'SEN'], group: 'I', day: 2 },
  { date: '2026-06-23T03:00:00Z', home: ['约旦',          'JOR'], away: ['阿尔及利亚',    'ALG'], group: 'J', day: 2 },
  { date: '2026-06-23T17:00:00Z', home: ['葡萄牙',        'POR'], away: ['乌兹别克斯坦',  'UZB'], group: 'K', day: 2 },
  { date: '2026-06-23T20:00:00Z', home: ['英格兰',        'ENG'], away: ['加纳',          'GHA'], group: 'L', day: 2 },
  { date: '2026-06-23T23:00:00Z', home: ['巴拿马',        'PAN'], away: ['克罗地亚',      'CRO'], group: 'L', day: 2 },
  { date: '2026-06-24T02:00:00Z', home: ['哥伦比亚',      'COL'], away: ['刚果（金）',    'COD'], group: 'K', day: 2 },

  // ── Matchday 3 (simultaneous group finales) ─────────────────────────────────
  { date: '2026-06-24T19:00:00Z', home: ['瑞士',          'SUI'], away: ['加拿大',        'CAN'], group: 'B', day: 3 },
  { date: '2026-06-24T19:00:00Z', home: ['波黑',          'BIH'], away: ['卡塔尔',        'QAT'], group: 'B', day: 3 },
  { date: '2026-06-24T22:00:00Z', home: ['苏格兰',        'SCO'], away: ['巴西',          'BRA'], group: 'C', day: 3 },
  { date: '2026-06-24T22:00:00Z', home: ['摩洛哥',        'MAR'], away: ['海地',          'HAI'], group: 'C', day: 3 },
  { date: '2026-06-25T01:00:00Z', home: ['捷克',          'CZE'], away: ['墨西哥',        'MEX'], group: 'A', day: 3 },
  { date: '2026-06-25T01:00:00Z', home: ['南非',          'RSA'], away: ['韩国',          'KOR'], group: 'A', day: 3 },
  { date: '2026-06-25T20:00:00Z', home: ['厄瓜多尔',      'ECU'], away: ['德国',          'GER'], group: 'E', day: 3 },
  { date: '2026-06-25T20:00:00Z', home: ['库拉索',        'CUW'], away: ['科特迪瓦',      'CIV'], group: 'E', day: 3 },
  { date: '2026-06-25T23:00:00Z', home: ['日本',          'JPN'], away: ['瑞典',          'SWE'], group: 'F', day: 3 },
  { date: '2026-06-25T23:00:00Z', home: ['突尼斯',        'TUN'], away: ['荷兰',          'NED'], group: 'F', day: 3 },
  { date: '2026-06-26T02:00:00Z', home: ['土耳其',        'TUR'], away: ['美国',          'USA'], group: 'D', day: 3 },
  { date: '2026-06-26T02:00:00Z', home: ['巴拉圭',        'PAR'], away: ['澳大利亚',      'AUS'], group: 'D', day: 3 },
  { date: '2026-06-26T19:00:00Z', home: ['挪威',          'NOR'], away: ['法国',          'FRA'], group: 'I', day: 3 },
  { date: '2026-06-26T19:00:00Z', home: ['塞内加尔',      'SEN'], away: ['伊拉克',        'IRQ'], group: 'I', day: 3 },
  { date: '2026-06-27T00:00:00Z', home: ['乌拉圭',        'URU'], away: ['西班牙',        'ESP'], group: 'H', day: 3 },
  { date: '2026-06-27T00:00:00Z', home: ['佛得角',        'CPV'], away: ['沙特阿拉伯',    'KSA'], group: 'H', day: 3 },
  { date: '2026-06-27T03:00:00Z', home: ['新西兰',        'NZL'], away: ['比利时',        'BEL'], group: 'G', day: 3 },
  { date: '2026-06-27T03:00:00Z', home: ['埃及',          'EGY'], away: ['伊朗',          'IRN'], group: 'G', day: 3 },
  { date: '2026-06-27T21:00:00Z', home: ['巴拿马',        'PAN'], away: ['英格兰',        'ENG'], group: 'L', day: 3 },
  { date: '2026-06-27T21:00:00Z', home: ['克罗地亚',      'CRO'], away: ['加纳',          'GHA'], group: 'L', day: 3 },
  { date: '2026-06-27T23:30:00Z', home: ['哥伦比亚',      'COL'], away: ['葡萄牙',        'POR'], group: 'K', day: 3 },
  { date: '2026-06-27T23:30:00Z', home: ['刚果（金）',    'COD'], away: ['乌兹别克斯坦',  'UZB'], group: 'K', day: 3 },
  { date: '2026-06-28T02:00:00Z', home: ['阿根廷',        'ARG'], away: ['约旦',          'JOR'], group: 'J', day: 3 },
  { date: '2026-06-28T02:00:00Z', home: ['阿尔及利亚',    'ALG'], away: ['奥地利',        'AUT'], group: 'J', day: 3 },
];

// Clear only 2026 data before reseeding
db.exec("DELETE FROM predictions WHERE match_id IN (SELECT id FROM matches WHERE tournament = '2026')");
db.exec("DELETE FROM matches WHERE tournament = '2026'");

const insert = db.prepare(`
  INSERT INTO matches (stage, group_name, match_day, home_team, away_team, home_team_short, away_team_short, match_time, status, tournament)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'SCHEDULED', '2026')
`);

db.exec('BEGIN');
for (const m of matches) {
  insert.run(
    'GROUP_STAGE',
    `GROUP_${m.group}`,
    m.day,
    m.home[0], m.away[0],
    m.home[1], m.away[1],
    m.date
  );
}
db.exec('COMMIT');

console.log(`Seeded ${matches.length} real WC 2026 group stage matches.`);
console.log('Groups: A–L · Matchdays: 1–3 · Jun 11 – Jul 2, 2026');
