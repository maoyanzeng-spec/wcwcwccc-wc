export type MatchStatus = 'SCHEDULED' | 'IN_PLAY' | 'FINISHED';

export interface Match {
  id: number;
  stage: string;
  group_name?: string;
  match_day?: number;
  home_team: string;
  away_team: string;
  home_team_short?: string;
  away_team_short?: string;
  home_team_crest?: string;
  away_team_crest?: string;
  match_time: string;
  home_score?: number | null;
  away_score?: number | null;
  status: MatchStatus;
  my_prediction?: {
    id: number;
    home_score: number;
    away_score: number;
    points?: number | null;
  } | null;
}

export interface BonusQuestion {
  id: number;
  room_id: number;
  type: 'SEMI_FINALIST' | 'FINALIST' | 'CHAMPION';
  label: string;
  points_per_pick: number;
  max_picks: number;
}

export interface BonusPick {
  id: number;
  user_id: number;
  question_id: number;
  team_name: string;
  points: number | null;
}

export interface BonusTeam {
  name: string;
  short: string | null;
}

export interface LeaderboardEntry {
  rank: number;
  id: number;
  nickname: string;
  total_points: number;
  match_points: number;
  bonus_points: number;
  predictions_count: number;
  exact_scores: number;
  correct_outcomes: number;
  is_me: boolean;
}

export interface Session {
  token: string;
  code: string;
  roomName: string;
  nickname: string;
  roomId: number;
  tournament: '2022' | '2026';
}
