import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useGasSimulation } from "../hooks/useGasSimulation";

describe("useGasSimulation hook", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("initializes with default safe state", () => {
    const { result } = renderHook(() => useGasSimulation());
    expect(result.current.status).toBe("safe");
    expect(result.current.phase).toBe("safe");
    expect(result.current.shutdown).toBe(false);
    expect(result.current.paused).toBe(false);
  });

  it("updates history and gas level cleanly after interval ticks", () => {
    const { result } = renderHook(() => useGasSimulation());

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current.history.length).toBe(1);
    expect(result.current.history[0].value).toBe(result.current.gasLevel);

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.history.length).toBe(3);
    expect(result.current.history[2].value).toBe(result.current.gasLevel);
  });

  it("triggers leak and advances phase to rising", () => {
    const { result } = renderHook(() => useGasSimulation());

    act(() => {
      result.current.triggerLeak();
    });

    expect(result.current.phase).toBe("rising");
  });

  it("handles emergency shutdown and reset", () => {
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
    expect(result.current.phase).toBe("safe");
  });
});
