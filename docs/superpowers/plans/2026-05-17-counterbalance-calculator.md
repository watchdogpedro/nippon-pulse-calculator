# Counterbalance Calculator Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Next.js Vercel app where customers enter a force (lbf or N) and see a live horizontal bar chart of all 13 Nippon Pulse GLS/GLR counterbalance models with match highlighting, click-to-expand spec cards, and a combinations chart for forces above the single-unit max.

**Architecture:** Single-page Next.js 14 app. Pure calculator logic in `lib/calculator.ts`. Product data in `data/products.ts`. Four UI components stacked vertically: Header → ForceInput → RangeChart → CombinationsChart. SpecCard renders inline below the clicked bar row.

**Tech Stack:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Recharts

---

## File Map

| File | Responsibility |
|------|---------------|
| `src/types/index.ts` | Shared TypeScript interfaces |
| `src/data/products.ts` | All 13 product records (hard-coded) |
| `src/lib/calculator.ts` | Conversion, match status, combination generation |
| `src/lib/calculator.test.ts` | Unit tests for calculator functions |
| `src/components/Header.tsx` | NPA red banner + title |
| `src/components/ForceInput.tsx` | Number input + lbf/N toggle |
| `src/components/RangeChart.tsx` | Recharts horizontal bar chart + SpecCard on click |
| `src/components/SpecCard.tsx` | Full spec display card |
| `src/components/CombinationsChart.tsx` | 2× and 3× combination chart |
| `src/app/page.tsx` | Page assembly, state management |
| `src/app/layout.tsx` | Root layout, metadata |
| `src/app/globals.css` | Tailwind directives |

---

## Task 1: Scaffold Project

**Files:**
- Create: `/Users/pauldenman/nippon-pulse-calculator/` (full project)

- [ ] **Step 1: Create Next.js app**

```bash
cd /Users/pauldenman
npx create-next-app@14 nippon-pulse-calculator \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*" \
  --no-git
```

- [ ] **Step 2: Install Recharts and Vitest**

```bash
cd /Users/pauldenman/nippon-pulse-calculator
npm install recharts
npm install -D vitest @vitest/ui
```

- [ ] **Step 3: Add vitest config to package.json**

Add to `package.json` scripts:
```json
"test": "vitest run",
"test:ui": "vitest --ui"
```

- [ ] **Step 4: Init git and commit scaffold**

```bash
cd /Users/pauldenman/nippon-pulse-calculator
git init
git add .
git commit -m "chore: scaffold Next.js 14 + Tailwind + Recharts"
```

---

## Task 2: Types

**Files:**
- Create: `src/types/index.ts`

- [ ] **Step 1: Write types**

```typescript
// src/types/index.ts
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
```

- [ ] **Step 2: Commit**

```bash
git add src/types/index.ts
git commit -m "feat: add TypeScript types"
```

---

## Task 3: Product Data

**Files:**
- Create: `src/data/products.ts`

- [ ] **Step 1: Write product records**

```typescript
// src/data/products.ts
import { Product } from '@/types';

export const PRODUCTS: Product[] = [
  {
    id: 'gls130-glr035',
    model: 'GLS-130/GLR-035',
    series: '130',
    forceN: 2.0,
    statorDiameterMm: 13,
    rodDiameterMm: 3.5,
    rodMassG: 13,
    strokeMm: 40,
    statorLengthMm: 65.5,
    operatingTempMinC: 0,
    operatingTempMaxC: 40,
    humidityMaxPct: 85,
    radialLoadMaxN: 60,
    magneticFluxMaxMT: 30,
  },
  {
    id: 'gls130-glr040',
    model: 'GLS-130/GLR-040',
    series: '130',
    forceN: 2.66,
    statorDiameterMm: 13,
    rodDiameterMm: 4.0,
    rodMassG: 15,
    strokeMm: 40,
    statorLengthMm: 65.5,
    operatingTempMinC: 0,
    operatingTempMaxC: 40,
    humidityMaxPct: 85,
    radialLoadMaxN: 60,
    magneticFluxMaxMT: 30,
  },
  {
    id: 'gls130-glr045',
    model: 'GLS-130/GLR-045',
    series: '130',
    forceN: 3.7,
    statorDiameterMm: 13,
    rodDiameterMm: 4.5,
    rodMassG: 17,
    strokeMm: 40,
    statorLengthMm: 65.5,
    operatingTempMinC: 0,
    operatingTempMaxC: 40,
    humidityMaxPct: 85,
    radialLoadMaxN: 60,
    magneticFluxMaxMT: 30,
  },
  {
    id: 'gls180-glr075',
    model: 'GLS-180/GLR-075',
    series: '180',
    forceN: 4.9,
    statorDiameterMm: 18,
    rodDiameterMm: 7.5,
    rodMassG: 53,
    strokeMm: 40,
    statorLengthMm: 65.5,
    operatingTempMinC: 0,
    operatingTempMaxC: 40,
    humidityMaxPct: 85,
    radialLoadMaxN: 60,
    magneticFluxMaxMT: 30,
  },
  {
    id: 'gls180-glr080',
    model: 'GLS-180/GLR-080',
    series: '180',
    forceN: 6.1,
    statorDiameterMm: 18,
    rodDiameterMm: 8.0,
    rodMassG: 56,
    strokeMm: 40,
    statorLengthMm: 65.5,
    operatingTempMinC: 0,
    operatingTempMaxC: 40,
    humidityMaxPct: 85,
    radialLoadMaxN: 60,
    magneticFluxMaxMT: 30,
  },
  {
    id: 'gls180-glr085',
    model: 'GLS-180/GLR-085',
    series: '180',
    forceN: 7.3,
    statorDiameterMm: 18,
    rodDiameterMm: 8.5,
    rodMassG: null,
    strokeMm: 40,
    statorLengthMm: 65.5,
    operatingTempMinC: 0,
    operatingTempMaxC: 40,
    humidityMaxPct: 85,
    radialLoadMaxN: 60,
    magneticFluxMaxMT: 30,
  },
  {
    id: 'gls180-glr090',
    model: 'GLS-180/GLR-090',
    series: '180',
    forceN: 9.0,
    statorDiameterMm: 18,
    rodDiameterMm: 9.0,
    rodMassG: null,
    strokeMm: 40,
    statorLengthMm: 65.5,
    operatingTempMinC: 0,
    operatingTempMaxC: 40,
    humidityMaxPct: 85,
    radialLoadMaxN: 60,
    magneticFluxMaxMT: 30,
  },
  {
    id: 'gls180-glr095',
    model: 'GLS-180/GLR-095',
    series: '180',
    forceN: 10.5,
    statorDiameterMm: 18,
    rodDiameterMm: 9.5,
    rodMassG: null,
    strokeMm: 40,
    statorLengthMm: 65.5,
    operatingTempMinC: 0,
    operatingTempMaxC: 40,
    humidityMaxPct: 85,
    radialLoadMaxN: 60,
    magneticFluxMaxMT: 30,
  },
  {
    id: 'gls260-glr090',
    model: 'GLS-260/GLR-090',
    series: '260',
    forceN: 13.5,
    statorDiameterMm: 26,
    rodDiameterMm: 9.0,
    rodMassG: null,
    strokeMm: 40,
    statorLengthMm: 75.5,
    operatingTempMinC: 0,
    operatingTempMaxC: 40,
    humidityMaxPct: 85,
    radialLoadMaxN: 60,
    magneticFluxMaxMT: 30,
  },
  {
    id: 'gls260-glr095',
    model: 'GLS-260/GLR-095',
    series: '260',
    forceN: 16.8,
    statorDiameterMm: 26,
    rodDiameterMm: 9.5,
    rodMassG: null,
    strokeMm: 40,
    statorLengthMm: 75.5,
    operatingTempMinC: 0,
    operatingTempMaxC: 40,
    humidityMaxPct: 85,
    radialLoadMaxN: 60,
    magneticFluxMaxMT: 30,
  },
  {
    id: 'gls260-glr100',
    model: 'GLS-260/GLR-100',
    series: '260',
    forceN: 19.6,
    statorDiameterMm: 26,
    rodDiameterMm: 10.0,
    rodMassG: 92,
    strokeMm: 40,
    statorLengthMm: 75.5,
    operatingTempMinC: 0,
    operatingTempMaxC: 40,
    humidityMaxPct: 85,
    radialLoadMaxN: 60,
    magneticFluxMaxMT: 30,
  },
  {
    id: 'gls260-glr105',
    model: 'GLS-260/GLR-105',
    series: '260',
    forceN: 22.2,
    statorDiameterMm: 26,
    rodDiameterMm: 10.5,
    rodMassG: null,
    strokeMm: 40,
    statorLengthMm: 75.5,
    operatingTempMinC: 0,
    operatingTempMaxC: 40,
    humidityMaxPct: 85,
    radialLoadMaxN: 60,
    magneticFluxMaxMT: 30,
  },
  {
    id: 'gls260-glr110',
    model: 'GLS-260/GLR-110',
    series: '260',
    forceN: 25.7,
    statorDiameterMm: 26,
    rodDiameterMm: 11.0,
    rodMassG: null,
    strokeMm: 40,
    statorLengthMm: 75.5,
    operatingTempMinC: 0,
    operatingTempMaxC: 40,
    humidityMaxPct: 85,
    radialLoadMaxN: 60,
    magneticFluxMaxMT: 30,
  },
];
```

- [ ] **Step 2: Commit**

```bash
git add src/data/products.ts
git commit -m "feat: add all 13 GLS/GLR product records"
```

---

## Task 4: Calculator Logic + Tests

**Files:**
- Create: `src/lib/calculator.ts`
- Create: `src/lib/calculator.test.ts`

- [ ] **Step 1: Write failing tests first**

```typescript
// src/lib/calculator.test.ts
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
```

- [ ] **Step 2: Run tests — expect all to fail**

```bash
cd /Users/pauldenman/nippon-pulse-calculator
npm test
```
Expected: all fail with "cannot find module './calculator'"

- [ ] **Step 3: Implement calculator**

```typescript
// src/lib/calculator.ts
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
```

- [ ] **Step 4: Run tests — expect all to pass**

```bash
npm test
```
Expected: all pass

- [ ] **Step 5: Commit**

```bash
git add src/lib/calculator.ts src/lib/calculator.test.ts
git commit -m "feat: calculator logic with unit tests"
```

---

## Task 5: Header Component

**Files:**
- Create: `src/components/Header.tsx`

- [ ] **Step 1: Write component**

```tsx
// src/components/Header.tsx
export default function Header() {
  return (
    <header className="bg-[#CC0000] text-white px-6 py-5">
      <div className="max-w-5xl mx-auto flex items-center gap-4">
        <div className="text-white font-bold text-xl tracking-tight">
          NIPPON PULSE
        </div>
        <div className="w-px h-8 bg-white/40" />
        <div>
          <h1 className="text-lg font-semibold leading-tight">
            Magnetic Counterbalance Calculator
          </h1>
          <p className="text-white/75 text-sm">
            Find the right GLS/GLR unit for your Z-axis force requirement
          </p>
        </div>
      </div>
    </header>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Header.tsx
git commit -m "feat: Header component"
```

---

## Task 6: ForceInput Component

**Files:**
- Create: `src/components/ForceInput.tsx`

- [ ] **Step 1: Write component**

```tsx
// src/components/ForceInput.tsx
'use client';
import { Unit } from '@/types';

interface ForceInputProps {
  value: string;
  unit: Unit;
  onChange: (value: string) => void;
  onUnitChange: (unit: Unit) => void;
}

export default function ForceInput({ value, unit, onChange, onUnitChange }: ForceInputProps) {
  return (
    <div className="flex flex-col items-center gap-3 py-10 bg-white">
      <label className="text-sm font-medium text-gray-500 uppercase tracking-widest">
        Required Counterbalance Force
      </label>
      <div className="flex items-center gap-3">
        <input
          type="number"
          min="0"
          step="0.01"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="0.00"
          className="w-44 text-5xl font-bold text-center border-b-4 border-[#CC0000] outline-none py-2 text-gray-900 placeholder:text-gray-200 bg-transparent"
        />
        <div className="flex flex-col gap-1">
          {(['lbf', 'N'] as Unit[]).map(u => (
            <button
              key={u}
              onClick={() => onUnitChange(u)}
              className={`px-3 py-1 rounded text-sm font-semibold transition-colors ${
                unit === u
                  ? 'bg-[#CC0000] text-white'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {u}
            </button>
          ))}
        </div>
      </div>
      {value && (
        <p className="text-sm text-gray-400">
          {unit === 'lbf'
            ? `= ${(parseFloat(value) * 4.44822).toFixed(2)} N`
            : `= ${(parseFloat(value) * 0.224809).toFixed(3)} lbf`}
        </p>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ForceInput.tsx
git commit -m "feat: ForceInput component with lbf/N toggle"
```

---

## Task 7: SpecCard Component

**Files:**
- Create: `src/components/SpecCard.tsx`

- [ ] **Step 1: Write component**

```tsx
// src/components/SpecCard.tsx
import { Product } from '@/types';
import { toLbf } from '@/lib/calculator';

interface SpecCardProps {
  product: Product;
  count?: number;
}

export default function SpecCard({ product: p, count = 1 }: SpecCardProps) {
  const totalForceN = p.forceN * count;
  const totalForceLbf = toLbf(totalForceN);

  return (
    <div className="bg-[#CC0000] text-white rounded-lg p-6 mt-2 shadow-lg">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-widest text-white/60 mb-1">
            Part Number
          </div>
          <div className="text-2xl font-bold">
            {count > 1 ? `${count}× ${p.model}` : p.model}
          </div>
        </div>
        <a
          href="https://www.nipponpulse.com/contact/"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white text-[#CC0000] font-bold text-sm px-4 py-2 rounded hover:bg-gray-100 transition-colors"
        >
          Request Quote →
        </a>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
        <Spec label="Counter Force" value={`${totalForceN.toFixed(2)} N / ${totalForceLbf.toFixed(3)} lbf`} />
        <Spec label="Stator Ø" value={`${p.statorDiameterMm} mm`} />
        <Spec label="Rod Ø" value={`${p.rodDiameterMm} mm`} />
        <Spec label="Rod Mass" value={p.rodMassG !== null ? `${p.rodMassG} g` : '—'} />
        <Spec label="Stroke" value={`${p.strokeMm} mm`} />
        <Spec label="Stator Length" value={`${p.statorLengthMm} mm`} />
        <Spec label="Operating Temp" value={`${p.operatingTempMinC}–${p.operatingTempMaxC}°C`} />
        <Spec label="Humidity" value={`≤${p.humidityMaxPct}% RH`} />
        <Spec label="Radial Load" value={`< ${p.radialLoadMaxN} N`} />
        <Spec label="Magnetic Flux" value={`≤ ${p.magneticFluxMaxMT} mT`} />
      </div>
    </div>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-white/60 text-xs uppercase tracking-wide">{label}</div>
      <div className="font-semibold">{value}</div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/SpecCard.tsx
git commit -m "feat: SpecCard component"
```

---

## Task 8: RangeChart Component

**Files:**
- Create: `src/components/RangeChart.tsx`

- [ ] **Step 1: Write component**

```tsx
// src/components/RangeChart.tsx
'use client';
import { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, ReferenceLine,
  Cell, ResponsiveContainer, Tooltip,
} from 'recharts';
import { ChartRow, Unit } from '@/types';
import SpecCard from './SpecCard';

interface RangeChartProps {
  rows: ChartRow[];
  targetForceN: number;
  unit: Unit;
}

function barColor(status: string, selected: boolean): string {
  if (selected) return '#990000';
  if (status === 'match') return '#CC0000';
  if (status === 'underpowered') return '#9CA3AF';
  return '#D1D5DB';
}

export default function RangeChart({ rows, targetForceN, unit }: RangeChartProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const maxForce = Math.max(...rows.map(r => r.forceN)) * 1.15;
  const selectedRow = rows.find(r => r.product.id === selectedId) ?? null;

  const displayRows = [...rows].reverse();

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-400 mb-4">
        Single Unit Range
      </h2>
      <ResponsiveContainer width="100%" height={rows.length * 44 + 40}>
        <BarChart
          layout="vertical"
          data={displayRows}
          margin={{ top: 0, right: 40, left: 10, bottom: 20 }}
          onClick={data => {
            if (data?.activePayload?.[0]) {
              const row = data.activePayload[0].payload as ChartRow;
              setSelectedId(prev => prev === row.product.id ? null : row.product.id);
            }
          }}
        >
          <XAxis
            type="number"
            domain={[0, maxForce]}
            tickFormatter={v =>
              unit === 'lbf'
                ? `${(v * 0.224809).toFixed(2)} lbf`
                : `${v.toFixed(1)} N`
            }
            tick={{ fontSize: 11, fill: '#6B7280' }}
          />
          <YAxis
            type="category"
            dataKey="model"
            width={160}
            tick={{ fontSize: 12, fill: '#1A1A1A', fontWeight: 600 }}
          />
          {targetForceN > 0 && (
            <ReferenceLine
              x={targetForceN}
              stroke="#CC0000"
              strokeWidth={3}
              strokeDasharray="6 3"
              label={{
                value: unit === 'lbf'
                  ? `${(targetForceN * 0.224809).toFixed(2)} lbf`
                  : `${targetForceN.toFixed(1)} N`,
                position: 'top',
                fill: '#CC0000',
                fontSize: 12,
                fontWeight: 700,
              }}
            />
          )}
          <Tooltip
            formatter={(value: number) =>
              unit === 'lbf'
                ? [`${(value * 0.224809).toFixed(3)} lbf`, 'Force']
                : [`${value.toFixed(2)} N`, 'Force']
            }
            cursor={{ fill: 'rgba(204,0,0,0.05)' }}
          />
          <Bar dataKey="forceN" radius={[0, 4, 4, 0]} cursor="pointer">
            {displayRows.map(row => (
              <Cell
                key={row.product.id}
                fill={barColor(row.match.status, selectedId === row.product.id)}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {selectedRow && (
        <SpecCard product={selectedRow.product} />
      )}

      <div className="flex gap-6 mt-4 text-xs text-gray-500">
        <Legend color="#CC0000" label="Match (±20%)" />
        <Legend color="#9CA3AF" label="Underpowered" />
        <Legend color="#D1D5DB" label="Overpowered" />
        {targetForceN > 0 && <Legend color="#CC0000" label="Your target" dashed />}
      </div>
    </div>
  );
}

function Legend({ color, label, dashed }: { color: string; label: string; dashed?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className="w-8 h-3 rounded"
        style={{
          backgroundColor: dashed ? 'transparent' : color,
          border: dashed ? `2px dashed ${color}` : 'none',
        }}
      />
      <span>{label}</span>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/RangeChart.tsx
git commit -m "feat: RangeChart horizontal bar chart with click-to-expand"
```

---

## Task 9: CombinationsChart Component

**Files:**
- Create: `src/components/CombinationsChart.tsx`

- [ ] **Step 1: Write component**

```tsx
// src/components/CombinationsChart.tsx
'use client';
import { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, ReferenceLine,
  Cell, ResponsiveContainer, Tooltip,
} from 'recharts';
import { Combination, Unit } from '@/types';
import SpecCard from './SpecCard';

interface CombinationsChartProps {
  combinations: Combination[];
  targetForceN: number;
  unit: Unit;
}

function barColor(status: string, selected: boolean): string {
  if (selected) return '#990000';
  if (status === 'match') return '#CC0000';
  if (status === 'underpowered') return '#9CA3AF';
  return '#D1D5DB';
}

export default function CombinationsChart({ combinations, targetForceN, unit }: CombinationsChartProps) {
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);

  const maxForce = Math.max(...combinations.map(c => c.totalForceN)) * 1.1;
  const selectedCombo = combinations.find(c => c.label === selectedLabel) ?? null;

  const displayCombos = [...combinations].reverse();

  return (
    <div className="max-w-5xl mx-auto px-4 pb-12">
      <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-400 mb-4">
        Combined Units (2× and 3× configurations)
      </h2>
      <ResponsiveContainer width="100%" height={combinations.length * 36 + 40}>
        <BarChart
          layout="vertical"
          data={displayCombos}
          margin={{ top: 0, right: 40, left: 10, bottom: 20 }}
          onClick={data => {
            if (data?.activePayload?.[0]) {
              const combo = data.activePayload[0].payload as Combination;
              setSelectedLabel(prev => prev === combo.label ? null : combo.label);
            }
          }}
        >
          <XAxis
            type="number"
            domain={[0, maxForce]}
            tickFormatter={v =>
              unit === 'lbf'
                ? `${(v * 0.224809).toFixed(2)} lbf`
                : `${v.toFixed(1)} N`
            }
            tick={{ fontSize: 11, fill: '#6B7280' }}
          />
          <YAxis
            type="category"
            dataKey="label"
            width={190}
            tick={{ fontSize: 11, fill: '#1A1A1A' }}
          />
          {targetForceN > 0 && (
            <ReferenceLine
              x={targetForceN}
              stroke="#CC0000"
              strokeWidth={3}
              strokeDasharray="6 3"
            />
          )}
          <Tooltip
            formatter={(value: number) =>
              unit === 'lbf'
                ? [`${(value * 0.224809).toFixed(3)} lbf`, 'Total Force']
                : [`${value.toFixed(2)} N`, 'Total Force']
            }
            cursor={{ fill: 'rgba(204,0,0,0.05)' }}
          />
          <Bar dataKey="totalForceN" radius={[0, 4, 4, 0]} cursor="pointer">
            {displayCombos.map(combo => (
              <Cell
                key={combo.label}
                fill={barColor(combo.match.status, selectedLabel === combo.label)}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {selectedCombo && (
        <SpecCard product={selectedCombo.product} count={selectedCombo.count} />
      )}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/CombinationsChart.tsx
git commit -m "feat: CombinationsChart for 2x/3x unit combinations"
```

---

## Task 10: Page Assembly

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/app/layout.tsx`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Update globals.css**

```css
/* src/app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  background-color: #F9F9F9;
}
```

- [ ] **Step 2: Update layout.tsx**

```tsx
// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Magnetic Counterbalance Calculator | Nippon Pulse',
  description: 'Find the right GLS/GLR magnetic counterbalance unit for your Z-axis force requirement.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
```

- [ ] **Step 3: Write page.tsx**

```tsx
// src/app/page.tsx
'use client';
import { useState, useMemo } from 'react';
import Header from '@/components/Header';
import ForceInput from '@/components/ForceInput';
import RangeChart from '@/components/RangeChart';
import CombinationsChart from '@/components/CombinationsChart';
import { PRODUCTS } from '@/data/products';
import { buildChartRows, buildCombinations, toNewtons } from '@/lib/calculator';
import { Unit } from '@/types';

const MAX_SINGLE_N = 25.7;

export default function Page() {
  const [inputValue, setInputValue] = useState('');
  const [unit, setUnit] = useState<Unit>('lbf');

  const targetForceN = useMemo(() => {
    const v = parseFloat(inputValue);
    if (isNaN(v) || v <= 0) return 0;
    return unit === 'lbf' ? toNewtons(v) : v;
  }, [inputValue, unit]);

  const chartRows = useMemo(() => buildChartRows(PRODUCTS, targetForceN), [targetForceN]);
  const combinations = useMemo(() => buildCombinations(PRODUCTS, targetForceN), [targetForceN]);

  const showCombinations = targetForceN > MAX_SINGLE_N;

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      <ForceInput
        value={inputValue}
        unit={unit}
        onChange={setInputValue}
        onUnitChange={setUnit}
      />
      <div className="border-t border-gray-200">
        <RangeChart rows={chartRows} targetForceN={targetForceN} unit={unit} />
      </div>
      {showCombinations && (
        <div className="border-t border-gray-200 bg-white">
          <div className="max-w-5xl mx-auto px-4 pt-6">
            <p className="text-sm text-[#CC0000] font-medium mb-2">
              Your target force exceeds any single unit — showing combined configurations below.
            </p>
          </div>
          <CombinationsChart
            combinations={combinations}
            targetForceN={targetForceN}
            unit={unit}
          />
        </div>
      )}
    </main>
  );
}
```

- [ ] **Step 4: Run dev server to verify**

```bash
npm run dev
```
Open http://localhost:3000 — enter "2" lbf, verify bars appear with red reference line. Click a bar, verify spec card expands. Enter "10" lbf (> 5.78 lbf / 25.7N), verify combinations section appears.

- [ ] **Step 5: Commit**

```bash
git add src/app/page.tsx src/app/layout.tsx src/app/globals.css
git commit -m "feat: assemble full page with state management"
```

---

## Task 11: Deploy to Vercel

- [ ] **Step 1: Push to GitHub**

```bash
gh repo create nippon-pulse-calculator --public --source=. --remote=origin --push
```

- [ ] **Step 2: Deploy to Vercel**

```bash
vercel --prod --yes
```

- [ ] **Step 3: Confirm live URL**

Open the Vercel URL, test with a few force values, verify chart and spec cards work.
