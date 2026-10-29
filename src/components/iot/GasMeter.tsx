import { memo } from "react";

// Animated circular gas gauge with neon glow
interface Props {
  value: number; // 0-100
  status: "safe" | "danger" | "shutdown";
  threshold: number;
}

function GasMeter({ value, status, threshold }: Props) {
  const size = 240;
  const stroke = 14;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;

  const colorVar =
    status === "danger" ? "var(--iot-danger)" : status === "shutdown" ? "var(--iot-muted)" : "var(--iot-safe)";

  return (
    <div
      role="meter"
      aria-label="Live gas concentration"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuetext={`${value}% LEL`}
      className="relative flex flex-col items-center justify-center"
    >
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <defs>
          <linearGradient id="gasGrad" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor={`hsl(${colorVar})`} />
            <stop offset="100%" stopColor={`hsl(var(--iot-accent))`} />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="hsla(190,40%,40%,0.18)" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="url(#gasGrad)"
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          filter="url(#glow)"
          style={{ transition: "stroke-dashoffset 0.4s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div
          className={`text-6xl font-bold tabular-nums ${
            status === "danger" ? "neon-danger animate-pulse-glow" : status === "shutdown" ? "text-white/40" : "neon-safe"
          }`}
        >
          {value}
          <span className="text-2xl">%</span>
        </div>
        <div className="text-xs uppercase tracking-[0.3em] mt-1 text-white/60">MQ-2 PPM</div>
        <div className="text-[10px] mt-1 text-white/40">Threshold: {threshold}%</div>
      </div>
    </div>
  );
}

export default memo(GasMeter);
