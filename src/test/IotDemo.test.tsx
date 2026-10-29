import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, beforeEach } from "vitest";
import GasMeter from "@/components/iot/GasMeter";
import IotDemo from "@/pages/IotDemo";

describe("GasMeter Accessibility", () => {
  it("renders with role='meter' and correct ARIA meter attributes", () => {
    render(<GasMeter value={25} status="safe" threshold={50} />);

    const meter = screen.getByRole("meter");
    expect(meter).toBeInTheDocument();
    expect(meter).toHaveAttribute("aria-label", "Live gas concentration");
    expect(meter).toHaveAttribute("aria-valuenow", "25");
    expect(meter).toHaveAttribute("aria-valuemin", "0");
    expect(meter).toHaveAttribute("aria-valuemax", "100");
    expect(meter).toHaveAttribute("aria-valuetext", "25% LEL");
  });
});

describe("IotDemo Header Accessibility", () => {
  beforeEach(() => {
    global.ResizeObserver = class ResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  });

  it("renders header back link with accessible aria-label", () => {
    render(
      <MemoryRouter>
        <IotDemo />
      </MemoryRouter>
    );

    const backLink = screen.getByRole("link", { name: "Back to store" });
    expect(backLink).toBeInTheDocument();
    expect(backLink).toHaveAttribute("href", "/");
  });
});
