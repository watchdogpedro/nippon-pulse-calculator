export type Unit = 'lbf' | 'N';
export type Series = '130' | '180' | '260';
export type MatchStatus = 'underpowered' | 'match' | 'overpowered';

export interface Product {
  id: string;
  model: string;
  series: Series;
  forceN: number;
  statorDiameterMm: number;
  rodDiameterMm: number;
  rodMassG: number | null;
  strokeMm: number;
  statorLengthMm: number;
  operatingTempMinC: number;
  operatingTempMaxC: number;
  humidityMaxPct: number;
  radialLoadMaxN: number;
  magneticFluxMaxMT: number;
}

export interface MatchResult {
  status: MatchStatus;
  percentDiff: number;
}

export interface ChartRow {
  model: string;
  forceN: number;
  forceLbf: number;
  match: MatchResult;
  product: Product;
}

export interface Combination {
  count: number;
  product: Product;
  totalForceN: number;
  totalForceLbf: number;
  match: MatchResult;
  label: string;
}
