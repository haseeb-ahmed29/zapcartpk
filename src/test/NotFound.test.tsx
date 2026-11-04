import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import NotFound from "@/pages/NotFound";

describe("NotFound Page UX & Accessibility", () => {
  it("renders 404 heading and helpful guidance message within a main landmark", () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );

    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1, name: "404" })).toBeInTheDocument();
    expect(screen.getByText("Oops! Page not found")).toBeInTheDocument();
    expect(
      screen.getByText("The page you are looking for doesn't exist or has been moved.")
    ).toBeInTheDocument();
  });

  it("renders accessible 'Return to Home' link with focus ring and href='/'", () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );

    const homeLink = screen.getByRole("link", { name: /Return to Home/i });
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute("href", "/");
    expect(homeLink).toHaveClass("focus-visible:ring-2");
  });
});
