import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useGasSimulation } from "@/hooks/useGasSimulation";

describe("useGasSimulation hook", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should initialize with default safe state", () => {
    const { result } = renderHook(() => useGasSimulation());

    expect(result.current.gasLevel).toBe(8);
    expect(result.current.status).toBe("safe");
    expect(result.current.phase).toBe("safe");
    expect(result.current.history).toEqual([]);
    expect(result.current.shutdown).toBe(false);
  });

  it("should update gas level and history on timer ticks", () => {
    const { result } = renderHook(() => useGasSimulation());

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current.history.length).toBe(1);
    expect(result.current.history[0].value).toBe(result.current.gasLevel);
  });

  it("should trigger leak and change phase to rising", () => {
    const { result } = renderHook(() => useGasSimulation());

    act(() => {
      result.current.triggerLeak();
    });

    expect(result.current.phase).toBe("rising");
  });

  it("should handle emergency shutdown and reset", () => {
    const { result } = renderHook(() => useGasSimulation());

    act(() => {
      result.current.emergencyShutdown();
    });

    expect(result.current.shutdown).toBe(true);
    expect(result.current.status).toBe("shutdown");
    expect(result.current.gasLevel).toBe(0);

    act(() => {
      result.current.reset();
    });

    expect(result.current.shutdown).toBe(false);
    expect(result.current.status).toBe("safe");
    expect(result.current.gasLevel).toBe(8);
  });
});
