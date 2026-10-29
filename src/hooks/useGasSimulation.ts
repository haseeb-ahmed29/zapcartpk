import { useEffect, useRef, useState, useCallback } from "react";

// Phases for auto demo simulation cycle
export type Phase = "safe" | "rising" | "danger" | "recovery";
export type Status = "safe" | "danger" | "shutdown";

export interface GasReading {
  t: number; // timestamp ms
  value: number; // 0-100
}

const TICK_MS = 500;
const HIGH_THRESHOLD = 60;

// Phase durations (ticks)
const PHASE_TICKS: Record<Phase, number> = {
  safe: 16,     // ~8s
  rising: 12,   // ~6s
  danger: 10,   // ~5s
  recovery: 10, // ~5s
};

const HISTORY_LEN = 40;

export function useGasSimulation() {
  const [gasLevel, setGasLevel] = useState(8);
  // Synchronous ref tracking the current gas level to avoid redundant re-renders
  const gasLevelRef = useRef(8);

  const [phase, setPhase] = useState<Phase>("safe");
  const [paused, setPaused] = useState(false);
  const [shutdown, setShutdown] = useState(false);
  const [history, setHistory] = useState<GasReading[]>([]);
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const [wifiConnected, setWifiConnected] = useState(true);
  const [cloudPing, setCloudPing] = useState(0); // increments each tick for animation
  const [notificationCount, setNotificationCount] = useState(0);

  const phaseTickRef = useRef(0);
  const prevStatusRef = useRef<Status>("safe");

  const status: Status = shutdown ? "shutdown" : gasLevel > HIGH_THRESHOLD ? "danger" : "safe";
  const buzzerOn = status === "danger";
  const ledOn = status === "danger";

  // Trigger notification on safe -> danger transition
  useEffect(() => {
    if (prevStatusRef.current !== "danger" && status === "danger") {
      setNotificationCount((n) => n + 1);
    }
    prevStatusRef.current = status;
  }, [status]);

  useEffect(() => {
    if (paused || shutdown) return;
    const id = setInterval(() => {
      phaseTickRef.current += 1;
      setCloudPing((p) => p + 1);

      // Occasional wifi flicker
      if (Math.random() < 0.02) {
        setWifiConnected(false);
        setTimeout(() => setWifiConnected(true), 600);
      }

      // Calculate next gas level using gasLevelRef to avoid extra state update cycles
      const prev = gasLevelRef.current;
      let next = prev;
      switch (phase) {
        case "safe":
          // drift around 5-25%
          next = 8 + Math.random() * 17 + Math.sin(phaseTickRef.current / 3) * 3;
          break;
        case "rising":
          // climb from current toward ~85
          next = prev + (85 - prev) * 0.18 + (Math.random() * 4 - 2);
          break;
        case "danger":
          // jitter 78-96
          next = 80 + Math.random() * 16;
          break;
        case "recovery":
          next = prev + (10 - prev) * 0.18 + (Math.random() * 3 - 1.5);
          break;
      }
      next = Math.max(0, Math.min(100, next));
      gasLevelRef.current = next;

      const now = Date.now();
      const rounded = Math.round(next);

      // Performance Optimization: Single-batch state updates per simulation tick.
      // Previously, history appended dummy values ({ value: 0 }) in setInterval
      // and required an extra useEffect([gasLevel]) to copy and fix the last item.
      // Setting both gasLevel and history in the interval callback cuts re-renders by 50%.
      setGasLevel(next);
      setLastUpdate(now);
      setHistory((h) => {
        const nh = [...h, { t: now, value: rounded }];
        if (nh.length > HISTORY_LEN) nh.shift();
        return nh;
      });

      // Phase advance
      if (phaseTickRef.current >= PHASE_TICKS[phase]) {
        phaseTickRef.current = 0;
        setPhase((p) => {
          const order: Phase[] = ["safe", "rising", "danger", "recovery"];
          return order[(order.indexOf(p) + 1) % order.length];
        });
      }
    }, TICK_MS);
    return () => clearInterval(id);
  }, [phase, paused, shutdown]);

  const triggerLeak = useCallback(() => {
    if (shutdown) return;
    phaseTickRef.current = 0;
    setPhase("rising");
  }, [shutdown]);

  const emergencyShutdown = useCallback(() => {
    gasLevelRef.current = 0;
    setShutdown(true);
    setGasLevel(0);
  }, []);

  const reset = useCallback(() => {
    gasLevelRef.current = 8;
    setShutdown(false);
    setPaused(false);
    phaseTickRef.current = 0;
    setPhase("safe");
    setGasLevel(8);
  }, []);

  const togglePause = useCallback(() => setPaused((p) => !p), []);

  return {
    gasLevel: Math.round(gasLevel),
    rawGas: gasLevel,
    status,
    phase,
    buzzerOn,
    ledOn,
    wifiConnected,
    cloudPing,
    notificationCount,
    history,
    lastUpdate,
    paused,
    shutdown,
    threshold: HIGH_THRESHOLD,
    triggerLeak,
    emergencyShutdown,
    reset,
    togglePause,
  };
}
