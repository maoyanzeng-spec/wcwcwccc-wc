import axios from 'axios';
import db from '../db/database';
import { processMatchResults } from './scoring';

const API_BASE = 'https://api.football-data.org/v4';
const API_KEY = process.env.FOOTBALL_API_KEY;

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

export async function syncMatches(): Promise<void> {
  if (!API_KEY) {
    console.log('No FOOTBALL_API_KEY set, skipping sync. Using existing data.');
    return;
  }

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
        updated_at = datetime('now')
    `);

    db.exec('BEGIN');
    try {
      for (const m of matches) {
        upsert.run(
          String(m.id),
          STAGE_MAP[m.stage] ?? m.stage,
          m.group ?? null,
          m.matchday ?? null,
          translateTeam(m.homeTeam.name),
          translateTeam(m.awayTeam.name),
          translateTeam(m.homeTeam.shortName),
          translateTeam(m.awayTeam.shortName),
          m.homeTeam.crest,
          m.awayTeam.crest,
          m.utcDate,
          m.score.fullTime.home,
          m.score.fullTime.away,
          normalizeStatus(m.status)
        );
      }
      db.exec('COMMIT');
    } catch (e) {
      db.exec('ROLLBACK');
      throw e;
    }

    // Recalculate scores for newly finished matches
    const finished = db
      .prepare("SELECT id FROM matches WHERE status = 'FINISHED' AND home_score IS NOT NULL")
      .all() as { id: number }[];
    for (const { id } of finished) {
      processMatchResults(id);
    }

    console.log(`Synced ${matches.length} matches from football-data.org`);
  } catch (err: any) {
    console.error('Football API sync failed:', err.message);
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
