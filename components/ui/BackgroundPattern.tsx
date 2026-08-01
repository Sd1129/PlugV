export default function BackgroundPattern() {
    return (
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.10),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(99,102,241,0.08),transparent_28%)]" />
        <div className="absolute inset-0 opacity-35">
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
                  stroke="#7dd3fc"
                  strokeOpacity="0.12"
                  strokeWidth="1"
                />
              </pattern>
  
              <pattern id="dots" width="320" height="240" patternUnits="userSpaceOnUse">
                <circle cx="60" cy="70" r="38" fill="none" stroke="#a5b4fc" strokeOpacity="0.12" strokeWidth="2" />
                <circle cx="60" cy="70" r="14" fill="none" stroke="#e2e8f0" strokeOpacity="0.10" strokeWidth="2" />
                <path d="M 175 48 h 84 l 18 18 v 26 h -102 z" fill="none" stroke="#7dd3fc" strokeOpacity="0.10" strokeWidth="2" />
                <path d="M 30 182 h 118" fill="none" stroke="#cbd5e1" strokeOpacity="0.08" strokeWidth="2" />
                <path d="M 222 156 l 18 -18 h 34 l 14 14 v 22 h -66 z" fill="none" stroke="#a5b4fc" strokeOpacity="0.10" strokeWidth="2" />
              </pattern>
            </defs>
  
            <rect width="1600" height="1000" fill="url(#grid)" />
            <rect width="1600" height="1000" fill="url(#dots)" />
          </svg>
        </div>
  
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-slate-900/30 to-transparent" />
      </div>
    );
  }