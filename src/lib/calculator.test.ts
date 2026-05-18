import { describe, it, expect } from 'vitest';
import { toLbf, toNewtons, getMatchResult, buildChartRows, buildCombinations } from './calculator';
import { PRODUCTS } from '@/data/products';

describe('unit conversion', () => {
  it('converts N to lbf', () => {
    expect(toLbf(4.44822)).toBeCloseTo(1.0, 3);
  });
  it('converts lbf to N', () => {
    expect(toNewtons(1.0)).toBeCloseTo(4.44822, 3);
  });
  it('round-trips', () => {
    expect(toLbf(toNewtons(5.0))).toBeCloseTo(5.0, 5);
  });
});

describe('getMatchResult', () => {
  it('returns match when product force equals target', () => {
    expect(getMatchResult(10, 10).status).toBe('match');
  });
  it('returns match when within 20% above', () => {
    expect(getMatchResult(12, 10).status).toBe('match');
  });
  it('returns match when within 20% below', () => {
    expect(getMatchResult(8.1, 10).status).toBe('match');
  });
  it('returns underpowered when more than 20% below', () => {
    expect(getMatchResult(7.9, 10).status).toBe('underpowered');
  });
  it('returns overpowered when more than 20% above', () => {
    expect(getMatchResult(12.1, 10).status).toBe('overpowered');
  });
  it('returns match when target is 0', () => {
    expect(getMatchResult(5, 0).status).toBe('match');
  });
});

describe('buildChartRows', () => {
  it('returns 13 rows for all products', () => {
    expect(buildChartRows(PRODUCTS, 10).length).toBe(13);
  });
  it('includes forceLbf on each row', () => {
    const rows = buildChartRows(PRODUCTS, 10);
    expect(rows[0].forceLbf).toBeCloseTo(toLbf(rows[0].forceN), 3);
  });
});

describe('buildCombinations', () => {
  it('returns 2x and 3x entries for each product', () => {
    const combos = buildCombinations(PRODUCTS, 50);
    expect(combos.length).toBe(PRODUCTS.length * 2);
  });
  it('2x entry has double the force', () => {
    const combos = buildCombinations(PRODUCTS, 50);
    const first = combos.find(c => c.count === 2 && c.product.id === 'gls130-glr035');
    expect(first!.totalForceN).toBeCloseTo(4.0, 3);
  });
});
