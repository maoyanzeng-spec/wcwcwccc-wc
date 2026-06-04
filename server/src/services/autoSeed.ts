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

export function autoSeedIfEmpty(): void {
  const count = (db.prepare("SELECT COUNT(*) as c FROM matches WHERE tournament='2026'").get() as any).c;
  if (count > 0) return;

  console.log('Empty DB detected — auto-seeding WM 2026 matches…');
  const insert = db.prepare(`
    INSERT INTO matches (stage, group_name, match_day, home_team, away_team, home_team_short, away_team_short, match_time, status, tournament)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'SCHEDULED', '2026')
  `);
  db.exec('BEGIN');
  for (const m of MATCHES_2026) {
    insert.run('GROUP_STAGE', `GROUP_${m.group}`, m.day, m.home[0], m.away[0], m.home[1], m.away[1], m.date);
  }
  db.exec('COMMIT');
  console.log(`Auto-seeded ${MATCHES_2026.length} WM 2026 matches.`);
}
