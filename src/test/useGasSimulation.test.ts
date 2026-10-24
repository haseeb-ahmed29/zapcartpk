import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useGasSimulation } from "@/hooks/useGasSimulation";

describe("useGasSimulation hook", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("initializes with safe state and default gas level", () => {
    const { result } = renderHook(() => useGasSimulation());
    expect(result.current.status).toBe("safe");
    expect(result.current.phase).toBe("safe");
    expect(result.current.gasLevel).toBe(8);
  });

  it("updates gas level and history on timer ticks", () => {
    const { result } = renderHook(() => useGasSimulation());

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current.history.length).toBe(1);
    expect(result.current.history[0].value).toBe(result.current.gasLevel);
  });

  it("handles emergency shutdown and reset correctly", () => {
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
