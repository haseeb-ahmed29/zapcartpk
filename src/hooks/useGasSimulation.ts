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
  const gasLevelRef = useRef(8);
  const gasLevelRef = useRef(gasLevel);

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
      const now = Date.now();
      setCloudPing((p) => p + 1);

      // Occasional wifi flicker
      if (Math.random() < 0.02) {
        setWifiConnected(false);
        setTimeout(() => setWifiConnected(true), 600);
      }

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
      const bounded = Math.max(0, Math.min(100, next));
      updateGasLevel(bounded);

      // Bolt optimization: Synchronously update history with calculated next gas value
      // to avoid secondary useEffect triggering double re-renders and array cloning on every tick.
      setHistory((h) => {
        const rounded = Math.round(bounded);
        const nh = [...h, { t: now, value: rounded }];
      // Performance optimization: Calculate next gas level synchronously within the tick
      // to update history in a single pass without re-creating the interval timer on every tick.
      // We use gasLevelRef to read current gasLevel without adding it to useEffect dependencies.
      const currentGas = gasLevelRef.current;
      let nextGas = currentGas;
      // Compute next gas level directly
      let nextGas = gasLevelRef.current;
      switch (phase) {
        case "safe":
          // drift around 5-25%
          nextGas = 8 + Math.random() * 17 + Math.sin(phaseTickRef.current / 3) * 3;
          break;
        case "rising":
          // climb from current toward ~85
          nextGas = currentGas + (85 - currentGas) * 0.18 + (Math.random() * 4 - 2);
          nextGas = gasLevelRef.current + (85 - gasLevelRef.current) * 0.18 + (Math.random() * 4 - 2);
          break;
        case "danger":
          // jitter 78-96
          nextGas = 80 + Math.random() * 16;
          break;
        case "recovery":
          nextGas = currentGas + (10 - currentGas) * 0.18 + (Math.random() * 3 - 1.5);
          break;
      }
      const clampedGas = Math.max(0, Math.min(100, nextGas));
      gasLevelRef.current = clampedGas;
      setGasLevel(clampedGas);

      const nowMs = Date.now();
      setLastUpdate(nowMs);

      // Append new history point directly with rounded value in one single batch update,
      // avoiding duplicate state updates and array copying in a separate useEffect.
      const roundedValue = Math.round(clampedGas);
      setHistory((h) => {
        const nh = [...h, { t: nowMs, value: roundedValue }];
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

      setLastUpdate(now);

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
  }, [phase, paused, shutdown, updateGasLevel]);
  }, [phase, paused, shutdown]);

  const triggerLeak = useCallback(() => {
    if (shutdown) return;
    phaseTickRef.current = 0;
    setPhase("rising");
  }, [shutdown]);

  const emergencyShutdown = useCallback(() => {
    setShutdown(true);
    updateGasLevel(0);
  }, [updateGasLevel]);

  const reset = useCallback(() => {
    setShutdown(false);
    setPaused(false);
    phaseTickRef.current = 0;
    setPhase("safe");
    updateGasLevel(8);
  }, [updateGasLevel]);

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
