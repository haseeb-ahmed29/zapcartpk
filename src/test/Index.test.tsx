import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import Index from "@/pages/Index";

describe("Index Page Accessibility & Navigation", () => {
  it("renders skip to main content link targeting the main content container", () => {
    render(
      <MemoryRouter>
        <Index />
      </MemoryRouter>
    );

    const skipLink = screen.getByRole("link", { name: "Skip to main content" });
    expect(skipLink).toBeInTheDocument();
    expect(skipLink).toHaveAttribute("href", "#main-content");
    expect(skipLink).toHaveClass("sr-only");
    expect(skipLink).toHaveClass("focus:not-sr-only");

    const mainContent = document.getElementById("main-content");
    expect(mainContent).not.toBeNull();
    expect(mainContent?.tagName.toLowerCase()).toBe("main");
    expect(mainContent).toHaveAttribute("tabindex", "-1");
  });
});
