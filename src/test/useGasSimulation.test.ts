import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useGasSimulation } from "@/hooks/useGasSimulation";

describe("useGasSimulation", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("initializes with safe default state", () => {
    const { result } = renderHook(() => useGasSimulation());

    expect(result.current.phase).toBe("safe");
    expect(result.current.status).toBe("safe");
    expect(result.current.gasLevel).toBe(8);
    expect(result.current.history).toEqual([]);
    expect(result.current.paused).toBe(false);
    expect(result.current.shutdown).toBe(false);
  });

  it("updates simulation history and gas level on tick", () => {
    const { result } = renderHook(() => useGasSimulation());

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current.history.length).toBe(1);
    expect(result.current.history[0].value).toBeGreaterThanOrEqual(0);
    expect(result.current.history[0].value).toBe(Math.round(result.current.rawGas));
  });

  it("triggers leak and emergency shutdown correctly", () => {
    const { result } = renderHook(() => useGasSimulation());

    act(() => {
      result.current.triggerLeak();
    });
    expect(result.current.phase).toBe("rising");

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
    expect(result.current.phase).toBe("safe");
    expect(result.current.gasLevel).toBe(8);
  });
});
