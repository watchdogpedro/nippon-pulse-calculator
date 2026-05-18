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
