import { Product, MatchResult, ChartRow, Combination } from '@/types';

const N_TO_LBF = 0.224809;
const LBF_TO_N = 4.44822;

export function toLbf(n: number): number {
  return n * N_TO_LBF;
}

export function toNewtons(lbf: number): number {
  return lbf * LBF_TO_N;
}

export function getMatchResult(productForceN: number, targetForceN: number): MatchResult {
  if (targetForceN === 0) return { status: 'match', percentDiff: 0 };
  const percentDiff = ((productForceN - targetForceN) / targetForceN) * 100;
  if (percentDiff < -20) return { status: 'underpowered', percentDiff };
  if (percentDiff > 20) return { status: 'overpowered', percentDiff };
  return { status: 'match', percentDiff };
}

export function buildChartRows(products: Product[], targetForceN: number): ChartRow[] {
  return products.map(p => ({
    model: p.model,
    forceN: p.forceN,
    forceLbf: toLbf(p.forceN),
    match: getMatchResult(p.forceN, targetForceN),
    product: p,
  }));
}

export function buildCombinations(products: Product[], targetForceN: number): Combination[] {
  const combos: Combination[] = [];
  for (const product of products) {
    for (const count of [2, 3]) {
      const totalForceN = product.forceN * count;
      combos.push({
        count,
        product,
        totalForceN,
        totalForceLbf: toLbf(totalForceN),
        match: getMatchResult(totalForceN, targetForceN),
        label: `${count}× ${product.model}`,
      });
    }
  }
  return combos.sort((a, b) => a.totalForceN - b.totalForceN);
}
