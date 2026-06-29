import axios from 'axios';
import db from '../db/database';
import { processMatchResults, scoreBonusPicks } from './scoring';

const API_BASE = 'https://api.football-data.org/v4';
// Treat blank/placeholder values as "no key" so a leftover `your_key_here`
// doesn't silently force (and break) the football-data path.
const rawKey = (process.env.FOOTBALL_API_KEY ?? '').trim();
const API_KEY = rawKey && rawKey !== 'your_key_here' ? rawKey : undefined;

// Stage mapping from API to our internal names
const STAGE_MAP: Record<string, string> = {
  GROUP_STAGE: 'GROUP_STAGE',
  LAST_32: 'LAST_32',
  LAST_16: 'LAST_16',
  QUARTER_FINALS: 'QUARTER_FINALS',
  SEMI_FINALS: 'SEMI_FINALS',
  THIRD_PLACE: 'THIRD_PLACE',
  FINAL: 'FINAL',
};

// English team names from football-data.org → Chinese
const TEAM_NAMES_ZH: Record<string, string> = {
  // Americas
  'Mexico': '墨西哥',
  'United States': '美国',
  'USA': '美国',
  'Canada': '加拿大',
  'Brazil': '巴西',
  'Argentina': '阿根廷',
  'Colombia': '哥伦比亚',
  'Uruguay': '乌拉圭',
  'Paraguay': '巴拉圭',
  'Ecuador': '厄瓜多尔',
  'Chile': '智利',
  'Peru': '秘鲁',
  'Bolivia': '玻利维亚',
  'Venezuela': '委内瑞拉',
  'Panama': '巴拿马',
  'Costa Rica': '哥斯达黎加',
  'Honduras': '洪都拉斯',
  'Jamaica': '牙买加',
  'Haiti': '海地',
  'Trinidad and Tobago': '特立尼达和多巴哥',
  'Curaçao': '库拉索',
  // Europe
  'Germany': '德国',
  'France': '法国',
  'Spain': '西班牙',
  'Portugal': '葡萄牙',
  'England': '英格兰',
  'Netherlands': '荷兰',
  'Belgium': '比利时',
  'Italy': '意大利',
  'Croatia': '克罗地亚',
  'Switzerland': '瑞士',
  'Austria': '奥地利',
  'Sweden': '瑞典',
  'Norway': '挪威',
  'Denmark': '丹麦',
  'Poland': '波兰',
  'Czechia': '捷克',
  'Czech Republic': '捷克',
  'Slovakia': '斯洛伐克',
  'Hungary': '匈牙利',
  'Romania': '罗马尼亚',
  'Serbia': '塞尔维亚',
  'Scotland': '苏格兰',
  'Wales': '威尔士',
  'Ukraine': '乌克兰',
  'Russia': '俄罗斯',
  'Turkey': '土耳其',
  'Türkiye': '土耳其',
  'Greece': '希腊',
  'Bosnia and Herzegovina': '波黑',
  'Bosnia-Herzegovina': '波黑',
  'Albania': '阿尔巴尼亚',
  'North Macedonia': '北马其顿',
  'Slovenia': '斯洛文尼亚',
  'Montenegro': '黑山',
  'Kosovo': '科索沃',
  'Iceland': '冰岛',
  'Ireland': '爱尔兰',
  'Finland': '芬兰',
  'Estonia': '爱沙尼亚',
  'Latvia': '拉脱维亚',
  'Lithuania': '立陶宛',
  'Bulgaria': '保加利亚',
  // Africa
  'Morocco': '摩洛哥',
  'Senegal': '塞内加尔',
  'Egypt': '埃及',
  'Nigeria': '尼日利亚',
  'Ghana': '加纳',
  'Ivory Coast': '科特迪瓦',
  "Côte d'Ivoire": '科特迪瓦',
  'Algeria': '阿尔及利亚',
  'Tunisia': '突尼斯',
  'Cameroon': '喀麦隆',
  'South Africa': '南非',
  'Mali': '马里',
  'Burkina Faso': '布基纳法索',
  'Guinea': '几内亚',
  'Cape Verde': '佛得角',
  'Congo DR': '刚果（金）',
  'DR Congo': '刚果（金）',
  'Kenya': '肯尼亚',
  'Tanzania': '坦桑尼亚',
  'Uganda': '乌干达',
  'Zambia': '赞比亚',
  'Zimbabwe': '津巴布韦',
  'Angola': '安哥拉',
  'Mozambique': '莫桑比克',
  'Namibia': '纳米比亚',
  'Gabon': '加蓬',
  // Asia
  'Japan': '日本',
  'Korea Republic': '韩国',
  'South Korea': '韩国',
  'Iran': '伊朗',
  'Saudi Arabia': '沙特阿拉伯',
  'Australia': '澳大利亚',
  'Qatar': '卡塔尔',
  'Iraq': '伊拉克',
  'Jordan': '约旦',
  'Uzbekistan': '乌兹别克斯坦',
  'China PR': '中国',
  'China': '中国',
  'India': '印度',
  'Indonesia': '印度尼西亚',
  'Vietnam': '越南',
  'Thailand': '泰国',
  'Malaysia': '马来西亚',
  'Singapore': '新加坡',
  'Philippines': '菲律宾',
  'United Arab Emirates': '阿联酋',
  'Bahrain': '巴林',
  'Kuwait': '科威特',
  'Oman': '阿曼',
  'Syria': '叙利亚',
  'Lebanon': '黎巴嫩',
  'Israel': '以色列',
  'Palestine': '巴勒斯坦',
  'Kazakhstan': '哈萨克斯坦',
  'Kyrgyzstan': '吉尔吉斯斯坦',
  'Tajikistan': '塔吉克斯坦',
  'Turkmenistan': '土库曼斯坦',
  // Oceania
  'New Zealand': '新西兰',
};

function translateTeam(name: string): string {
  return TEAM_NAMES_ZH[name] ?? name;
}

interface ApiMatch {
  id: number;
  stage: string;
  group: string | null;
  matchday: number | null;
  utcDate: string;
  status: string;
  homeTeam: { name: string; shortName: string; crest: string };
  awayTeam: { name: string; shortName: string; crest: string };
  score: { fullTime: { home: number | null; away: number | null } };
}

const pairKey = (a: string, b: string) => [a, b].sort().join('|');

// Dispatcher: football-data.org when a key is set (also auto-inserts knockout
// fixtures), otherwise the keyless TheSportsDB fallback (updates scores only).
// If football-data returns nothing (bad key / plan without WC), fall back too.
export async function syncMatches(): Promise<void> {
  if (API_KEY) {
    const count = await syncFromFootballData();
    if (count > 0) return;
    console.log('football-data.org returned no matches — falling back to keyless TheSportsDB.');
  } else {
    console.log('No valid FOOTBALL_API_KEY — using keyless TheSportsDB fallback.');
  }
  return syncFromTheSportsDB();
}

async function syncFromFootballData(): Promise<number> {
  try {
    const res = await axios.get(`${API_BASE}/competitions/WC/matches?season=2026`, {
      headers: { 'X-Auth-Token': API_KEY },
    });
    const matches: ApiMatch[] = res.data.matches ?? [];

    const upsert = db.prepare(`
      INSERT INTO matches (external_id, stage, group_name, match_day, home_team, away_team, home_team_short, away_team_short, home_team_crest, away_team_crest, match_time, home_score, away_score, status, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
      ON CONFLICT(external_id) DO UPDATE SET
        home_score = excluded.home_score,
        away_score = excluded.away_score,
        status = excluded.status,
        match_time = excluded.match_time,
        updated_at = datetime('now')
    `);

    // Link an API match onto an existing seeded placeholder (external_id IS NULL)
    // WITHOUT changing its home/away orientation — so already-placed predictions
    // stay valid. Only attaches the external_id + result/crests/kickoff.
    const link = db.prepare(`
      UPDATE matches SET
        external_id = ?, stage = ?,
        home_team_short = ?, away_team_short = ?,
        home_team_crest = ?, away_team_crest = ?,
        match_time = ?, home_score = ?, away_score = ?, status = ?,
        updated_at = datetime('now')
      WHERE id = ?
    `);

    // Index seeded placeholders by unordered team pair (each pair is unique in the
    // group stage), so we can match regardless of which side the API lists as home.
    const placeholders = new Map<string, { id: number; home: string }>();
    for (const p of db.prepare(
      "SELECT id, home_team, away_team FROM matches WHERE tournament = '2026' AND external_id IS NULL"
    ).all() as any[]) {
      placeholders.set(pairKey(p.home_team, p.away_team), { id: p.id, home: p.home_team });
    }

    db.exec('BEGIN');
    try {
      for (const m of matches) {
        // Skip unresolved bracket slots (TBD knockout fixtures) — only insert/update
        // once both real teams are known. This is how knockout phases auto-open.
        if (!m.homeTeam?.name || !m.awayTeam?.name) continue;
        const home = translateTeam(m.homeTeam.name);
        const away = translateTeam(m.awayTeam.name);
        const stage = STAGE_MAP[m.stage] ?? m.stage;
        const status = normalizeStatus(m.status);

        const ph = placeholders.get(pairKey(home, away));
        if (ph) {
          // Orient scores/crests/shorts to the placeholder's existing home/away.
          const sameOrder = ph.home === home;
          const hScore = sameOrder ? m.score.fullTime.home : m.score.fullTime.away;
          const aScore = sameOrder ? m.score.fullTime.away : m.score.fullTime.home;
          link.run(
            String(m.id), stage,
            translateTeam(sameOrder ? m.homeTeam.shortName : m.awayTeam.shortName),
            translateTeam(sameOrder ? m.awayTeam.shortName : m.homeTeam.shortName),
            sameOrder ? m.homeTeam.crest : m.awayTeam.crest,
            sameOrder ? m.awayTeam.crest : m.homeTeam.crest,
            m.utcDate, hScore, aScore, status, ph.id
          );
          placeholders.delete(pairKey(home, away)); // consume — don't reuse
        } else {
          upsert.run(
            String(m.id), stage, m.group ?? null, m.matchday ?? null,
            home, away,
            translateTeam(m.homeTeam.shortName), translateTeam(m.awayTeam.shortName),
            m.homeTeam.crest, m.awayTeam.crest,
            m.utcDate, m.score.fullTime.home, m.score.fullTime.away, status
          );
        }
      }
      db.exec('COMMIT');
    } catch (e) {
      db.exec('ROLLBACK');
      throw e;
    }

    // Recalculate scores for newly finished matches
    const finished = db
      .prepare("SELECT id FROM matches WHERE tournament = '2026' AND status = 'FINISHED' AND home_score IS NOT NULL")
      .all() as { id: number }[];
    for (const { id } of finished) {
      processMatchResults(id);
    }
    // Award bonus points as knockout stages resolve (semi-finalist/finalist/champion).
    scoreBonusPicks('2026');

    console.log(`Synced ${matches.length} matches from football-data.org`);
    return matches.length;
  } catch (err: any) {
    console.error('Football API sync failed:', err.message);
    return 0;
  }
}

// ---- Keyless fallback: TheSportsDB (no API key required) -------------------
// Updates scores/status on EXISTING fixtures by team-name pair (orientation-aware).
// It does NOT insert new fixtures: TheSportsDB exposes intRound but no stage label,
// so we can't reliably assign LAST_32/LAST_16/etc. Auto-inserting knockout fixtures
// stays with football-data.org (keyed) or the admin PATCH endpoint.
const SPORTSDB_KEY = process.env.THESPORTSDB_KEY ?? '3'; // '3' = free public key
const SPORTSDB_WC_LEAGUE = '4429';

interface SdbEvent {
  strHomeTeam: string | null;
  strAwayTeam: string | null;
  intHomeScore: string | null;
  intAwayScore: string | null;
  strStatus: string | null;
}

function sdbStatus(s: string | null): string {
  if (!s) return 'SCHEDULED';
  if (['FT', 'AET', 'PEN', 'Match Finished'].includes(s)) return 'FINISHED';
  if (/1H|2H|HT|ET|LIVE|Playing|In Play/i.test(s)) return 'IN_PLAY';
  return 'SCHEDULED';
}

async function syncFromTheSportsDB(): Promise<void> {
  try {
    const url = `https://www.thesportsdb.com/api/v1/json/${SPORTSDB_KEY}/eventsseason.php?id=${SPORTSDB_WC_LEAGUE}&s=2026`;
    const res = await axios.get(url);
    const events: SdbEvent[] = res.data?.events ?? [];
    if (events.length === 0) {
      console.log('TheSportsDB returned no events — leaving existing data unchanged.');
      return;
    }

    // Index existing 2026 fixtures by unordered team-name pair.
    const byPair = new Map<string, { id: number; home: string }>();
    for (const m of db.prepare("SELECT id, home_team, away_team FROM matches WHERE tournament = '2026'").all() as any[]) {
      byPair.set(pairKey(m.home_team, m.away_team), { id: m.id, home: m.home_team });
    }

    // Only touch a row when something actually changed.
    const update = db.prepare(`
      UPDATE matches SET home_score = ?, away_score = ?, status = ?, updated_at = datetime('now')
      WHERE id = ? AND (home_score IS NOT ? OR away_score IS NOT ? OR status IS NOT ?)
    `);

    const touched = new Set<number>();
    db.exec('BEGIN');
    try {
      for (const e of events) {
        if (!e.strHomeTeam || !e.strAwayTeam) continue;
        const home = translateTeam(e.strHomeTeam);
        const away = translateTeam(e.strAwayTeam);
        const row = byPair.get(pairKey(home, away));
        if (!row) continue; // keyless source never inserts
        if (e.intHomeScore == null || e.intAwayScore == null) continue;

        const status = sdbStatus(e.strStatus);
        const sameOrder = row.home === home;
        const hs = Number(sameOrder ? e.intHomeScore : e.intAwayScore);
        const as = Number(sameOrder ? e.intAwayScore : e.intHomeScore);
        update.run(hs, as, status, row.id, hs, as, status);
        if (status === 'FINISHED') touched.add(row.id);
      }
      db.exec('COMMIT');
    } catch (e) {
      db.exec('ROLLBACK');
      throw e;
    }

    for (const id of touched) processMatchResults(id);
    scoreBonusPicks('2026');
    console.log(`TheSportsDB (keyless): processed ${events.length} events, ${touched.size} newly finished.`);
  } catch (err: any) {
    console.error('TheSportsDB sync failed:', err.message);
  }
}

function normalizeStatus(status: string): string {
  const map: Record<string, string> = {
    SCHEDULED: 'SCHEDULED',
    TIMED: 'SCHEDULED',
    IN_PLAY: 'IN_PLAY',
    PAUSED: 'IN_PLAY',
    FINISHED: 'FINISHED',
    SUSPENDED: 'SCHEDULED',
    POSTPONED: 'SCHEDULED',
    CANCELLED: 'SCHEDULED',
  };
  return map[status] ?? 'SCHEDULED';
}
