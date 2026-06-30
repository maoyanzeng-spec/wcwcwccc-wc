// Maps 3-letter football codes to ISO 3166-1 alpha-2 codes for flagcdn.com
const ISO2: Record<string, string> = {
  ALG: 'dz', ARG: 'ar', AUS: 'au', AUT: 'at',
  BEL: 'be', BIH: 'ba', BRA: 'br',
  CAN: 'ca', CIV: 'ci', CMR: 'cm', COD: 'cd', COL: 'co',
  CPV: 'cv', CRC: 'cr', CRO: 'hr', CUW: 'cw', CZE: 'cz',
  DEN: 'dk',
  ECU: 'ec', EGY: 'eg', ENG: 'gb-eng', ESP: 'es',
  FRA: 'fr',
  GER: 'de', GHA: 'gh',
  HAI: 'ht',
  IRN: 'ir', IRQ: 'iq',
  JOR: 'jo', JPN: 'jp',
  KOR: 'kr', KSA: 'sa',
  MAR: 'ma', MEX: 'mx',
  NED: 'nl', NOR: 'no', NZL: 'nz',
  PAN: 'pa', PAR: 'py', POL: 'pl', POR: 'pt',
  QAT: 'qa',
  RSA: 'za',
  SCO: 'gb-sct', SEN: 'sn', SRB: 'rs', SUI: 'ch', SWE: 'se',
  TUN: 'tn', TUR: 'tr',
  URU: 'uy', USA: 'us', UZB: 'uz',
  WAL: 'gb-wls',
};

export function flagUrl(code?: string | null): string | null {
  if (!code) return null;
  const iso = ISO2[code];
  return iso ? `https://flagcdn.com/w40/${iso}.png` : null;
}
