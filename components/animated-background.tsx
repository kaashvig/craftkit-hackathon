"use client"

export default function AnimatedBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10">
      {/* Radial gradient background using base color with alpha to avoid extra colors */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(1200px 800px at 50% 38%, rgba(10, 25, 49, 0.55) 0%, rgba(10, 25, 49, 0.85) 40%, rgba(10, 25, 49, 1) 70%)",
          animation: "bg-slow-pan 18s ease-in-out infinite alternate",
        }}
      />
      {/* Subtle mist layer (teal with alpha) */}
      <div
        className="absolute inset-0 mix-blend-screen opacity-30"
        style={{
          background:
            "radial-gradient(800px 500px at 20% 20%, rgba(27,94,104,0.25), transparent 60%), radial-gradient(900px 600px at 80% 70%, rgba(27,94,104,0.18), transparent 65%)",
          filter: "blur(20px)",
        }}
      />
      {/* Glowing node network (SVG) */}
      <svg className="absolute inset-0" viewBox="0 0 1440 900" aria-hidden="true" role="img">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Connecting lines (lime highlight) */}
        <g stroke="rgba(185,255,20,0.28)" strokeWidth="1.2" filter="url(#glow)">
          <path d="M220 160 L420 280 L680 240 L980 360 L1220 300" />
          <path d="M280 520 L560 420 L860 520 L1120 460" />
          <path d="M140 720 L380 600 L700 700 L1040 640 L1300 740" />
        </g>

        {/* Nodes (coral accent with glow) */}
        <g>
          {[
            { cx: 220, cy: 160, r: 4 },
            { cx: 420, cy: 280, r: 5 },
            { cx: 680, cy: 240, r: 5 },
            { cx: 980, cy: 360, r: 5 },
            { cx: 1220, cy: 300, r: 4 },
            { cx: 280, cy: 520, r: 5 },
            { cx: 560, cy: 420, r: 5 },
            { cx: 860, cy: 520, r: 5 },
            { cx: 1120, cy: 460, r: 4 },
            { cx: 140, cy: 720, r: 4 },
            { cx: 380, cy: 600, r: 5 },
            { cx: 700, cy: 700, r: 5 },
            { cx: 1040, cy: 640, r: 5 },
            { cx: 1300, cy: 740, r: 4 },
          ].map((n, i) => (
            <circle
              key={i}
              cx={n.cx}
              cy={n.cy}
              r={n.r}
              fill="var(--accent)"
              opacity="0.9"
              style={{
                filter: "drop-shadow(0 0 10px rgba(255,107,107,0.85))",
                animation: `node-pulse ${8 + (i % 5)}s ease-in-out ${(i % 7) * 0.6}s infinite`,
              }}
            />
          ))}
        </g>
      </svg>

      <style jsx global>{`
        @keyframes bg-slow-pan {
          0% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          100% {
            transform: translate3d(0px, -10px, 0) scale(1.02);
          }
        }
        @keyframes node-pulse {
          0%,
          100% {
            opacity: 0.75;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.25);
          }
        }
      `}</style>
    </div>
  )
}
