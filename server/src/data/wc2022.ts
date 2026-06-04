export interface MatchResult {
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  stage: string;
  group?: string;
  day?: number;
}

export const wc2022Results: MatchResult[] = [
  // Group A
  { homeTeam: 'Katar',       awayTeam: 'Ecuador',      homeScore: 0, awayScore: 2, stage: 'GROUP_STAGE', group: 'A', day: 1 },
  { homeTeam: 'Senegal',     awayTeam: 'Niederlande',  homeScore: 0, awayScore: 2, stage: 'GROUP_STAGE', group: 'A', day: 1 },
  { homeTeam: 'Katar',       awayTeam: 'Senegal',      homeScore: 1, awayScore: 3, stage: 'GROUP_STAGE', group: 'A', day: 2 },
  { homeTeam: 'Niederlande', awayTeam: 'Ecuador',      homeScore: 1, awayScore: 1, stage: 'GROUP_STAGE', group: 'A', day: 2 },
  { homeTeam: 'Niederlande', awayTeam: 'Katar',        homeScore: 2, awayScore: 0, stage: 'GROUP_STAGE', group: 'A', day: 3 },
  { homeTeam: 'Ecuador',     awayTeam: 'Senegal',      homeScore: 1, awayScore: 2, stage: 'GROUP_STAGE', group: 'A', day: 3 },
  // Group B
  { homeTeam: 'England',     awayTeam: 'Iran',         homeScore: 6, awayScore: 2, stage: 'GROUP_STAGE', group: 'B', day: 1 },
  { homeTeam: 'USA',         awayTeam: 'Wales',        homeScore: 1, awayScore: 1, stage: 'GROUP_STAGE', group: 'B', day: 1 },
  { homeTeam: 'Wales',       awayTeam: 'Iran',         homeScore: 0, awayScore: 2, stage: 'GROUP_STAGE', group: 'B', day: 2 },
  { homeTeam: 'England',     awayTeam: 'USA',          homeScore: 0, awayScore: 0, stage: 'GROUP_STAGE', group: 'B', day: 2 },
  { homeTeam: 'Wales',       awayTeam: 'England',      homeScore: 0, awayScore: 3, stage: 'GROUP_STAGE', group: 'B', day: 3 },
  { homeTeam: 'Iran',        awayTeam: 'USA',          homeScore: 0, awayScore: 1, stage: 'GROUP_STAGE', group: 'B', day: 3 },
  // Group C
  { homeTeam: 'Argentinien', awayTeam: 'Saudi-Arabien',homeScore: 1, awayScore: 2, stage: 'GROUP_STAGE', group: 'C', day: 1 },
  { homeTeam: 'Mexiko',      awayTeam: 'Polen',        homeScore: 0, awayScore: 0, stage: 'GROUP_STAGE', group: 'C', day: 1 },
  { homeTeam: 'Polen',       awayTeam: 'Saudi-Arabien',homeScore: 2, awayScore: 0, stage: 'GROUP_STAGE', group: 'C', day: 2 },
  { homeTeam: 'Argentinien', awayTeam: 'Mexiko',       homeScore: 2, awayScore: 0, stage: 'GROUP_STAGE', group: 'C', day: 2 },
  { homeTeam: 'Polen',       awayTeam: 'Argentinien',  homeScore: 0, awayScore: 2, stage: 'GROUP_STAGE', group: 'C', day: 3 },
  { homeTeam: 'Saudi-Arabien',awayTeam:'Mexiko',       homeScore: 1, awayScore: 2, stage: 'GROUP_STAGE', group: 'C', day: 3 },
  // Group D
  { homeTeam: 'Dänemark',    awayTeam: 'Tunesien',     homeScore: 0, awayScore: 0, stage: 'GROUP_STAGE', group: 'D', day: 1 },
  { homeTeam: 'Frankreich',  awayTeam: 'Australien',   homeScore: 4, awayScore: 1, stage: 'GROUP_STAGE', group: 'D', day: 1 },
  { homeTeam: 'Tunesien',    awayTeam: 'Australien',   homeScore: 0, awayScore: 1, stage: 'GROUP_STAGE', group: 'D', day: 2 },
  { homeTeam: 'Frankreich',  awayTeam: 'Dänemark',     homeScore: 2, awayScore: 1, stage: 'GROUP_STAGE', group: 'D', day: 2 },
  { homeTeam: 'Tunesien',    awayTeam: 'Frankreich',   homeScore: 1, awayScore: 0, stage: 'GROUP_STAGE', group: 'D', day: 3 },
  { homeTeam: 'Australien',  awayTeam: 'Dänemark',     homeScore: 1, awayScore: 0, stage: 'GROUP_STAGE', group: 'D', day: 3 },
  // Group E
  { homeTeam: 'Deutschland', awayTeam: 'Japan',        homeScore: 1, awayScore: 2, stage: 'GROUP_STAGE', group: 'E', day: 1 },
  { homeTeam: 'Spanien',     awayTeam: 'Costa Rica',   homeScore: 7, awayScore: 0, stage: 'GROUP_STAGE', group: 'E', day: 1 },
  { homeTeam: 'Japan',       awayTeam: 'Costa Rica',   homeScore: 0, awayScore: 1, stage: 'GROUP_STAGE', group: 'E', day: 2 },
  { homeTeam: 'Spanien',     awayTeam: 'Deutschland',  homeScore: 1, awayScore: 1, stage: 'GROUP_STAGE', group: 'E', day: 2 },
  { homeTeam: 'Japan',       awayTeam: 'Spanien',      homeScore: 2, awayScore: 1, stage: 'GROUP_STAGE', group: 'E', day: 3 },
  { homeTeam: 'Costa Rica',  awayTeam: 'Deutschland',  homeScore: 2, awayScore: 4, stage: 'GROUP_STAGE', group: 'E', day: 3 },
  // Group F
  { homeTeam: 'Marokko',     awayTeam: 'Kroatien',     homeScore: 0, awayScore: 0, stage: 'GROUP_STAGE', group: 'F', day: 1 },
  { homeTeam: 'Belgien',     awayTeam: 'Kanada',       homeScore: 1, awayScore: 0, stage: 'GROUP_STAGE', group: 'F', day: 1 },
  { homeTeam: 'Belgien',     awayTeam: 'Marokko',      homeScore: 0, awayScore: 2, stage: 'GROUP_STAGE', group: 'F', day: 2 },
  { homeTeam: 'Kroatien',    awayTeam: 'Kanada',       homeScore: 4, awayScore: 1, stage: 'GROUP_STAGE', group: 'F', day: 2 },
  { homeTeam: 'Kroatien',    awayTeam: 'Belgien',      homeScore: 0, awayScore: 0, stage: 'GROUP_STAGE', group: 'F', day: 3 },
  { homeTeam: 'Marokko',     awayTeam: 'Kanada',       homeScore: 2, awayScore: 1, stage: 'GROUP_STAGE', group: 'F', day: 3 },
  // Group G
  { homeTeam: 'Schweiz',     awayTeam: 'Kamerun',      homeScore: 1, awayScore: 0, stage: 'GROUP_STAGE', group: 'G', day: 1 },
  { homeTeam: 'Brasilien',   awayTeam: 'Serbien',      homeScore: 2, awayScore: 0, stage: 'GROUP_STAGE', group: 'G', day: 1 },
  { homeTeam: 'Kamerun',     awayTeam: 'Serbien',      homeScore: 3, awayScore: 3, stage: 'GROUP_STAGE', group: 'G', day: 2 },
  { homeTeam: 'Brasilien',   awayTeam: 'Schweiz',      homeScore: 1, awayScore: 0, stage: 'GROUP_STAGE', group: 'G', day: 2 },
  { homeTeam: 'Kamerun',     awayTeam: 'Brasilien',    homeScore: 1, awayScore: 0, stage: 'GROUP_STAGE', group: 'G', day: 3 },
  { homeTeam: 'Serbien',     awayTeam: 'Schweiz',      homeScore: 2, awayScore: 3, stage: 'GROUP_STAGE', group: 'G', day: 3 },
  // Group H
  { homeTeam: 'Uruguay',     awayTeam: 'Südkorea',     homeScore: 0, awayScore: 0, stage: 'GROUP_STAGE', group: 'H', day: 1 },
  { homeTeam: 'Portugal',    awayTeam: 'Ghana',        homeScore: 3, awayScore: 2, stage: 'GROUP_STAGE', group: 'H', day: 1 },
  { homeTeam: 'Südkorea',    awayTeam: 'Ghana',        homeScore: 2, awayScore: 3, stage: 'GROUP_STAGE', group: 'H', day: 2 },
  { homeTeam: 'Portugal',    awayTeam: 'Uruguay',      homeScore: 2, awayScore: 0, stage: 'GROUP_STAGE', group: 'H', day: 2 },
  { homeTeam: 'Südkorea',    awayTeam: 'Portugal',     homeScore: 2, awayScore: 1, stage: 'GROUP_STAGE', group: 'H', day: 3 },
  { homeTeam: 'Ghana',       awayTeam: 'Uruguay',      homeScore: 0, awayScore: 2, stage: 'GROUP_STAGE', group: 'H', day: 3 },
  // Round of 16
  { homeTeam: 'Niederlande', awayTeam: 'USA',          homeScore: 3, awayScore: 1, stage: 'LAST_16' },
  { homeTeam: 'Argentinien', awayTeam: 'Australien',   homeScore: 2, awayScore: 1, stage: 'LAST_16' },
  { homeTeam: 'Frankreich',  awayTeam: 'Polen',        homeScore: 3, awayScore: 1, stage: 'LAST_16' },
  { homeTeam: 'England',     awayTeam: 'Senegal',      homeScore: 3, awayScore: 0, stage: 'LAST_16' },
  { homeTeam: 'Japan',       awayTeam: 'Kroatien',     homeScore: 1, awayScore: 1, stage: 'LAST_16' }, // AET, Croatia wins on pens
  { homeTeam: 'Brasilien',   awayTeam: 'Südkorea',     homeScore: 4, awayScore: 1, stage: 'LAST_16' },
  { homeTeam: 'Marokko',     awayTeam: 'Spanien',      homeScore: 0, awayScore: 0, stage: 'LAST_16' }, // AET, Morocco wins on pens
  { homeTeam: 'Portugal',    awayTeam: 'Schweiz',      homeScore: 6, awayScore: 1, stage: 'LAST_16' },
  // Quarter-finals
  { homeTeam: 'Kroatien',    awayTeam: 'Brasilien',    homeScore: 1, awayScore: 1, stage: 'QUARTER_FINALS' }, // AET, Croatia wins on pens
  { homeTeam: 'Niederlande', awayTeam: 'Argentinien',  homeScore: 2, awayScore: 2, stage: 'QUARTER_FINALS' }, // AET, Argentina wins on pens
  { homeTeam: 'Marokko',     awayTeam: 'Portugal',     homeScore: 1, awayScore: 0, stage: 'QUARTER_FINALS' },
  { homeTeam: 'Frankreich',  awayTeam: 'England',      homeScore: 2, awayScore: 1, stage: 'QUARTER_FINALS' },
  // Semi-finals
  { homeTeam: 'Argentinien', awayTeam: 'Kroatien',     homeScore: 3, awayScore: 0, stage: 'SEMI_FINALS' },
  { homeTeam: 'Frankreich',  awayTeam: 'Marokko',      homeScore: 2, awayScore: 0, stage: 'SEMI_FINALS' },
  // Third place
  { homeTeam: 'Kroatien',    awayTeam: 'Marokko',      homeScore: 2, awayScore: 1, stage: 'THIRD_PLACE' },
  // Final — AET score 3-3, Argentina wins 4-2 on pens
  { homeTeam: 'Argentinien', awayTeam: 'Frankreich',   homeScore: 3, awayScore: 3, stage: 'FINAL' },
];
