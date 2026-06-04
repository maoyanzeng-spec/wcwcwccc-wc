import db from '../db/database';

const MATCHES_2026: { date: string; home: [string,string]; away: [string,string]; group: string; day: number }[] = [
  { date: '2026-06-11T19:00:00Z', home: ['墨西哥','MEX'], away: ['南非','RSA'], group:'A', day:1 },
  { date: '2026-06-12T02:00:00Z', home: ['韩国','KOR'], away: ['捷克','CZE'], group:'A', day:1 },
  { date: '2026-06-12T19:00:00Z', home: ['加拿大','CAN'], away: ['波黑','BIH'], group:'B', day:1 },
  { date: '2026-06-13T01:00:00Z', home: ['美国','USA'], away: ['巴拉圭','PAR'], group:'D', day:1 },
  { date: '2026-06-13T19:00:00Z', home: ['卡塔尔','QAT'], away: ['瑞士','SUI'], group:'B', day:1 },
  { date: '2026-06-13T22:00:00Z', home: ['巴西','BRA'], away: ['摩洛哥','MAR'], group:'C', day:1 },
  { date: '2026-06-14T01:00:00Z', home: ['海地','HAI'], away: ['苏格兰','SCO'], group:'C', day:1 },
  { date: '2026-06-14T04:00:00Z', home: ['澳大利亚','AUS'], away: ['土耳其','TUR'], group:'D', day:1 },
  { date: '2026-06-14T17:00:00Z', home: ['德国','GER'], away: ['库拉索','CUW'], group:'E', day:1 },
  { date: '2026-06-14T20:00:00Z', home: ['荷兰','NED'], away: ['日本','JPN'], group:'F', day:1 },
  { date: '2026-06-14T23:00:00Z', home: ['科特迪瓦','CIV'], away: ['厄瓜多尔','ECU'], group:'E', day:1 },
  { date: '2026-06-15T02:00:00Z', home: ['瑞典','SWE'], away: ['突尼斯','TUN'], group:'F', day:1 },
  { date: '2026-06-15T17:00:00Z', home: ['西班牙','ESP'], away: ['佛得角','CPV'], group:'H', day:1 },
  { date: '2026-06-15T22:00:00Z', home: ['比利时','BEL'], away: ['埃及','EGY'], group:'G', day:1 },
  { date: '2026-06-15T22:00:00Z', home: ['沙特阿拉伯','KSA'], away: ['乌拉圭','URU'], group:'H', day:1 },
  { date: '2026-06-16T04:00:00Z', home: ['伊朗','IRN'], away: ['新西兰','NZL'], group:'G', day:1 },
  { date: '2026-06-16T19:00:00Z', home: ['法国','FRA'], away: ['塞内加尔','SEN'], group:'I', day:1 },
  { date: '2026-06-16T22:00:00Z', home: ['伊拉克','IRQ'], away: ['挪威','NOR'], group:'I', day:1 },
  { date: '2026-06-17T01:00:00Z', home: ['阿根廷','ARG'], away: ['阿尔及利亚','ALG'], group:'J', day:1 },
  { date: '2026-06-17T04:00:00Z', home: ['奥地利','AUT'], away: ['约旦','JOR'], group:'J', day:1 },
  { date: '2026-06-17T17:00:00Z', home: ['葡萄牙','POR'], away: ['刚果（金）','COD'], group:'K', day:1 },
  { date: '2026-06-17T20:00:00Z', home: ['英格兰','ENG'], away: ['克罗地亚','CRO'], group:'L', day:1 },
  { date: '2026-06-17T23:00:00Z', home: ['加纳','GHA'], away: ['巴拿马','PAN'], group:'L', day:1 },
  { date: '2026-06-18T02:00:00Z', home: ['乌兹别克斯坦','UZB'], away: ['哥伦比亚','COL'], group:'K', day:1 },
  { date: '2026-06-18T16:00:00Z', home: ['捷克','CZE'], away: ['南非','RSA'], group:'A', day:2 },
  { date: '2026-06-18T19:00:00Z', home: ['瑞士','SUI'], away: ['波黑','BIH'], group:'B', day:2 },
  { date: '2026-06-18T22:00:00Z', home: ['加拿大','CAN'], away: ['卡塔尔','QAT'], group:'B', day:2 },
  { date: '2026-06-19T03:00:00Z', home: ['墨西哥','MEX'], away: ['韩国','KOR'], group:'A', day:2 },
  { date: '2026-06-19T19:00:00Z', home: ['美国','USA'], away: ['澳大利亚','AUS'], group:'D', day:2 },
  { date: '2026-06-19T22:00:00Z', home: ['苏格兰','SCO'], away: ['摩洛哥','MAR'], group:'C', day:2 },
  { date: '2026-06-20T01:00:00Z', home: ['巴西','BRA'], away: ['海地','HAI'], group:'C', day:2 },
  { date: '2026-06-20T04:00:00Z', home: ['土耳其','TUR'], away: ['巴拉圭','PAR'], group:'D', day:2 },
  { date: '2026-06-20T17:00:00Z', home: ['荷兰','NED'], away: ['瑞典','SWE'], group:'F', day:2 },
  { date: '2026-06-20T20:00:00Z', home: ['德国','GER'], away: ['科特迪瓦','CIV'], group:'E', day:2 },
  { date: '2026-06-21T00:00:00Z', home: ['厄瓜多尔','ECU'], away: ['库拉索','CUW'], group:'E', day:2 },
  { date: '2026-06-21T04:00:00Z', home: ['突尼斯','TUN'], away: ['日本','JPN'], group:'F', day:2 },
  { date: '2026-06-21T16:00:00Z', home: ['西班牙','ESP'], away: ['沙特阿拉伯','KSA'], group:'H', day:2 },
  { date: '2026-06-21T19:00:00Z', home: ['比利时','BEL'], away: ['伊朗','IRN'], group:'G', day:2 },
  { date: '2026-06-21T22:00:00Z', home: ['乌拉圭','URU'], away: ['佛得角','CPV'], group:'H', day:2 },
  { date: '2026-06-22T01:00:00Z', home: ['新西兰','NZL'], away: ['埃及','EGY'], group:'G', day:2 },
  { date: '2026-06-22T17:00:00Z', home: ['阿根廷','ARG'], away: ['奥地利','AUT'], group:'J', day:2 },
  { date: '2026-06-22T21:00:00Z', home: ['法国','FRA'], away: ['伊拉克','IRQ'], group:'I', day:2 },
  { date: '2026-06-23T00:00:00Z', home: ['挪威','NOR'], away: ['塞内加尔','SEN'], group:'I', day:2 },
  { date: '2026-06-23T03:00:00Z', home: ['约旦','JOR'], away: ['阿尔及利亚','ALG'], group:'J', day:2 },
  { date: '2026-06-23T17:00:00Z', home: ['葡萄牙','POR'], away: ['乌兹别克斯坦','UZB'], group:'K', day:2 },
  { date: '2026-06-23T20:00:00Z', home: ['英格兰','ENG'], away: ['加纳','GHA'], group:'L', day:2 },
  { date: '2026-06-23T23:00:00Z', home: ['巴拿马','PAN'], away: ['克罗地亚','CRO'], group:'L', day:2 },
  { date: '2026-06-24T02:00:00Z', home: ['哥伦比亚','COL'], away: ['刚果（金）','COD'], group:'K', day:2 },
  { date: '2026-06-24T19:00:00Z', home: ['瑞士','SUI'], away: ['加拿大','CAN'], group:'B', day:3 },
  { date: '2026-06-24T19:00:00Z', home: ['波黑','BIH'], away: ['卡塔尔','QAT'], group:'B', day:3 },
  { date: '2026-06-24T22:00:00Z', home: ['苏格兰','SCO'], away: ['巴西','BRA'], group:'C', day:3 },
  { date: '2026-06-24T22:00:00Z', home: ['摩洛哥','MAR'], away: ['海地','HAI'], group:'C', day:3 },
  { date: '2026-06-25T01:00:00Z', home: ['捷克','CZE'], away: ['墨西哥','MEX'], group:'A', day:3 },
  { date: '2026-06-25T01:00:00Z', home: ['南非','RSA'], away: ['韩国','KOR'], group:'A', day:3 },
  { date: '2026-06-25T20:00:00Z', home: ['厄瓜多尔','ECU'], away: ['德国','GER'], group:'E', day:3 },
  { date: '2026-06-25T20:00:00Z', home: ['库拉索','CUW'], away: ['科特迪瓦','CIV'], group:'E', day:3 },
  { date: '2026-06-25T23:00:00Z', home: ['日本','JPN'], away: ['瑞典','SWE'], group:'F', day:3 },
  { date: '2026-06-25T23:00:00Z', home: ['突尼斯','TUN'], away: ['荷兰','NED'], group:'F', day:3 },
  { date: '2026-06-26T02:00:00Z', home: ['土耳其','TUR'], away: ['美国','USA'], group:'D', day:3 },
  { date: '2026-06-26T02:00:00Z', home: ['巴拉圭','PAR'], away: ['澳大利亚','AUS'], group:'D', day:3 },
  { date: '2026-06-26T19:00:00Z', home: ['挪威','NOR'], away: ['法国','FRA'], group:'I', day:3 },
  { date: '2026-06-26T19:00:00Z', home: ['塞内加尔','SEN'], away: ['伊拉克','IRQ'], group:'I', day:3 },
  { date: '2026-06-27T00:00:00Z', home: ['乌拉圭','URU'], away: ['西班牙','ESP'], group:'H', day:3 },
  { date: '2026-06-27T00:00:00Z', home: ['佛得角','CPV'], away: ['沙特阿拉伯','KSA'], group:'H', day:3 },
  { date: '2026-06-27T03:00:00Z', home: ['新西兰','NZL'], away: ['比利时','BEL'], group:'G', day:3 },
  { date: '2026-06-27T03:00:00Z', home: ['埃及','EGY'], away: ['伊朗','IRN'], group:'G', day:3 },
  { date: '2026-06-27T21:00:00Z', home: ['巴拿马','PAN'], away: ['英格兰','ENG'], group:'L', day:3 },
  { date: '2026-06-27T21:00:00Z', home: ['克罗地亚','CRO'], away: ['加纳','GHA'], group:'L', day:3 },
  { date: '2026-06-27T23:30:00Z', home: ['哥伦比亚','COL'], away: ['葡萄牙','POR'], group:'K', day:3 },
  { date: '2026-06-27T23:30:00Z', home: ['刚果（金）','COD'], away: ['乌兹别克斯坦','UZB'], group:'K', day:3 },
  { date: '2026-06-28T02:00:00Z', home: ['阿根廷','ARG'], away: ['约旦','JOR'], group:'J', day:3 },
  { date: '2026-06-28T02:00:00Z', home: ['阿尔及利亚','ALG'], away: ['奥地利','AUT'], group:'J', day:3 },
];

// WM 2022 – all 64 matches with real scores, seeded as SCHEDULED so tips can always be submitted
const MATCHES_2022: { home:[string,string]; away:[string,string]; hs:number; as:number; stage:string; group?:string; day?:number; wt?:string }[] = [
  // Group A
  { home:['卡塔尔','QAT'],       away:['厄瓜多尔','ECU'],      hs:0,as:2, stage:'GROUP_STAGE', group:'A', day:1 },
  { home:['塞内加尔','SEN'],     away:['荷兰','NED'],           hs:0,as:2, stage:'GROUP_STAGE', group:'A', day:1 },
  { home:['卡塔尔','QAT'],       away:['塞内加尔','SEN'],       hs:1,as:3, stage:'GROUP_STAGE', group:'A', day:2 },
  { home:['荷兰','NED'],         away:['厄瓜多尔','ECU'],       hs:1,as:1, stage:'GROUP_STAGE', group:'A', day:2 },
  { home:['荷兰','NED'],         away:['卡塔尔','QAT'],         hs:2,as:0, stage:'GROUP_STAGE', group:'A', day:3 },
  { home:['厄瓜多尔','ECU'],     away:['塞内加尔','SEN'],       hs:1,as:2, stage:'GROUP_STAGE', group:'A', day:3 },
  // Group B
  { home:['英格兰','ENG'],       away:['伊朗','IRN'],           hs:6,as:2, stage:'GROUP_STAGE', group:'B', day:1 },
  { home:['美国','USA'],         away:['威尔士','WAL'],         hs:1,as:1, stage:'GROUP_STAGE', group:'B', day:1 },
  { home:['威尔士','WAL'],       away:['伊朗','IRN'],           hs:0,as:2, stage:'GROUP_STAGE', group:'B', day:2 },
  { home:['英格兰','ENG'],       away:['美国','USA'],           hs:0,as:0, stage:'GROUP_STAGE', group:'B', day:2 },
  { home:['威尔士','WAL'],       away:['英格兰','ENG'],         hs:0,as:3, stage:'GROUP_STAGE', group:'B', day:3 },
  { home:['伊朗','IRN'],         away:['美国','USA'],           hs:0,as:1, stage:'GROUP_STAGE', group:'B', day:3 },
  // Group C
  { home:['阿根廷','ARG'],       away:['沙特阿拉伯','KSA'],     hs:1,as:2, stage:'GROUP_STAGE', group:'C', day:1 },
  { home:['墨西哥','MEX'],       away:['波兰','POL'],           hs:0,as:0, stage:'GROUP_STAGE', group:'C', day:1 },
  { home:['波兰','POL'],         away:['沙特阿拉伯','KSA'],     hs:2,as:0, stage:'GROUP_STAGE', group:'C', day:2 },
  { home:['阿根廷','ARG'],       away:['墨西哥','MEX'],         hs:2,as:0, stage:'GROUP_STAGE', group:'C', day:2 },
  { home:['波兰','POL'],         away:['阿根廷','ARG'],         hs:0,as:2, stage:'GROUP_STAGE', group:'C', day:3 },
  { home:['沙特阿拉伯','KSA'],   away:['墨西哥','MEX'],         hs:1,as:2, stage:'GROUP_STAGE', group:'C', day:3 },
  // Group D
  { home:['丹麦','DEN'],         away:['突尼斯','TUN'],         hs:0,as:0, stage:'GROUP_STAGE', group:'D', day:1 },
  { home:['法国','FRA'],         away:['澳大利亚','AUS'],       hs:4,as:1, stage:'GROUP_STAGE', group:'D', day:1 },
  { home:['突尼斯','TUN'],       away:['澳大利亚','AUS'],       hs:0,as:1, stage:'GROUP_STAGE', group:'D', day:2 },
  { home:['法国','FRA'],         away:['丹麦','DEN'],           hs:2,as:1, stage:'GROUP_STAGE', group:'D', day:2 },
  { home:['突尼斯','TUN'],       away:['法国','FRA'],           hs:1,as:0, stage:'GROUP_STAGE', group:'D', day:3 },
  { home:['澳大利亚','AUS'],     away:['丹麦','DEN'],           hs:1,as:0, stage:'GROUP_STAGE', group:'D', day:3 },
  // Group E
  { home:['德国','GER'],         away:['日本','JPN'],           hs:1,as:2, stage:'GROUP_STAGE', group:'E', day:1 },
  { home:['西班牙','ESP'],       away:['哥斯达黎加','CRC'],     hs:7,as:0, stage:'GROUP_STAGE', group:'E', day:1 },
  { home:['日本','JPN'],         away:['哥斯达黎加','CRC'],     hs:0,as:1, stage:'GROUP_STAGE', group:'E', day:2 },
  { home:['西班牙','ESP'],       away:['德国','GER'],           hs:1,as:1, stage:'GROUP_STAGE', group:'E', day:2 },
  { home:['日本','JPN'],         away:['西班牙','ESP'],         hs:2,as:1, stage:'GROUP_STAGE', group:'E', day:3 },
  { home:['哥斯达黎加','CRC'],   away:['德国','GER'],           hs:2,as:4, stage:'GROUP_STAGE', group:'E', day:3 },
  // Group F
  { home:['摩洛哥','MAR'],       away:['克罗地亚','CRO'],       hs:0,as:0, stage:'GROUP_STAGE', group:'F', day:1 },
  { home:['比利时','BEL'],       away:['加拿大','CAN'],         hs:1,as:0, stage:'GROUP_STAGE', group:'F', day:1 },
  { home:['比利时','BEL'],       away:['摩洛哥','MAR'],         hs:0,as:2, stage:'GROUP_STAGE', group:'F', day:2 },
  { home:['克罗地亚','CRO'],     away:['加拿大','CAN'],         hs:4,as:1, stage:'GROUP_STAGE', group:'F', day:2 },
  { home:['克罗地亚','CRO'],     away:['比利时','BEL'],         hs:0,as:0, stage:'GROUP_STAGE', group:'F', day:3 },
  { home:['摩洛哥','MAR'],       away:['加拿大','CAN'],         hs:2,as:1, stage:'GROUP_STAGE', group:'F', day:3 },
  // Group G
  { home:['瑞士','SUI'],         away:['喀麦隆','CMR'],         hs:1,as:0, stage:'GROUP_STAGE', group:'G', day:1 },
  { home:['巴西','BRA'],         away:['塞尔维亚','SRB'],       hs:2,as:0, stage:'GROUP_STAGE', group:'G', day:1 },
  { home:['喀麦隆','CMR'],       away:['塞尔维亚','SRB'],       hs:3,as:3, stage:'GROUP_STAGE', group:'G', day:2 },
  { home:['巴西','BRA'],         away:['瑞士','SUI'],           hs:1,as:0, stage:'GROUP_STAGE', group:'G', day:2 },
  { home:['喀麦隆','CMR'],       away:['巴西','BRA'],           hs:1,as:0, stage:'GROUP_STAGE', group:'G', day:3 },
  { home:['塞尔维亚','SRB'],     away:['瑞士','SUI'],           hs:2,as:3, stage:'GROUP_STAGE', group:'G', day:3 },
  // Group H
  { home:['乌拉圭','URU'],       away:['韩国','KOR'],           hs:0,as:0, stage:'GROUP_STAGE', group:'H', day:1 },
  { home:['葡萄牙','POR'],       away:['加纳','GHA'],           hs:3,as:2, stage:'GROUP_STAGE', group:'H', day:1 },
  { home:['韩国','KOR'],         away:['加纳','GHA'],           hs:2,as:3, stage:'GROUP_STAGE', group:'H', day:2 },
  { home:['葡萄牙','POR'],       away:['乌拉圭','URU'],         hs:2,as:0, stage:'GROUP_STAGE', group:'H', day:2 },
  { home:['韩国','KOR'],         away:['葡萄牙','POR'],         hs:2,as:1, stage:'GROUP_STAGE', group:'H', day:3 },
  { home:['加纳','GHA'],         away:['乌拉圭','URU'],         hs:0,as:2, stage:'GROUP_STAGE', group:'H', day:3 },
  // Round of 16
  { home:['荷兰','NED'],         away:['美国','USA'],           hs:3,as:1, stage:'LAST_16' },
  { home:['阿根廷','ARG'],       away:['澳大利亚','AUS'],       hs:2,as:1, stage:'LAST_16' },
  { home:['法国','FRA'],         away:['波兰','POL'],           hs:3,as:1, stage:'LAST_16' },
  { home:['英格兰','ENG'],       away:['塞内加尔','SEN'],       hs:3,as:0, stage:'LAST_16' },
  { home:['日本','JPN'],         away:['克罗地亚','CRO'],       hs:1,as:1, stage:'LAST_16' },
  { home:['巴西','BRA'],         away:['韩国','KOR'],           hs:4,as:1, stage:'LAST_16' },
  { home:['摩洛哥','MAR'],       away:['西班牙','ESP'],         hs:0,as:0, stage:'LAST_16' },
  { home:['葡萄牙','POR'],       away:['瑞士','SUI'],           hs:6,as:1, stage:'LAST_16' },
  // Quarter-finals
  { home:['克罗地亚','CRO'],     away:['巴西','BRA'],           hs:1,as:1, stage:'QUARTER_FINALS' },
  { home:['荷兰','NED'],         away:['阿根廷','ARG'],         hs:2,as:2, stage:'QUARTER_FINALS' },
  { home:['摩洛哥','MAR'],       away:['葡萄牙','POR'],         hs:1,as:0, stage:'QUARTER_FINALS' },
  { home:['法国','FRA'],         away:['英格兰','ENG'],         hs:2,as:1, stage:'QUARTER_FINALS' },
  // Semi-finals
  { home:['阿根廷','ARG'],       away:['克罗地亚','CRO'],       hs:3,as:0, stage:'SEMI_FINALS' },
  { home:['法国','FRA'],         away:['摩洛哥','MAR'],         hs:2,as:0, stage:'SEMI_FINALS' },
  // Third place
  { home:['克罗地亚','CRO'],     away:['摩洛哥','MAR'],         hs:2,as:1, stage:'THIRD_PLACE' },
  // Final – AET 3-3, Argentina wins on penalties
  { home:['阿根廷','ARG'],       away:['法国','FRA'],           hs:3,as:3, stage:'FINAL', wt:'阿根廷' },
];

function seed2022(): void {
  const insert = db.prepare(`
    INSERT INTO matches
      (stage, group_name, match_day, home_team, away_team, home_team_short, away_team_short,
       match_time, home_score, away_score, winner_team, status, tournament)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'SCHEDULED', '2022')
  `);
  // Spread match times starting 1h from now, 30min apart — SCHEDULED so tips always open
  const base = Date.now() + 60 * 60 * 1000;
  db.exec('BEGIN');
  MATCHES_2022.forEach((m, i) => {
    const t = new Date(base + i * 30 * 60 * 1000).toISOString();
    insert.run(
      m.stage, m.group ? `GROUP_${m.group}` : null, m.day ?? null,
      m.home[0], m.away[0], m.home[1], m.away[1],
      t, m.hs, m.as, m.wt ?? null
    );
  });
  db.exec('COMMIT');
  console.log(`Seeded ${MATCHES_2022.length} WM 2022 matches (SCHEDULED + real scores).`);
}

function seed(): void {
  const insert = db.prepare(`
    INSERT INTO matches (stage, group_name, match_day, home_team, away_team, home_team_short, away_team_short, match_time, status, tournament)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'SCHEDULED', '2026')
  `);
  db.exec('BEGIN');
  for (const m of MATCHES_2026) {
    insert.run('GROUP_STAGE', `GROUP_${m.group}`, m.day, m.home[0], m.away[0], m.home[1], m.away[1], m.date);
  }
  db.exec('COMMIT');
  console.log(`Seeded ${MATCHES_2026.length} WM 2026 matches.`);
}

export function autoSeedIfEmpty(): void {
  const count = (db.prepare("SELECT COUNT(*) as c FROM matches WHERE tournament='2026'").get() as any).c;
  if (count > 0) return;
  console.log('Empty DB — auto-seeding WM 2026 matches…');
  seed();
}

export function autoSeed2022IfEmpty(): void {
  const scheduled = (db.prepare("SELECT COUNT(*) as c FROM matches WHERE tournament='2022' AND status='SCHEDULED'").get() as any).c;
  if (scheduled > 0) return;
  // Clear any FINISHED 2022 matches and reseed as SCHEDULED
  console.log('Auto-seeding WM 2022 matches (SCHEDULED + real scores for instant scoring)…');
  db.exec("DELETE FROM predictions WHERE match_id IN (SELECT id FROM matches WHERE tournament='2022')");
  db.exec("DELETE FROM matches WHERE tournament='2022'");
  seed2022();
}

export function forceSeed2022(): void {
  console.log('Force-reseeding WM 2022…');
  db.exec("DELETE FROM predictions WHERE match_id IN (SELECT id FROM matches WHERE tournament='2022')");
  db.exec("DELETE FROM matches WHERE tournament='2022'");
  seed2022();
}

export function forceSeed(): void {
  console.log('Force-reseeding WM 2026 (clearing duplicates)…');
  db.exec("DELETE FROM predictions WHERE match_id IN (SELECT id FROM matches WHERE tournament='2026')");
  db.exec("DELETE FROM matches WHERE tournament='2026'");
  seed();
}
