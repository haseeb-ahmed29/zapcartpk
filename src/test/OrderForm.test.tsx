import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import OrderForm from "@/components/OrderForm";

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
  },
}));

describe("OrderForm component", () => {
  const dummyProduct = {
    name: "Gaming Mouse RGB",
    price: 2500,
    image: "test-image.jpg",
  };

  it("renders order form elements when product is provided", () => {
    const handleClose = vi.fn();
    render(<OrderForm product={dummyProduct} onClose={handleClose} />);

    expect(screen.getByText("Order Place Karein")).toBeInTheDocument();
    expect(screen.getByLabelText(/Close order form/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Naam/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Mobile Number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/City/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Mukammal Address/i)).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", () => {
    const handleClose = vi.fn();
    render(<OrderForm product={dummyProduct} onClose={handleClose} />);

    const closeButton = screen.getByLabelText(/Close order form/i);
    fireEvent.click(closeButton);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("validates form input and submits successfully when valid", () => {
    vi.useFakeTimers();
    const handleClose = vi.fn();
    window.open = vi.fn();

    render(<OrderForm product={dummyProduct} onClose={handleClose} />);

    fireEvent.change(screen.getByLabelText(/Naam/i), { target: { value: "Ali Khan" } });
    fireEvent.change(screen.getByLabelText(/Mobile Number/i), { target: { value: "03001234567" } });
    fireEvent.change(screen.getByLabelText(/City/i), { target: { value: "Lahore" } });
    fireEvent.change(screen.getByLabelText(/Mukammal Address/i), { target: { value: "House 123, Street 4, Gulberg, Lahore" } });

    const submitBtn = screen.getByRole("button", { name: /Order Confirm Karein/i });
    fireEvent.click(submitBtn);

    expect(screen.getByText("Order place ho raha hai...")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1500);
    });

    expect(window.open).toHaveBeenCalled();
    expect(handleClose).toHaveBeenCalled();

    vi.useRealTimers();
  });
});
