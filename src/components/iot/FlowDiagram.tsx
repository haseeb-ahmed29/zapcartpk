import { ArrowDown, Wind, Cpu, AlertTriangle, Smartphone, Flame } from "lucide-react";

const steps = [
  { icon: Flame, label: "Gas Leakage", sub: "Source detected" },
  { icon: Wind, label: "MQ-2 Sensor", sub: "Reads PPM value" },
  { icon: Cpu, label: "NodeMCU", sub: "Processes data" },
  { icon: AlertTriangle, label: "Alarm + LED", sub: "Buzzer triggered" },
  { icon: Smartphone, label: "Mobile Notification", sub: "Sent via Wi-Fi" },
];

export default function FlowDiagram({ activeStep }: { activeStep: number }) {
  return (
    <div className="flex flex-col items-center gap-2">
      {steps.map((s, i) => (
        <div key={s.label} className="flex flex-col items-center w-full">
          <div
            className={`glass w-full max-w-xs px-4 py-3 flex items-center gap-3 transition-all duration-500 ${
              i === activeStep ? "ring-safe scale-105" : "opacity-60"
            }`}
          >
            <s.icon className={`w-5 h-5 ${i === activeStep ? "neon-safe" : "text-white/50"}`} />
            <div>
              <div className="text-sm font-semibold">{s.label}</div>
              <div className="text-[10px] text-white/50">{s.sub}</div>
            </div>
          </div>
          {i < steps.length - 1 && (
            <ArrowDown
              className={`w-5 h-5 my-1 ${i === activeStep ? "neon-safe animate-pulse-glow" : "text-white/30"}`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
