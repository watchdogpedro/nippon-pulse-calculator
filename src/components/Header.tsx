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
