import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ProductCard from "@/components/ProductCard";

describe("ProductCard", () => {
  const defaultProps = {
    name: "Gaming Mouse RGB",
    price: 2500,
    oldPrice: 3500,
    description: "High precision gaming mouse",
    image: "/mouse.jpg",
    onBuy: vi.fn(),
  };

  it("renders product name, price, and description", () => {
    render(<ProductCard {...defaultProps} />);

    expect(screen.getByText("Gaming Mouse RGB")).toBeInTheDocument();
    expect(screen.getByText("Rs. 2,500")).toBeInTheDocument();
    expect(screen.getByText("Rs. 3,500")).toBeInTheDocument();
    expect(screen.getByText("High precision gaming mouse")).toBeInTheDocument();
  });

  it("has an accessible aria-label on the Buy Now button and calls onBuy on click", () => {
    const onBuy = vi.fn();
    render(<ProductCard {...defaultProps} onBuy={onBuy} />);

    const buyButton = screen.getByRole("button", {
      name: "Buy Now: Gaming Mouse RGB for Rs. 2,500",
    });

    expect(buyButton).toBeInTheDocument();

    fireEvent.click(buyButton);
    expect(onBuy).toHaveBeenCalledTimes(1);
  });
});
