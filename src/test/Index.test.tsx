import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import Index from "@/pages/Index";

describe("Index Page Accessibility & Navigation", () => {
  it("renders a skip-to-content accessibility link pointing to main content", () => {
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
  });

  it("renders main landmark with id='main-content' and tabIndex='-1'", () => {
    render(
      <MemoryRouter>
        <Index />
      </MemoryRouter>
    );

    const mainLandmark = screen.getByRole("main");
    expect(mainLandmark).toBeInTheDocument();
    expect(mainLandmark).toHaveAttribute("id", "main-content");
    expect(mainLandmark).toHaveAttribute("tabindex", "-1");
  });

  it("renders navbar with accessible role and labeled sections", () => {
    render(
      <MemoryRouter>
        <Index />
      </MemoryRouter>
    );

    const nav = screen.getByRole("navigation", { name: "Main Navigation" });
    expect(nav).toBeInTheDocument();

    const iotLink = screen.getByRole("link", { name: "IoT Demo" });
    expect(iotLink).toBeInTheDocument();
    expect(iotLink).toHaveAttribute("href", "/iot-demo");

    const productsSection = screen.getByRole("region", { name: "Hamari Products" });
    expect(productsSection).toBeInTheDocument();
  });
});
