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

  it("calculates and displays discount percentage badge when oldPrice is higher than price", () => {
    // 2500 vs 3500 is ~29% off: round(((3500 - 2500) / 3500) * 100) = 29
    render(<ProductCard {...defaultProps} />);

    const discountBadge = screen.getByLabelText("29% OFF discount");
    expect(discountBadge).toBeInTheDocument();
    expect(discountBadge).toHaveTextContent("29% OFF");
    expect(screen.getByText("Original price:")).toHaveClass("sr-only");
  });

  it("does not render discount badge when oldPrice is not provided", () => {
    const propsWithoutDiscount = {
      ...defaultProps,
      oldPrice: undefined,
    };
    render(<ProductCard {...propsWithoutDiscount} />);

    expect(screen.queryByText(/% OFF/)).not.toBeInTheDocument();
  });
});
