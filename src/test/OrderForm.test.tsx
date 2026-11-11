import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import OrderForm from "@/components/OrderForm";

describe("OrderForm component", () => {
  const mockProduct = {
    name: "Gaming Mouse RGB",
    price: 2500,
    image: "test-image.jpg",
  };

  it("renders dialog with correct accessible attributes and labels", () => {
    const handleClose = vi.fn();
    render(<OrderForm product={mockProduct} onClose={handleClose} />);

    // Check dialog role and title association
    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAttribute("aria-labelledby", "order-form-title");

    // Check accessible close button
    const closeBtn = screen.getByRole("button", { name: "Order form band karein" });
    expect(closeBtn).toBeInTheDocument();

    // Check input field accessibility via associated labels
    expect(screen.getByLabelText(/naam/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/mobile number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/city/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/mukammal address/i)).toBeInTheDocument();
  });

  it("returns null when product is null", () => {
    const { container } = render(<OrderForm product={null} onClose={() => {}} />);
    expect(container).toBeEmptyDOMElement();
  });
});
