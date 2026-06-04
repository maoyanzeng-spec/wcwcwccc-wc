import db from '../db/database';

const MATCHES_2026: { date: string; home: [string,string]; away: [string,string]; group: string; day: number }[] = [
  { date: '2026-06-11T19:00:00Z', home: ['Mexiko','MEX'], away: ['Südafrika','RSA'], group:'A', day:1 },
  { date: '2026-06-12T02:00:00Z', home: ['Südkorea','KOR'], away: ['Tschechien','CZE'], group:'A', day:1 },
  { date: '2026-06-12T19:00:00Z', home: ['Kanada','CAN'], away: ['Bosnien-Herzegowina','BIH'], group:'B', day:1 },
  { date: '2026-06-13T01:00:00Z', home: ['USA','USA'], away: ['Paraguay','PAR'], group:'D', day:1 },
  { date: '2026-06-13T19:00:00Z', home: ['Katar','QAT'], away: ['Schweiz','SUI'], group:'B', day:1 },
  { date: '2026-06-13T22:00:00Z', home: ['Brasilien','BRA'], away: ['Marokko','MAR'], group:'C', day:1 },
  { date: '2026-06-14T01:00:00Z', home: ['Haiti','HAI'], away: ['Schottland','SCO'], group:'C', day:1 },
  { date: '2026-06-14T04:00:00Z', home: ['Australien','AUS'], away: ['Türkei','TUR'], group:'D', day:1 },
  { date: '2026-06-14T17:00:00Z', home: ['Deutschland','GER'], away: ['Curaçao','CUW'], group:'E', day:1 },
  { date: '2026-06-14T20:00:00Z', home: ['Niederlande','NED'], away: ['Japan','JPN'], group:'F', day:1 },
  { date: '2026-06-14T23:00:00Z', home: ['Elfenbeinküste','CIV'], away: ['Ecuador','ECU'], group:'E', day:1 },
  { date: '2026-06-15T02:00:00Z', home: ['Schweden','SWE'], away: ['Tunesien','TUN'], group:'F', day:1 },
  { date: '2026-06-15T17:00:00Z', home: ['Spanien','ESP'], away: ['Kap Verde','CPV'], group:'H', day:1 },
  { date: '2026-06-15T22:00:00Z', home: ['Belgien','BEL'], away: ['Ägypten','EGY'], group:'G', day:1 },
  { date: '2026-06-15T22:00:00Z', home: ['Saudi-Arabien','KSA'], away: ['Uruguay','URU'], group:'H', day:1 },
  { date: '2026-06-16T04:00:00Z', home: ['Iran','IRN'], away: ['Neuseeland','NZL'], group:'G', day:1 },
  { date: '2026-06-16T19:00:00Z', home: ['Frankreich','FRA'], away: ['Senegal','SEN'], group:'I', day:1 },
  { date: '2026-06-16T22:00:00Z', home: ['Irak','IRQ'], away: ['Norwegen','NOR'], group:'I', day:1 },
  { date: '2026-06-17T01:00:00Z', home: ['Argentinien','ARG'], away: ['Algerien','ALG'], group:'J', day:1 },
  { date: '2026-06-17T04:00:00Z', home: ['Österreich','AUT'], away: ['Jordanien','JOR'], group:'J', day:1 },
  { date: '2026-06-17T17:00:00Z', home: ['Portugal','POR'], away: ['Kongo DR','COD'], group:'K', day:1 },
  { date: '2026-06-17T20:00:00Z', home: ['England','ENG'], away: ['Kroatien','CRO'], group:'L', day:1 },
  { date: '2026-06-17T23:00:00Z', home: ['Ghana','GHA'], away: ['Panama','PAN'], group:'L', day:1 },
  { date: '2026-06-18T02:00:00Z', home: ['Usbekistan','UZB'], away: ['Kolumbien','COL'], group:'K', day:1 },
  { date: '2026-06-18T16:00:00Z', home: ['Tschechien','CZE'], away: ['Südafrika','RSA'], group:'A', day:2 },
  { date: '2026-06-18T19:00:00Z', home: ['Schweiz','SUI'], away: ['Bosnien-Herzegowina','BIH'], group:'B', day:2 },
  { date: '2026-06-18T22:00:00Z', home: ['Kanada','CAN'], away: ['Katar','QAT'], group:'B', day:2 },
  { date: '2026-06-19T03:00:00Z', home: ['Mexiko','MEX'], away: ['Südkorea','KOR'], group:'A', day:2 },
  { date: '2026-06-19T19:00:00Z', home: ['USA','USA'], away: ['Australien','AUS'], group:'D', day:2 },
  { date: '2026-06-19T22:00:00Z', home: ['Schottland','SCO'], away: ['Marokko','MAR'], group:'C', day:2 },
  { date: '2026-06-20T01:00:00Z', home: ['Brasilien','BRA'], away: ['Haiti','HAI'], group:'C', day:2 },
  { date: '2026-06-20T04:00:00Z', home: ['Türkei','TUR'], away: ['Paraguay','PAR'], group:'D', day:2 },
  { date: '2026-06-20T17:00:00Z', home: ['Niederlande','NED'], away: ['Schweden','SWE'], group:'F', day:2 },
  { date: '2026-06-20T20:00:00Z', home: ['Deutschland','GER'], away: ['Elfenbeinküste','CIV'], group:'E', day:2 },
  { date: '2026-06-21T00:00:00Z', home: ['Ecuador','ECU'], away: ['Curaçao','CUW'], group:'E', day:2 },
  { date: '2026-06-21T04:00:00Z', home: ['Tunesien','TUN'], away: ['Japan','JPN'], group:'F', day:2 },
  { date: '2026-06-21T16:00:00Z', home: ['Spanien','ESP'], away: ['Saudi-Arabien','KSA'], group:'H', day:2 },
  { date: '2026-06-21T19:00:00Z', home: ['Belgien','BEL'], away: ['Iran','IRN'], group:'G', day:2 },
  { date: '2026-06-21T22:00:00Z', home: ['Uruguay','URU'], away: ['Kap Verde','CPV'], group:'H', day:2 },
  { date: '2026-06-22T01:00:00Z', home: ['Neuseeland','NZL'], away: ['Ägypten','EGY'], group:'G', day:2 },
  { date: '2026-06-22T17:00:00Z', home: ['Argentinien','ARG'], away: ['Österreich','AUT'], group:'J', day:2 },
  { date: '2026-06-22T21:00:00Z', home: ['Frankreich','FRA'], away: ['Irak','IRQ'], group:'I', day:2 },
  { date: '2026-06-23T00:00:00Z', home: ['Norwegen','NOR'], away: ['Senegal','SEN'], group:'I', day:2 },
  { date: '2026-06-23T03:00:00Z', home: ['Jordanien','JOR'], away: ['Algerien','ALG'], group:'J', day:2 },
  { date: '2026-06-23T17:00:00Z', home: ['Portugal','POR'], away: ['Usbekistan','UZB'], group:'K', day:2 },
  { date: '2026-06-23T20:00:00Z', home: ['England','ENG'], away: ['Ghana','GHA'], group:'L', day:2 },
  { date: '2026-06-23T23:00:00Z', home: ['Panama','PAN'], away: ['Kroatien','CRO'], group:'L', day:2 },
  { date: '2026-06-24T02:00:00Z', home: ['Kolumbien','COL'], away: ['Kongo DR','COD'], group:'K', day:2 },
  { date: '2026-06-24T19:00:00Z', home: ['Schweiz','SUI'], away: ['Kanada','CAN'], group:'B', day:3 },
  { date: '2026-06-24T19:00:00Z', home: ['Bosnien-Herzegowina','BIH'], away: ['Katar','QAT'], group:'B', day:3 },
  { date: '2026-06-24T22:00:00Z', home: ['Schottland','SCO'], away: ['Brasilien','BRA'], group:'C', day:3 },
  { date: '2026-06-24T22:00:00Z', home: ['Marokko','MAR'], away: ['Haiti','HAI'], group:'C', day:3 },
  { date: '2026-06-25T01:00:00Z', home: ['Tschechien','CZE'], away: ['Mexiko','MEX'], group:'A', day:3 },
  { date: '2026-06-25T01:00:00Z', home: ['Südafrika','RSA'], away: ['Südkorea','KOR'], group:'A', day:3 },
  { date: '2026-06-25T20:00:00Z', home: ['Ecuador','ECU'], away: ['Deutschland','GER'], group:'E', day:3 },
  { date: '2026-06-25T20:00:00Z', home: ['Curaçao','CUW'], away: ['Elfenbeinküste','CIV'], group:'E', day:3 },
  { date: '2026-06-25T23:00:00Z', home: ['Japan','JPN'], away: ['Schweden','SWE'], group:'F', day:3 },
  { date: '2026-06-25T23:00:00Z', home: ['Tunesien','TUN'], away: ['Niederlande','NED'], group:'F', day:3 },
  { date: '2026-06-26T02:00:00Z', home: ['Türkei','TUR'], away: ['USA','USA'], group:'D', day:3 },
  { date: '2026-06-26T02:00:00Z', home: ['Paraguay','PAR'], away: ['Australien','AUS'], group:'D', day:3 },
  { date: '2026-06-26T19:00:00Z', home: ['Norwegen','NOR'], away: ['Frankreich','FRA'], group:'I', day:3 },
  { date: '2026-06-26T19:00:00Z', home: ['Senegal','SEN'], away: ['Irak','IRQ'], group:'I', day:3 },
  { date: '2026-06-27T00:00:00Z', home: ['Uruguay','URU'], away: ['Spanien','ESP'], group:'H', day:3 },
  { date: '2026-06-27T00:00:00Z', home: ['Kap Verde','CPV'], away: ['Saudi-Arabien','KSA'], group:'H', day:3 },
  { date: '2026-06-27T03:00:00Z', home: ['Neuseeland','NZL'], away: ['Belgien','BEL'], group:'G', day:3 },
  { date: '2026-06-27T03:00:00Z', home: ['Ägypten','EGY'], away: ['Iran','IRN'], group:'G', day:3 },
  { date: '2026-06-27T21:00:00Z', home: ['Panama','PAN'], away: ['England','ENG'], group:'L', day:3 },
  { date: '2026-06-27T21:00:00Z', home: ['Kroatien','CRO'], away: ['Ghana','GHA'], group:'L', day:3 },
  { date: '2026-06-27T23:30:00Z', home: ['Kolumbien','COL'], away: ['Portugal','POR'], group:'K', day:3 },
  { date: '2026-06-27T23:30:00Z', home: ['Kongo DR','COD'], away: ['Usbekistan','UZB'], group:'K', day:3 },
  { date: '2026-06-28T02:00:00Z', home: ['Argentinien','ARG'], away: ['Jordanien','JOR'], group:'J', day:3 },
  { date: '2026-06-28T02:00:00Z', home: ['Algerien','ALG'], away: ['Österreich','AUT'], group:'J', day:3 },
];

// WM 2022 – all 64 matches with real scores, seeded as SCHEDULED so tips can always be submitted
const MATCHES_2022: { home:[string,string]; away:[string,string]; hs:number; as:number; stage:string; group?:string; day?:number; wt?:string }[] = [
  // Group A
  { home:['Katar','QAT'],       away:['Ecuador','ECU'],      hs:0,as:2, stage:'GROUP_STAGE', group:'A', day:1 },
  { home:['Senegal','SEN'],     away:['Niederlande','NED'],  hs:0,as:2, stage:'GROUP_STAGE', group:'A', day:1 },
  { home:['Katar','QAT'],       away:['Senegal','SEN'],      hs:1,as:3, stage:'GROUP_STAGE', group:'A', day:2 },
  { home:['Niederlande','NED'], away:['Ecuador','ECU'],      hs:1,as:1, stage:'GROUP_STAGE', group:'A', day:2 },
  { home:['Niederlande','NED'], away:['Katar','QAT'],        hs:2,as:0, stage:'GROUP_STAGE', group:'A', day:3 },
  { home:['Ecuador','ECU'],     away:['Senegal','SEN'],      hs:1,as:2, stage:'GROUP_STAGE', group:'A', day:3 },
  // Group B
  { home:['England','ENG'],     away:['Iran','IRN'],         hs:6,as:2, stage:'GROUP_STAGE', group:'B', day:1 },
  { home:['USA','USA'],         away:['Wales','WAL'],        hs:1,as:1, stage:'GROUP_STAGE', group:'B', day:1 },
  { home:['Wales','WAL'],       away:['Iran','IRN'],         hs:0,as:2, stage:'GROUP_STAGE', group:'B', day:2 },
  { home:['England','ENG'],     away:['USA','USA'],          hs:0,as:0, stage:'GROUP_STAGE', group:'B', day:2 },
  { home:['Wales','WAL'],       away:['England','ENG'],      hs:0,as:3, stage:'GROUP_STAGE', group:'B', day:3 },
  { home:['Iran','IRN'],        away:['USA','USA'],          hs:0,as:1, stage:'GROUP_STAGE', group:'B', day:3 },
  // Group C
  { home:['Argentinien','ARG'], away:['Saudi-Arabien','KSA'],hs:1,as:2, stage:'GROUP_STAGE', group:'C', day:1 },
  { home:['Mexiko','MEX'],      away:['Polen','POL'],        hs:0,as:0, stage:'GROUP_STAGE', group:'C', day:1 },
  { home:['Polen','POL'],       away:['Saudi-Arabien','KSA'],hs:2,as:0, stage:'GROUP_STAGE', group:'C', day:2 },
  { home:['Argentinien','ARG'], away:['Mexiko','MEX'],       hs:2,as:0, stage:'GROUP_STAGE', group:'C', day:2 },
  { home:['Polen','POL'],       away:['Argentinien','ARG'],  hs:0,as:2, stage:'GROUP_STAGE', group:'C', day:3 },
  { home:['Saudi-Arabien','KSA'],away:['Mexiko','MEX'],      hs:1,as:2, stage:'GROUP_STAGE', group:'C', day:3 },
  // Group D
  { home:['Dänemark','DEN'],    away:['Tunesien','TUN'],     hs:0,as:0, stage:'GROUP_STAGE', group:'D', day:1 },
  { home:['Frankreich','FRA'],  away:['Australien','AUS'],   hs:4,as:1, stage:'GROUP_STAGE', group:'D', day:1 },
  { home:['Tunesien','TUN'],    away:['Australien','AUS'],   hs:0,as:1, stage:'GROUP_STAGE', group:'D', day:2 },
  { home:['Frankreich','FRA'],  away:['Dänemark','DEN'],     hs:2,as:1, stage:'GROUP_STAGE', group:'D', day:2 },
  { home:['Tunesien','TUN'],    away:['Frankreich','FRA'],   hs:1,as:0, stage:'GROUP_STAGE', group:'D', day:3 },
  { home:['Australien','AUS'],  away:['Dänemark','DEN'],     hs:1,as:0, stage:'GROUP_STAGE', group:'D', day:3 },
  // Group E
  { home:['Deutschland','GER'], away:['Japan','JPN'],        hs:1,as:2, stage:'GROUP_STAGE', group:'E', day:1 },
  { home:['Spanien','ESP'],     away:['Costa Rica','CRC'],   hs:7,as:0, stage:'GROUP_STAGE', group:'E', day:1 },
  { home:['Japan','JPN'],       away:['Costa Rica','CRC'],   hs:0,as:1, stage:'GROUP_STAGE', group:'E', day:2 },
  { home:['Spanien','ESP'],     away:['Deutschland','GER'],  hs:1,as:1, stage:'GROUP_STAGE', group:'E', day:2 },
  { home:['Japan','JPN'],       away:['Spanien','ESP'],      hs:2,as:1, stage:'GROUP_STAGE', group:'E', day:3 },
  { home:['Costa Rica','CRC'],  away:['Deutschland','GER'],  hs:2,as:4, stage:'GROUP_STAGE', group:'E', day:3 },
  // Group F
  { home:['Marokko','MAR'],     away:['Kroatien','CRO'],     hs:0,as:0, stage:'GROUP_STAGE', group:'F', day:1 },
  { home:['Belgien','BEL'],     away:['Kanada','CAN'],       hs:1,as:0, stage:'GROUP_STAGE', group:'F', day:1 },
  { home:['Belgien','BEL'],     away:['Marokko','MAR'],      hs:0,as:2, stage:'GROUP_STAGE', group:'F', day:2 },
  { home:['Kroatien','CRO'],    away:['Kanada','CAN'],       hs:4,as:1, stage:'GROUP_STAGE', group:'F', day:2 },
  { home:['Kroatien','CRO'],    away:['Belgien','BEL'],      hs:0,as:0, stage:'GROUP_STAGE', group:'F', day:3 },
  { home:['Marokko','MAR'],     away:['Kanada','CAN'],       hs:2,as:1, stage:'GROUP_STAGE', group:'F', day:3 },
  // Group G
  { home:['Schweiz','SUI'],     away:['Kamerun','CMR'],      hs:1,as:0, stage:'GROUP_STAGE', group:'G', day:1 },
  { home:['Brasilien','BRA'],   away:['Serbien','SRB'],      hs:2,as:0, stage:'GROUP_STAGE', group:'G', day:1 },
  { home:['Kamerun','CMR'],     away:['Serbien','SRB'],      hs:3,as:3, stage:'GROUP_STAGE', group:'G', day:2 },
  { home:['Brasilien','BRA'],   away:['Schweiz','SUI'],      hs:1,as:0, stage:'GROUP_STAGE', group:'G', day:2 },
  { home:['Kamerun','CMR'],     away:['Brasilien','BRA'],    hs:1,as:0, stage:'GROUP_STAGE', group:'G', day:3 },
  { home:['Serbien','SRB'],     away:['Schweiz','SUI'],      hs:2,as:3, stage:'GROUP_STAGE', group:'G', day:3 },
  // Group H
  { home:['Uruguay','URU'],     away:['Südkorea','KOR'],     hs:0,as:0, stage:'GROUP_STAGE', group:'H', day:1 },
  { home:['Portugal','POR'],    away:['Ghana','GHA'],        hs:3,as:2, stage:'GROUP_STAGE', group:'H', day:1 },
  { home:['Südkorea','KOR'],    away:['Ghana','GHA'],        hs:2,as:3, stage:'GROUP_STAGE', group:'H', day:2 },
  { home:['Portugal','POR'],    away:['Uruguay','URU'],      hs:2,as:0, stage:'GROUP_STAGE', group:'H', day:2 },
  { home:['Südkorea','KOR'],    away:['Portugal','POR'],     hs:2,as:1, stage:'GROUP_STAGE', group:'H', day:3 },
  { home:['Ghana','GHA'],       away:['Uruguay','URU'],      hs:0,as:2, stage:'GROUP_STAGE', group:'H', day:3 },
  // Round of 16
  { home:['Niederlande','NED'], away:['USA','USA'],          hs:3,as:1, stage:'LAST_16' },
  { home:['Argentinien','ARG'], away:['Australien','AUS'],   hs:2,as:1, stage:'LAST_16' },
  { home:['Frankreich','FRA'],  away:['Polen','POL'],        hs:3,as:1, stage:'LAST_16' },
  { home:['England','ENG'],     away:['Senegal','SEN'],      hs:3,as:0, stage:'LAST_16' },
  { home:['Japan','JPN'],       away:['Kroatien','CRO'],     hs:1,as:1, stage:'LAST_16' },
  { home:['Brasilien','BRA'],   away:['Südkorea','KOR'],     hs:4,as:1, stage:'LAST_16' },
  { home:['Marokko','MAR'],     away:['Spanien','ESP'],      hs:0,as:0, stage:'LAST_16' },
  { home:['Portugal','POR'],    away:['Schweiz','SUI'],      hs:6,as:1, stage:'LAST_16' },
  // Quarter-finals
  { home:['Kroatien','CRO'],    away:['Brasilien','BRA'],    hs:1,as:1, stage:'QUARTER_FINALS' },
  { home:['Niederlande','NED'], away:['Argentinien','ARG'],  hs:2,as:2, stage:'QUARTER_FINALS' },
  { home:['Marokko','MAR'],     away:['Portugal','POR'],     hs:1,as:0, stage:'QUARTER_FINALS' },
  { home:['Frankreich','FRA'],  away:['England','ENG'],      hs:2,as:1, stage:'QUARTER_FINALS' },
  // Semi-finals
  { home:['Argentinien','ARG'], away:['Kroatien','CRO'],     hs:3,as:0, stage:'SEMI_FINALS' },
  { home:['Frankreich','FRA'],  away:['Marokko','MAR'],      hs:2,as:0, stage:'SEMI_FINALS' },
  // Third place
  { home:['Kroatien','CRO'],    away:['Marokko','MAR'],      hs:2,as:1, stage:'THIRD_PLACE' },
  // Final – AET 3-3, Argentina wins on penalties
  { home:['Argentinien','ARG'], away:['Frankreich','FRA'],   hs:3,as:3, stage:'FINAL', wt:'Argentinien' },
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
