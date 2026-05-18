'use client';
import { useState, useMemo, useEffect } from 'react';
import Header from '@/components/Header';
import SpaceHero from '@/components/SpaceHero';
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

  useEffect(() => {
    const sendHeight = () => {
      window.parent.postMessage(
        { type: 'npa-calc-height', height: document.documentElement.scrollHeight },
        '*'
      );
    };
    sendHeight();
    const observer = new ResizeObserver(sendHeight);
    observer.observe(document.documentElement);
    return () => observer.disconnect();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      <SpaceHero />
      <ForceInput
        value={inputValue}
        unit={unit}
        onChange={setInputValue}
        onUnitChange={setUnit}
      />
      <div className="border-t border-gray-200 bg-white">
        <RangeChart rows={chartRows} targetForceN={targetForceN} unit={unit} />
      </div>
      {showCombinations && (
        <div className="border-t border-gray-200 bg-white mt-4">
          <div className="max-w-5xl mx-auto px-4 pt-6">
            <p className="text-sm text-[#CC0000] font-semibold mb-2">
              Your target exceeds any single unit — showing combined configurations below.
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
