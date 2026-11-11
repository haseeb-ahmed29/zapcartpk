import { Cpu, Wind, Volume2, Lightbulb, Wifi } from "lucide-react";

const items = [
  { icon: Cpu, name: "NodeMCU ESP8266", desc: "Microcontroller + Wi-Fi", color: "var(--iot-accent)" },
  { icon: Wind, name: "MQ-2 Gas Sensor", desc: "LPG / CH4 / Smoke", color: "var(--iot-safe)" },
  { icon: Volume2, name: "Buzzer", desc: "Audible alarm", color: "var(--iot-danger)" },
  { icon: Lightbulb, name: "LED Indicator", desc: "Visual warning", color: "var(--iot-warn)" },
  { icon: Wifi, name: "Wi-Fi Module", desc: "Cloud uplink", color: "var(--iot-violet)" },
];

export default function ComponentsGrid({ alarming }: { alarming: boolean }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {items.map((it, i) => (
        <div
          key={it.name}
          className={`glass p-4 flex flex-col items-center text-center gap-2 transition-all hover:-translate-y-1 ${alarming && (it.name === "Buzzer" || it.name === "LED Indicator") ? "animate-pulse-glow" : ""}`}
          style={{ animationDelay: `${i * 0.1}s` }}
        >
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{
              background: `radial-gradient(circle, hsla(${it.color} / 0.3), transparent 70%)`,
              boxShadow: `0 0 20px hsla(${it.color} / 0.4)`,
            }}
          >
            <it.icon className="w-6 h-6" style={{ color: `hsl(${it.color})` }} />
          </div>
          <div className="text-sm font-semibold">{it.name}</div>
          <div className="text-[10px] text-white/50">{it.desc}</div>
        </div>
      ))}
    </div>
  );
}
