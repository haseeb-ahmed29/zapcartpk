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
  const gasLevelRef = useRef(gasLevel);

  // Keep gasLevelRef updated for synchronous access inside interval callback
  gasLevelRef.current = gasLevel;

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

      // Compute next gas level directly
      let nextGas = gasLevelRef.current;
      switch (phase) {
        case "safe":
          // drift around 5-25%
          nextGas = 8 + Math.random() * 17 + Math.sin(phaseTickRef.current / 3) * 3;
          break;
        case "rising":
          // climb from current toward ~85
          nextGas = gasLevelRef.current + (85 - gasLevelRef.current) * 0.18 + (Math.random() * 4 - 2);
          break;
        case "danger":
          // jitter 78-96
          nextGas = 80 + Math.random() * 16;
          break;
        case "recovery":
          nextGas = gasLevelRef.current + (10 - gasLevelRef.current) * 0.18 + (Math.random() * 3 - 1.5);
          break;
      }
      nextGas = Math.max(0, Math.min(100, nextGas));
      const roundedGas = Math.round(nextGas);
      const nowMs = Date.now();

      // OPTIMIZATION: Update gasLevel, lastUpdate, and history atomically in a single batch.
      // Previously, history was pushed with dummy value:0 and a separate useEffect updated value
      // on gasLevel change, causing 2 full re-renders per 500ms simulation tick.
      setGasLevel(nextGas);
      setLastUpdate(nowMs);
      setHistory((h) => {
        const nh = [...h, { t: nowMs, value: roundedGas }];
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
    setShutdown(true);
    setGasLevel(0);
  }, []);

  const reset = useCallback(() => {
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
