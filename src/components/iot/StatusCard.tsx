import { memo } from "react";
import { type LucideIcon } from "lucide-react";

interface Props {
  icon: LucideIcon;
  label: string;
  value: string;
  active: boolean;
  danger?: boolean;
  animate?: "pulse" | "shake" | "blink" | "none";
}

function StatusCard({ icon: Icon, label, value, active, danger, animate = "none" }: Props) {
  const animClass =
    animate === "pulse" && active ? "animate-pulse-glow" :
    animate === "shake" && active ? "animate-shake" :
    animate === "blink" && active ? "animate-blink" : "";
  const tone = danger ? "neon-danger" : active ? "neon-safe" : "text-white/40";
  const ring = danger ? "ring-danger" : active ? "ring-safe" : "";
  return (
    <div className={`glass p-4 flex items-center gap-3 ${ring} ${animClass}`}>
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-white/5 ${tone}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[10px] uppercase tracking-widest text-white/50">{label}</div>
        <div className={`text-sm font-semibold ${tone}`}>{value}</div>
      </div>
    </div>
  );
}

export default memo(StatusCard);
