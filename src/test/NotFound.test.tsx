import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import NotFound from "@/pages/NotFound";

describe("NotFound Page Security & Rendering", () => {
  let consoleSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it("renders 404 header and home link", () => {
    render(
      <MemoryRouter initialEntries={["/unknown-route"]}>
        <NotFound />
      </MemoryRouter>
    );

    expect(screen.getByText("404")).toBeInTheDocument();
    expect(screen.getByText("Oops! Page not found")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Return to Home" })).toHaveAttribute("href", "/");
  });

  it("sanitizes CRLF and control characters from location.pathname in log outputs (CWE-117)", () => {
    render(
      <MemoryRouter initialEntries={["/test-path\r\n[FAKE_LOG_ENTRY]\x07"]}>
        <NotFound />
      </MemoryRouter>
    );

    expect(consoleSpy).toHaveBeenCalledWith(
      "404 Error: User attempted to access non-existent route:",
      "/test-path[FAKE_LOG_ENTRY]"
    );
  });
});
