import { memo, useMemo } from "react";
import { LineChart, Line, ResponsiveContainer, YAxis, XAxis, ReferenceLine, Tooltip } from "recharts";
import type { GasReading } from "@/hooks/useGasSimulation";

function GasChart({ data, threshold }: { data: GasReading[]; threshold: number }) {
  // Memoize data transformation to avoid re-allocating formatted objects array on parent re-renders when data hasn't changed
  const formatted = useMemo(
    () => data.map((d, i) => ({ idx: i, value: d.value })),
    [data]
  );
  return (
    <div className="h-44 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={formatted} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="hsl(var(--iot-accent))" />
              <stop offset="100%" stopColor="hsl(var(--iot-violet))" />
            </linearGradient>
          </defs>
          <XAxis dataKey="idx" hide />
          <YAxis domain={[0, 100]} tick={{ fill: "hsla(210,40%,96%,0.4)", fontSize: 10 }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{ background: "hsla(220,30%,10%,0.9)", border: "1px solid hsla(190,90%,60%,0.3)", borderRadius: 8, color: "white" }}
            labelFormatter={() => ""}
            formatter={(v: number) => [`${v}%`, "Gas"]}
          />
          <ReferenceLine y={threshold} stroke="hsl(var(--iot-danger))" strokeDasharray="4 4" />
          <Line
            type="monotone"
            dataKey="value"
            stroke="url(#lineGrad)"
            strokeWidth={2.5}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default memo(GasChart);
