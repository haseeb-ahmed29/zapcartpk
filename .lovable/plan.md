# IoT Gas Leak Detection & Alert System — `/iot-demo`

ZapCart untouched rahega. Naya React route `/iot-demo` add hoga jo ek fully interactive, dark futuristic IoT dashboard simulation render karega.

## Route & files

- `src/pages/IotDemo.tsx` — main page (dashboard layout, simulation engine)
- `src/components/iot/GasMeter.tsx` — animated circular gas % gauge with neon glow
- `src/components/iot/StatusCard.tsx` — glassmorphism status cards (Wi-Fi, Cloud, Buzzer, LED, Mobile)
- `src/components/iot/GasChart.tsx` — live line chart (recharts, already in stack) of last ~30 readings
- `src/components/iot/ComponentsGrid.tsx` — NodeMCU ESP8266, MQ-2, Buzzer, LED, Wi-Fi Module cards with icons
- `src/components/iot/FlowDiagram.tsx` — animated vertical flowchart (Gas → MQ-2 → NodeMCU → Alarm+LED → Mobile Notification) with pulsing arrows that highlight in sequence
- `src/components/iot/CircuitPreview.tsx` — styled box layout with animated SVG connection lines (dashed flowing stroke)
- `src/components/iot/EmergencyAlert.tsx` — shadcn AlertDialog popup on danger
- `src/hooks/useGasSimulation.ts` — central simulation state hook
- Register route in `src/App.tsx`
- Link button on ZapCart navbar (`src/pages/Index.tsx`) → "IoT Demo"

## Simulation logic (useGasSimulation)

- Tick every 500 ms updating `gasLevel` (0–100%).
- Auto-cycle phases: `safe` (8s, value drifts 5–25%) → `rising` (6s, climbs to 85%) → `danger` (5s, 80–95% with jitter) → `recovery` (5s, drops back) → loop.
- Manual controls: Pause/Resume, "Trigger Leak" button, "Emergency Shutdown" button (forces value to 0, status `shutdown`).
- Threshold: >60% = HIGH danger.
- Emits derived state: `status` (`safe` | `danger` | `shutdown`), `buzzerOn`, `ledOn`, `wifiConnected` (true, occasional flicker), `cloudSync` (pulses on each tick), `notificationSent` (true when entering danger), `history` (array for chart), `lastUpdate` timestamp.

## Behavior mapping

- LOW (≤60%): green neon ring, "Environment Safe", buzzer card dim, no popup.
- HIGH (>60%): red ring + screen-edge red flash overlay (pulsing), buzzer card animates (shake + glow), LED card blinks, "⚠ Gas Leakage Detected" banner, emergency AlertDialog opens once per danger phase, toast notification "📱 Mobile alert sent".
- Shutdown: gray state, all indicators off, "System Shutdown — Reset to resume" with Reset button.

## Layout (responsive grid)

```
┌──────────── Header: title, live timestamp, Wi-Fi/Cloud chips ────────────┐
│ Left col (2/3)                          │ Right col (1/3)               │
│  • Gas Meter (big circular gauge)       │  • Status indicators stack    │
│  • Live Chart (recharts)                │  • Mobile notification panel  │
│  • Controls: Trigger Leak / Shutdown    │  • System health monitor      │
├─────────────────────────────────────────┴───────────────────────────────┤
│ Components Grid (5 cards)                                                │
├──────────────────────────────────────────────────────────────────────────┤
│ Working Flow Animation       │ Circuit Preview (SVG)                     │
└──────────────────────────────────────────────────────────────────────────┘
```

Mobile: single column stack.

## Visual design

- Add design tokens to `src/index.css` & `tailwind.config.ts` scoped via a `.iot-theme` wrapper class so ZapCart theme stays unaffected:
  - `--iot-bg`: deep navy/black gradient
  - `--iot-safe`: neon green (HSL)
  - `--iot-danger`: neon red
  - `--iot-accent`: cyan
  - `--iot-glass`: white/5 with backdrop-blur
  - Glow shadows, neon border utilities, `animate-pulse-glow`, `animate-flash-danger`, `animate-flow-dash` keyframes.
- Glassmorphism cards (`backdrop-blur-xl bg-white/5 border-white/10`).
- Framer-motion already not installed — use Tailwind keyframes + CSS only (lighter, fits "no extra deps" goal). recharts is already in package.json so chart is free.

## Demo auto-run

Simulation starts automatically on mount (safe → leak → alarm → recovery loop) so the live preview immediately demonstrates full behavior without user interaction. Manual buttons override.

## Out of scope

- No backend, no edge functions, no DB writes (pure client simulation).
- ZapCart pages, OrderForm, products — unchanged.
