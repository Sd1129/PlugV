export default function SiteBackground() {
    return (
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[radial-gradient(circle_at_top,#f6fbf5_0%,#e2efe0_42%,#d9ead4_100%)]">
        <div className="absolute inset-0 opacity-35">
          <BlueprintPattern />
        </div>
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-emerald-950/10 to-transparent" />
      </div>
    );
  }
  
  function BlueprintPattern() {
    return (
      <svg
        className="h-full w-full"
        viewBox="0 0 1600 1000"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <pattern id="grid" width="180" height="140" patternUnits="userSpaceOnUse">
            <path
              d="M 180 0 L 0 0 0 140"
              fill="none"
              stroke="#1f7a38"
              strokeOpacity="0.14"
              strokeWidth="1"
            />
          </pattern>
  
          <pattern id="parts" width="360" height="260" patternUnits="userSpaceOnUse">
            <circle cx="64" cy="82" r="44" fill="none" stroke="#1f7a38" strokeOpacity="0.18" strokeWidth="2" />
            <circle cx="64" cy="82" r="16" fill="none" stroke="#1f7a38" strokeOpacity="0.14" strokeWidth="2" />
            <path d="M 180 44 h 72 l 18 18 v 28 h -100 z" fill="none" stroke="#1f7a38" strokeOpacity="0.15" strokeWidth="2" />
            <path d="M 32 188 h 112" fill="none" stroke="#1f7a38" strokeOpacity="0.14" strokeWidth="2" />
            <path d="M 228 160 l 18 -18 h 36 l 14 14 v 22 h -68 z" fill="none" stroke="#1f7a38" strokeOpacity="0.16" strokeWidth="2" />
            <path d="M 230 68 c 16 0 30 12 30 28" fill="none" stroke="#1f7a38" strokeOpacity="0.14" strokeWidth="2" />
          </pattern>
        </defs>
  
        <rect width="1600" height="1000" fill="url(#grid)" />
        <rect width="1600" height="1000" fill="url(#parts)" />
      </svg>
    );
  }