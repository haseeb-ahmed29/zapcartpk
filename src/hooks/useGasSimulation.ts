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
  const phaseRef = useRef<Phase>("safe");
  const [paused, setPaused] = useState(false);
  const [shutdown, setShutdown] = useState(false);
  const [history, setHistory] = useState<GasReading[]>([]);
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const [wifiConnected, setWifiConnected] = useState(true);
  const [cloudPing, setCloudPing] = useState(0); // increments each tick for animation
  const [notificationCount, setNotificationCount] = useState(0);

  const phaseTickRef = useRef(0);
  const prevStatusRef = useRef<Status>("safe");
  const gasLevelRef = useRef(8);

  // Keep gasLevelRef updated for synchronous access inside interval callback
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

  // Optimization: Compute derived status transitions synchronously within the timer
  // callback to batch all state updates (gasLevel, history, notificationCount) in a single render pass.
  // Using phaseRef prevents tearing down and recreating the interval on phase transitions.
  useEffect(() => {
    if (paused || shutdown) return;
    const id = setInterval(() => {
      phaseTickRef.current += 1;
      const now = Date.now();
      setCloudPing((p) => p + 1);

      // Occasional wifi flicker
      if (Math.random() < 0.02) {
        setWifiConnected(false);
        setTimeout(() => setWifiConnected(true), 600);
      }

      const prev = gasLevelRef.current;
      let next = prev;
      const currentPhase = phaseRef.current;
      switch (currentPhase) {
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
      const clampedGas = Math.max(0, Math.min(100, next));
      gasLevelRef.current = clampedGas;
      setGasLevel(clampedGas);
      setLastUpdate(now);

      const rounded = Math.round(clampedGas);
      setHistory((h) => {
        const nh = [...h, { t: now, value: rounded }];
        if (nh.length > HISTORY_LEN) nh.shift();
        return nh;
      });

      const bounded = Math.max(0, Math.min(100, next));
      updateGasLevel(bounded);
      setLastUpdate(now);

      // Inline status transition check to eliminate secondary useEffect re-renders
      const nextStatus: Status = bounded > HIGH_THRESHOLD ? "danger" : "safe";
      if (prevStatusRef.current !== "danger" && nextStatus === "danger") {
        setNotificationCount((n) => n + 1);
      }
      prevStatusRef.current = nextStatus;

      const rounded = Math.round(bounded);
      setHistory((prevHistory) => {
        const truncated = prevHistory.length >= HISTORY_LEN ? prevHistory.slice(1) : prevHistory;
        return [...truncated, { t: now, value: rounded }];
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
  }, [phase, paused, shutdown]);
  }, [paused, shutdown, updateGasLevel, updatePhase]);

  const triggerLeak = useCallback(() => {
    if (shutdown) return;
    phaseTickRef.current = 0;
    updatePhase("rising");
  }, [shutdown, updatePhase]);

  const emergencyShutdown = useCallback(() => {
    setShutdown(true);
    updateGasLevel(0);
    prevStatusRef.current = "shutdown";
  }, [updateGasLevel]);

  const reset = useCallback(() => {
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
