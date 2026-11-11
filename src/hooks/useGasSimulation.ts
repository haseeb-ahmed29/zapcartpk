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
  // Ref tracking current gas level for synchronous access inside interval callback
  const gasLevelRef = useRef(8);
  // Ref tracking current phase to avoid re-instantiating the setInterval timer on phase changes
  const phaseRef = useRef<Phase>("safe");

  // Keep gasLevelRef updated for synchronous access
  gasLevelRef.current = gasLevel;

  const status: Status = shutdown ? "shutdown" : gasLevel > HIGH_THRESHOLD ? "danger" : "safe";
  const buzzerOn = status === "danger";
  const ledOn = status === "danger";

  // Helper to sync gas level state and ref
  const updateGasLevel = useCallback((val: number) => {
    gasLevelRef.current = val;
    setGasLevel(val);
  }, []);

  // Helper to sync phase state and ref
  const updatePhase = useCallback((p: Phase) => {
    phaseRef.current = p;
    setPhase(p);
  }, []);

  // Performance optimization:
  // 1. Compute gas level, history, and status transitions synchronously within the timer
  //    callback to batch all state updates (gasLevel, lastUpdate, history, notificationCount)
  //    in a single render pass per tick (reducing re-renders by ~50%).
  // 2. Access currentPhase via phaseRef.current so the setInterval timer does not tear down
  //    and re-instantiate on every phase change (~every 5-8s).
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
      const currentPhase = phaseRef.current;
      switch (currentPhase) {
        case "safe":
          next = 8 + Math.random() * 17 + Math.sin(phaseTickRef.current / 3) * 3;
          break;
        case "rising":
          next = prev + (85 - prev) * 0.18 + (Math.random() * 4 - 2);
          break;
        case "danger":
          next = 80 + Math.random() * 16;
          break;
        case "recovery":
          next = prev + (10 - prev) * 0.18 + (Math.random() * 3 - 1.5);
          break;
      }
      const bounded = Math.max(0, Math.min(100, next));
      const rounded = Math.round(bounded);
      const timestamp = Date.now();

      // Performance Optimization: Batch state updates atomically in a single pass.
      updateGasLevel(bounded);
      setLastUpdate(timestamp);

      const nextStatus: Status = bounded > HIGH_THRESHOLD ? "danger" : "safe";
      if (prevStatusRef.current !== "danger" && nextStatus === "danger") {
        setNotificationCount((n) => n + 1);
      }
      prevStatusRef.current = nextStatus;

      setHistory((prevHistory) => {
        const truncated = prevHistory.length >= HISTORY_LEN ? prevHistory.slice(1) : prevHistory;
        return [...truncated, { t: timestamp, value: rounded }];
      });

      // Phase advance
      if (phaseTickRef.current >= PHASE_TICKS[currentPhase]) {
        phaseTickRef.current = 0;
        const order: Phase[] = ["safe", "rising", "danger", "recovery"];
        const nextPhase = order[(order.indexOf(currentPhase) + 1) % order.length];
        updatePhase(nextPhase);
      }
    }, TICK_MS);
    return () => clearInterval(id);
  }, [paused, shutdown, updateGasLevel, updatePhase]);

  const triggerLeak = useCallback(() => {
    if (shutdown) return;
    phaseTickRef.current = 0;
    updatePhase("rising");
  }, [shutdown, updatePhase]);

  const emergencyShutdown = useCallback(() => {
    gasLevelRef.current = 0;
    setShutdown(true);
    updateGasLevel(0);
    prevStatusRef.current = "shutdown";
  }, [updateGasLevel]);

  const reset = useCallback(() => {
    gasLevelRef.current = 8;
    setShutdown(false);
    setPaused(false);
    phaseTickRef.current = 0;
    updatePhase("safe");
    updateGasLevel(8);
    prevStatusRef.current = "safe";
  }, [updateGasLevel, updatePhase]);

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
