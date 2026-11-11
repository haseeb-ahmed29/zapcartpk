import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import NotFound from "@/pages/NotFound";

describe("NotFound page", () => {
  let consoleSpy: ReturnType<typeof vi.spyOn>;
  beforeEach(() => { consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {}); });
  afterEach(() => { consoleSpy.mockRestore(); });

  it("renders 404 guidance inside a main landmark", () => {
    render(<MemoryRouter initialEntries={["/unknown-route"]}><NotFound /></MemoryRouter>);
    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1, name: "404" })).toBeInTheDocument();
    expect(screen.getByText("Oops! Page not found")).toBeInTheDocument();
    expect(screen.getByText("The page you are looking for doesn't exist or has been moved.")).toBeInTheDocument();
  });

  it("renders an accessible Return to Home link", () => {
    render(<MemoryRouter><NotFound /></MemoryRouter>);
    const homeLink = screen.getByRole("link", { name: /Return to Home/i });
    expect(homeLink).toHaveAttribute("href", "/");
    expect(homeLink).toHaveClass("focus-visible:ring-2");
  });

  it("sanitizes CRLF and control characters in pathname log output", () => {
    render(<MemoryRouter initialEntries={["/test-path\r\n[FAKE_LOG_ENTRY]\x07"]}><NotFound /></MemoryRouter>);
    expect(consoleSpy).toHaveBeenCalledWith(
      "404 Error: User attempted to access non-existent route:",
      "/test-path[FAKE_LOG_ENTRY]",
    );
  });
});
