export default function SpaceHero() {
  return (
    <div
      style={{
        background: '#060608',
        position: 'relative',
        overflow: 'hidden',
        minHeight: 'clamp(200px, 30vw, 400px)',
      }}
    >
      {/* Subtle engineering grid */}
      <svg
        aria-hidden
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="hgrid" width="56" height="56" patternUnits="userSpaceOnUse">
            <path d="M 56 0 L 0 0 0 56" fill="none" stroke="#0e0e14" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hgrid)" />
      </svg>

      {/* NPA red left accent */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: '3px',
          background: '#CC0000',
        }}
      />

      <div
        style={{
          position: 'relative',
          maxWidth: '80rem',
          margin: '0 auto',
          padding: '0 2rem',
          display: 'flex',
          alignItems: 'center',
          minHeight: 'clamp(200px, 30vw, 400px)',
          gap: '3rem',
        }}
      >
        {/* Text */}
        <div style={{ flex: 1, paddingTop: '2.5rem', paddingBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <span style={{ width: '20px', height: '2px', background: '#CC0000', display: 'inline-block', flexShrink: 0 }} />
            <span
              style={{
                color: '#CC0000',
                fontSize: '13px',
                letterSpacing: '0.22em',
                fontWeight: 700,
                textTransform: 'uppercase',
                fontFamily: 'monospace',
              }}
            >
              World&apos;s First — Nippon Pulse
            </span>
          </div>

          <h1
            style={{
              color: '#ffffff',
              fontSize: 'clamp(26px, 3.8vw, 50px)',
              fontWeight: 800,
              lineHeight: 1.06,
              letterSpacing: '-0.02em',
              margin: '0 0 14px 0',
            }}
          >
            Linear Magnetic
            <br />
            Counterbalance
          </h1>

          <div style={{ width: '40px', height: '2px', background: '#CC0000', marginBottom: '14px' }} />

          <p
            style={{
              color: '#ffffff',
              fontSize: 'clamp(12px, 1.3vw, 14px)',
              lineHeight: 1.65,
              maxWidth: '380px',
              margin: '0 0 20px 0',
              fontFamily: 'system-ui, sans-serif',
            }}
          >
            Contactless counterforce using permanent magnet technology.
            No friction. No wear. No power consumption.
          </p>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {[
              ['Force Range', '2.0 – 25.7 N'],
              ['Contact', 'Zero'],
              ['Wear', 'Zero'],
            ].map(([label, val]) => (
              <div
                key={label}
                style={{
                  background: '#0c0c11',
                  border: '1px solid #1c1c28',
                  borderRadius: '3px',
                  padding: '6px 12px',
                }}
              >
                <div
                  style={{
                    color: '#ffffff',
                    fontSize: '8px',
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    fontFamily: 'monospace',
                    marginBottom: '2px',
                  }}
                >
                  {label}
                </div>
                <div
                  style={{
                    color: '#ffffff',
                    fontSize: '13px',
                    fontWeight: 600,
                    fontFamily: 'monospace',
                    letterSpacing: '0.04em',
                  }}
                >
                  {val}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Engineering schematic — hidden on mobile, visible md+ */}
        <div
          className="hero-diagram"
          style={{ flexShrink: 0, width: 'clamp(140px, 18vw, 240px)', display: 'none' }}
        >
          <svg
            viewBox="0 0 220 360"
            xmlns="http://www.w3.org/2000/svg"
            style={{ width: '100%', height: 'auto', display: 'block' }}
          >
            <defs>
              <linearGradient id="rodGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#111827" />
                <stop offset="30%" stopColor="#4b5563" />
                <stop offset="52%" stopColor="#d1d5db" />
                <stop offset="72%" stopColor="#4b5563" />
                <stop offset="100%" stopColor="#111827" />
              </linearGradient>
              <marker id="arR" markerWidth="7" markerHeight="6" refX="6" refY="3" orient="auto">
                <polygon points="0 0, 7 3, 0 6" fill="#CC0000" />
              </marker>
              <marker id="arG" markerWidth="7" markerHeight="6" refX="6" refY="3" orient="auto">
                <polygon points="0 0, 7 3, 0 6" fill="#6b7280" />
              </marker>
            </defs>

            {/* Center axis */}
            <line x1="110" y1="0" x2="110" y2="360" stroke="#18181f" strokeWidth="1" strokeDasharray="4 7" />

            {/* Rod / shaft */}
            <rect x="101" y="0" width="18" height="360" fill="url(#rodGrad)" />

            {/* Stator housing — proportioned to GLS-260 (75.5mm × 26mm ≈ 2.9:1) */}
            <rect x="76" y="108" width="68" height="144" rx="3" fill="#08080d" stroke="#CC0000" strokeWidth="1.5" />
            {/* Cap detail lines */}
            <line x1="76" y1="122" x2="144" y2="122" stroke="#CC0000" strokeWidth="0.5" opacity="0.35" />
            <line x1="76" y1="238" x2="144" y2="238" stroke="#CC0000" strokeWidth="0.5" opacity="0.35" />

            {/* Magnetic field arcs — LEFT (ripple outward) */}
            <path d="M 76,124 Q 44,180 76,236" fill="none" stroke="#CC0000" strokeWidth="1.2" opacity="0">
              <animate attributeName="opacity" values="0;0.85;0" dur="2.6s" repeatCount="indefinite" begin="0s" />
            </path>
            <path d="M 76,130 Q 22,180 76,230" fill="none" stroke="#CC0000" strokeWidth="1" opacity="0">
              <animate attributeName="opacity" values="0;0.6;0" dur="2.6s" repeatCount="indefinite" begin="0.45s" />
            </path>
            <path d="M 76,136 Q 2,180 76,224" fill="none" stroke="#CC0000" strokeWidth="0.75" opacity="0">
              <animate attributeName="opacity" values="0;0.35;0" dur="2.6s" repeatCount="indefinite" begin="0.9s" />
            </path>

            {/* Magnetic field arcs — RIGHT */}
            <path d="M 144,124 Q 176,180 144,236" fill="none" stroke="#CC0000" strokeWidth="1.2" opacity="0">
              <animate attributeName="opacity" values="0;0.85;0" dur="2.6s" repeatCount="indefinite" begin="0s" />
            </path>
            <path d="M 144,130 Q 198,180 144,230" fill="none" stroke="#CC0000" strokeWidth="1" opacity="0">
              <animate attributeName="opacity" values="0;0.6;0" dur="2.6s" repeatCount="indefinite" begin="0.45s" />
            </path>
            <path d="M 144,136 Q 218,180 144,224" fill="none" stroke="#CC0000" strokeWidth="0.75" opacity="0">
              <animate attributeName="opacity" values="0;0.35;0" dur="2.6s" repeatCount="indefinite" begin="0.9s" />
            </path>

            {/* Counterforce arrow (up, red, pulsing) */}
            <line x1="110" y1="96" x2="110" y2="44" stroke="#CC0000" strokeWidth="1.5" markerEnd="url(#arR)">
              <animate attributeName="opacity" values="0.45;1;0.45" dur="2.6s" repeatCount="indefinite" />
            </line>
            <text x="118" y="74" fill="#CC0000" fontSize="9" fontFamily="monospace" fontWeight="700">F</text>
            <text x="124" y="82" fill="#CC0000" fontSize="7" fontFamily="monospace" opacity="0.7">↑ counter</text>

            {/* Load arrow (down, gray, offset phase) */}
            <line x1="110" y1="264" x2="110" y2="316" stroke="#6b7280" strokeWidth="1.5" markerEnd="url(#arG)">
              <animate attributeName="opacity" values="0.45;1;0.45" dur="2.6s" repeatCount="indefinite" begin="1.3s" />
            </line>
            <text x="118" y="294" fill="#6b7280" fontSize="7" fontFamily="monospace" opacity="0.7">↓ load</text>

            {/* Callout labels */}
            <line x1="144" y1="148" x2="168" y2="132" stroke="#2d2d3a" strokeWidth="0.75" />
            <text x="170" y="130" fill="#374151" fontSize="7.5" fontFamily="monospace">STATOR</text>

            <line x1="119" y1="36" x2="156" y2="20" stroke="#2d2d3a" strokeWidth="0.75" />
            <text x="158" y="18" fill="#374151" fontSize="7.5" fontFamily="monospace">SHAFT</text>

            {/* Dimension bracket — stator height */}
            <line x1="62" y1="108" x2="62" y2="252" stroke="#2d2d3a" strokeWidth="0.75" />
            <line x1="58" y1="108" x2="66" y2="108" stroke="#2d2d3a" strokeWidth="0.75" />
            <line x1="58" y1="252" x2="66" y2="252" stroke="#2d2d3a" strokeWidth="0.75" />
            <text x="56" y="180" fill="#2d2d3a" fontSize="7" fontFamily="monospace" textAnchor="middle" transform="rotate(-90 56 180)">75.5 mm</text>
          </svg>
        </div>
      </div>

      <style>{`@media (min-width: 768px) { .hero-diagram { display: block !important; } }`}</style>
    </div>
  );
}
