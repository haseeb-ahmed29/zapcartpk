import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import OrderForm from "@/components/OrderForm";

describe("OrderForm Accessibility and UX Tests", () => {
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

  it("renders modal with proper dialog role and accessible close button", () => {
    const handleClose = vi.fn();
    render(<OrderForm product={dummyProduct} onClose={handleClose} />);

    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAttribute("aria-labelledby", "order-dialog-title");

    const closeBtn = screen.getByRole("button", { name: "Close order form" });
    expect(closeBtn).toBeInTheDocument();
    expect(closeBtn).toHaveAttribute("type", "button");
    expect(closeBtn).toHaveClass("focus-visible:ring-2");

    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("closes modal on Escape key press", () => {
    const handleClose = vi.fn();
    render(<OrderForm product={dummyProduct} onClose={handleClose} />);

    fireEvent.keyDown(window, { key: "Escape" });
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("closes modal when clicking backdrop overlay and ignores click inside dialog", () => {
    const handleClose = vi.fn();
    render(<OrderForm product={dummyProduct} onClose={handleClose} />);

    const dialogOverlay = screen.getByRole("dialog");
    const modalContent = screen.getByText("Order Place Karein");

    // Click inside modal content should not close
    fireEvent.click(modalContent);
    expect(handleClose).not.toHaveBeenCalled();

    // Click backdrop overlay directly should trigger onClose
    fireEvent.click(dialogOverlay);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("associates labels with form controls and displays aria-invalid on validation errors", () => {
    render(<OrderForm product={dummyProduct} onClose={vi.fn()} />);

    const nameInput = screen.getByLabelText(/Naam/i);
    expect(nameInput).toHaveAttribute("id", "order-name");
    expect(nameInput).toHaveAttribute("aria-invalid", "false");
    expect(nameInput).toHaveAttribute("aria-required", "true");
    expect(nameInput).toHaveAttribute("autocomplete", "name");

    const submitBtn = screen.getByRole("button", { name: /Order Confirm Karein/i });
    fireEvent.submit(submitBtn.closest("form")!);

    expect(nameInput).toHaveAttribute("aria-invalid", "true");
    expect(nameInput).toHaveAttribute("aria-describedby", "name-error");
    const errorMsg = screen.getByText("Naam kam az kam 2 characters ka hona chahiye");
    expect(errorMsg).toBeInTheDocument();
    expect(errorMsg).toHaveAttribute("role", "alert");
  });

  it("shows loading spinner state during form submission", () => {
    render(<OrderForm product={dummyProduct} onClose={vi.fn()} />);

    fireEvent.change(screen.getByLabelText(/Naam/i), { target: { value: "Ali Ahmed" } });
    fireEvent.change(screen.getByLabelText(/Mobile Number/i), { target: { value: "03001234567" } });
    fireEvent.change(screen.getByLabelText(/City/i), { target: { value: "Karachi" } });
    fireEvent.change(screen.getByLabelText(/Mukammal Address/i), {
      target: { value: "House 123, Block 5, Gulshan-e-Iqbal" },
    });

    const submitBtn = screen.getByRole("button", { name: /Order Confirm Karein/i });
    fireEvent.click(submitBtn);

    expect(screen.getByText("Order place ho raha hai...")).toBeInTheDocument();
    expect(submitBtn).toBeDisabled();
    expect(submitBtn).toHaveAttribute("aria-busy", "true");

    act(() => {
      vi.advanceTimersByTime(1500);
    });
  });

  it("includes autocomplete attributes and format hint for mobile", () => {
    render(<OrderForm product={dummyProduct} onClose={vi.fn()} />);

    const mobileInput = screen.getByLabelText(/Mobile Number/i);
    expect(mobileInput).toHaveAttribute("autocomplete", "tel");
    expect(mobileInput).toHaveAttribute("aria-required", "true");
    expect(mobileInput).toHaveAttribute("aria-describedby", "mobile-hint");
    expect(screen.getByText("Format: 03001234567 (11 digits)")).toBeInTheDocument();

    const citySelect = screen.getByLabelText(/City/i);
    expect(citySelect).toHaveAttribute("autocomplete", "address-level2");
    expect(citySelect).toHaveAttribute("aria-required", "true");

    const addressInput = screen.getByLabelText(/Mukammal Address/i);
    expect(addressInput).toHaveAttribute("autocomplete", "street-address");
    expect(addressInput).toHaveAttribute("aria-required", "true");
  });
});

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

  it("rejects invalid city selection not in allowed city whitelist", () => {
    render(<OrderForm product={dummyProduct} onClose={vi.fn()} />);

    fireEvent.change(screen.getByLabelText(/Naam/i), { target: { value: "Ali Ahmed" } });
    fireEvent.change(screen.getByLabelText(/Mobile Number/i), { target: { value: "03001234567" } });
    fireEvent.change(screen.getByLabelText(/City/i), { target: { value: "InvalidCityName" } });
    fireEvent.change(screen.getByLabelText(/Mukammal Address/i), {
      target: { value: "House 123, Block 5, Gulshan-e-Iqbal" },
    });

    const submitBtn = screen.getByRole("button", { name: /Order Confirm Karein/i });
    fireEvent.submit(submitBtn.closest("form")!);

    expect(screen.getByText("Mo'atabar city select karein")).toBeInTheDocument();
  });

  it("safely encodes user input in WhatsApp URL, uses noopener,noreferrer, and nullifies win.opener", () => {
    const mockWin = { opener: {} as unknown };
    vi.spyOn(window, "open").mockReturnValue(mockWin as Window);

    const handleClose = vi.fn();
    render(<OrderForm product={dummyProduct} onClose={handleClose} />);

    // Fill form fields with special characters that could trigger URL injection
    const nameInput = screen.getByPlaceholderText("Apna poora naam likhein");
    const mobileInput = screen.getByPlaceholderText("03XXXXXXXXX");
    const citySelect = screen.getByRole("combobox");
    const addressInput = screen.getByPlaceholderText("Ghar ka number, gali, mohalla, area");

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

    // Verify window.open parameters & opener nullification
    expect(target).toBe("_blank");
    expect(features).toBe("noopener,noreferrer");
    expect(mockWin.opener).toBeNull();

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
