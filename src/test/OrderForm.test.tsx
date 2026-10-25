import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import OrderForm from "@/components/OrderForm";

describe("OrderForm Security Tests", () => {
  const dummyProduct = {
    name: "Gaming Mouse & Keyboard #1",
    price: 2500,
    image: "test.jpg",
  };

  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(window, "open").mockImplementation(() => null);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("safely encodes user input in WhatsApp URL and uses noopener,noreferrer", () => {
    const handleClose = vi.fn();
    render(<OrderForm product={dummyProduct} onClose={handleClose} />);

    // Ensure form controls are accessible via label text and close button has aria-label
    const closeBtn = screen.getByRole("button", { name: /Modal close karein/i });
    expect(closeBtn).toBeInTheDocument();

    const nameInput = screen.getByLabelText(/Naam \*/i);
    const mobileInput = screen.getByLabelText(/Mobile Number \*/i);
    const citySelect = screen.getByLabelText(/City \*/i);
    const addressInput = screen.getByLabelText(/Mukammal Address \*/i);

    expect(nameInput).toBeInTheDocument();
    expect(mobileInput).toBeInTheDocument();
    expect(citySelect).toBeInTheDocument();
    expect(addressInput).toBeInTheDocument();

    fireEvent.change(nameInput, { target: { value: "John & Doe #Special" } });
    fireEvent.change(mobileInput, { target: { value: "03001234567" } });
    fireEvent.change(citySelect, { target: { value: "Lahore" } });
    fireEvent.change(addressInput, {
      target: { value: "House #123, Street 45 & Main Blvd ?test=1" },
    });

    const submitBtn = screen.getByRole("button", { name: /Order Confirm Karein/i });
    fireEvent.click(submitBtn);

    // Fast-forward timeout for submit action
    act(() => {
      vi.advanceTimersByTime(1500);
    });

    expect(window.open).toHaveBeenCalledTimes(1);

    const [openedUrl, target, features] = (window.open as ReturnType<typeof vi.fn>).mock.calls[0];

    // Verify window.open parameters
    expect(target).toBe("_blank");
    expect(features).toBe("noopener,noreferrer");

    // Verify URL parameters are safely percent-encoded and do not contain raw unencoded special characters
    expect(openedUrl).toContain("https://wa.me/923701930960?text=");

    const textParam = openedUrl.split("?text=")[1];

    // Ensure raw unencoded '&' and '#' from user inputs are encoded in the query param
    expect(textParam).not.toContain("John & Doe");
    expect(textParam).toContain(encodeURIComponent("John & Doe #Special"));
    expect(textParam).toContain(encodeURIComponent("House #123, Street 45 & Main Blvd ?test=1"));
    expect(textParam).toContain(encodeURIComponent("Gaming Mouse & Keyboard #1"));
  });
});
