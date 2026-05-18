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
      <div className="flex items-start justify-between mb-5">
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
          className="bg-white text-[#CC0000] font-bold text-sm px-4 py-2 rounded hover:bg-red-50 transition-colors whitespace-nowrap"
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
      <div className="text-white/60 text-xs uppercase tracking-wide mb-0.5">{label}</div>
      <div className="font-semibold">{value}</div>
    </div>
  );
}
