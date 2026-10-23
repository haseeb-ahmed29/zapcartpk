import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import OrderForm from "../components/OrderForm";

describe("OrderForm component", () => {
  const dummyProduct = {
    name: "Gaming Mouse RGB",
    price: 2500,
    image: "/test-image.jpg",
  };

  it("renders modal dialog with correct accessibility attributes", () => {
    const handleClose = vi.fn();
    render(<OrderForm product={dummyProduct} onClose={handleClose} />);

    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAttribute("aria-labelledby", "order-form-title");

    const closeBtn = screen.getByRole("button", { name: "Close modal" });
    expect(closeBtn).toBeInTheDocument();
  });

  it("links inputs with labels properly via htmlFor and id", () => {
    render(<OrderForm product={dummyProduct} onClose={() => {}} />);

    const nameInput = screen.getByLabelText(/Naam/i);
    expect(nameInput).toHaveAttribute("id", "order-name");

    const mobileInput = screen.getByLabelText(/Mobile Number/i);
    expect(mobileInput).toHaveAttribute("id", "order-mobile");

    const citySelect = screen.getByLabelText(/City/i);
    expect(citySelect).toHaveAttribute("id", "order-city");

    const addressInput = screen.getByLabelText(/Mukammal Address/i);
    expect(addressInput).toHaveAttribute("id", "order-address");
  });

  it("closes modal on Escape key press", () => {
    const handleClose = vi.fn();
    render(<OrderForm product={dummyProduct} onClose={handleClose} />);

    fireEvent.keyDown(window, { key: "Escape" });
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
