import { describe, it, expect } from 'vitest';
import { calculatePoints } from '../services/scoring';

describe('calculatePoints', () => {
  it('returns 3 for exact score', () => {
    expect(calculatePoints(2, 1, 2, 1)).toBe(3);
  });

  it('returns 3 for exact 0-0', () => {
    expect(calculatePoints(0, 0, 0, 0)).toBe(3);
  });

  it('returns 1 for correct home win outcome', () => {
    expect(calculatePoints(1, 0, 3, 0)).toBe(1);
  });

  it('returns 1 for correct away win outcome', () => {
    expect(calculatePoints(0, 2, 0, 4)).toBe(1);
  });

  it('returns 1 for correct draw outcome', () => {
    expect(calculatePoints(1, 1, 2, 2)).toBe(1);
  });

  it('returns 0 for wrong outcome', () => {
    expect(calculatePoints(1, 0, 0, 1)).toBe(0);
  });

  it('returns 0 when predicting draw but result is home win', () => {
    expect(calculatePoints(1, 1, 2, 0)).toBe(0);
  });
});
