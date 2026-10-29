import { memo } from "react";

// Stylized circuit layout with animated dashed connection lines
function CircuitPreview({ alarming }: { alarming: boolean }) {
  const stroke = alarming ? "hsl(var(--iot-danger))" : "hsl(var(--iot-accent))";
  return (
    <div className="relative w-full h-72 grid-bg rounded-xl overflow-hidden p-4">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 280" preserveAspectRatio="none">
        {[
          "M80,60 L200,60 L200,140",
          "M200,140 L320,140",
          "M200,140 L200,220 L120,220",
          "M200,140 L200,220 L280,220",
        ].map((d, i) => (
          <path
            key={i}
            d={d}
            fill="none"
            stroke={stroke}
            strokeWidth="2"
            strokeDasharray="6 6"
            className="animate-flow-dash"
            style={{ filter: `drop-shadow(0 0 4px ${stroke})` }}
          />
        ))}
      </svg>
      {/* Nodes */}
      <Node x="20%" y="20%" label="MQ-2" color="safe" />
      <Node x="50%" y="50%" label="NodeMCU" color="accent" big />
      <Node x="80%" y="50%" label="Wi-Fi" color="violet" />
      <Node x="30%" y="80%" label="LED" color="warn" alarming={alarming} />
      <Node x="70%" y="80%" label="Buzzer" color="danger" alarming={alarming} />
    </div>
  );
}

export default memo(CircuitPreview);

function Node({
  x, y, label, color, big, alarming,
}: { x: string; y: string; label: string; color: string; big?: boolean; alarming?: boolean }) {
  const c = `hsl(var(--iot-${color}))`;
  return (
    <div
      className={`absolute -translate-x-1/2 -translate-y-1/2 ${alarming ? "animate-pulse-glow" : ""}`}
      style={{ left: x, top: y }}
    >
      <div
        className={`glass px-3 py-2 text-xs font-semibold ${big ? "text-sm px-4 py-3" : ""}`}
        style={{ boxShadow: `0 0 16px ${c}55`, border: `1px solid ${c}` }}
      >
        {label}
      </div>
    </div>
  );
}
