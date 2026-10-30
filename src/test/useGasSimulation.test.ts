import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
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
    expect(result.current.paused).toBe(false);
  });

  it("should update gas level and history on timer ticks", () => {
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

  it("should trigger leak and change phase to rising", () => {
    const { result } = renderHook(() => useGasSimulation());

    act(() => {
      result.current.triggerLeak();
    });

    expect(result.current.phase).toBe("rising");
  });

  it("should trigger leak, transition to danger, and increment notificationCount", () => {
    const { result } = renderHook(() => useGasSimulation());

    expect(result.current.notificationCount).toBe(0);

    act(() => {
      result.current.triggerLeak();
    });

    expect(result.current.phase).toBe("rising");

    // Advance timer enough ticks for gas level to cross HIGH_THRESHOLD (60)
    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(result.current.gasLevel).toBeGreaterThan(60);
    expect(result.current.status).toBe("danger");
    expect(result.current.notificationCount).toBe(1);
  });

  it("should handle emergency shutdown and reset", () => {
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
    expect(result.current.status).toBe("safe");
    expect(result.current.phase).toBe("safe");
    expect(result.current.gasLevel).toBe(8);
  });
});
