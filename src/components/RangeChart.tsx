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
      <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-400 mb-6">
        Single Unit Range — click a bar to see full specs
      </h2>
      <ResponsiveContainer width="100%" height={rows.length * 46 + 50}>
        <BarChart
          layout="vertical"
          data={displayRows}
          margin={{ top: 10, right: 60, left: 10, bottom: 20 }}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onClick={(data: any) => {
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
            width={165}
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
                ? [`${(Number(value) * 0.224809).toFixed(3)} lbf`, 'Counter Force']
                : [`${Number(value).toFixed(2)} N`, 'Counter Force']
            }
            cursor={{ fill: 'rgba(204,0,0,0.06)' }}
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

      <div className="flex flex-wrap gap-6 mt-5 text-xs text-gray-500">
        <Legend color="#CC0000" label="Match (±20% of target)" />
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
