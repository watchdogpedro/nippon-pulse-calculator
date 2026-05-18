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
      <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-400 mb-6">
        Combined Units (2× and 3× configurations) — click a bar to see full specs
      </h2>
      <ResponsiveContainer width="100%" height={combinations.length * 36 + 50}>
        <BarChart
          layout="vertical"
          data={displayCombos}
          margin={{ top: 10, right: 60, left: 10, bottom: 20 }}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onClick={(data: any) => {
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
            width={195}
            tick={{ fontSize: 11, fill: '#1A1A1A' }}
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
                position: 'right',
                fill: '#CC0000',
                fontSize: 12,
                fontWeight: 700,
              }}
            />
          )}
          <Tooltip
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            formatter={(value: any) =>
              unit === 'lbf'
                ? [`${(Number(value) * 0.224809).toFixed(3)} lbf`, 'Total Force']
                : [`${Number(value).toFixed(2)} N`, 'Total Force']
            }
            cursor={{ fill: 'rgba(204,0,0,0.06)' }}
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
