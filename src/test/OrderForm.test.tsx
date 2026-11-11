import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import OrderForm from "../components/OrderForm";

const product = { name: "Test Mouse & Keyboard", price: 1500, image: "test.jpg" };

describe("OrderForm", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.stubGlobal("open", vi.fn());
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("renders an accessible dialog with associated form labels", () => {
    render(<OrderForm product={product} onClose={vi.fn()} />);
    expect(screen.getByRole("dialog")).toHaveAttribute("aria-modal", "true");
    expect(screen.getByRole("dialog")).toHaveAttribute("aria-labelledby", "order-form-title");
    expect(screen.getByRole("button", { name: /order form band karein/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/naam/i)).toHaveAttribute("id", "order-name");
    expect(screen.getByLabelText(/mobile number/i)).toHaveAttribute("id", "order-mobile");
    expect(screen.getByLabelText(/city/i)).toHaveAttribute("id", "order-city");
    expect(screen.getByLabelText(/mukammal address/i)).toHaveAttribute("id", "order-address");
  });

  it("limits field lengths in the browser", () => {
    render(<OrderForm product={product} onClose={vi.fn()} />);
    expect(screen.getByLabelText(/naam/i)).toHaveAttribute("maxLength", "100");
    expect(screen.getByLabelText(/mobile number/i)).toHaveAttribute("maxLength", "11");
    expect(screen.getByLabelText(/mukammal address/i)).toHaveAttribute("maxLength", "300");
  });

  it("closes when Escape is pressed", () => {
    const onClose = vi.fn();
    render(<OrderForm product={product} onClose={onClose} />);
    fireEvent.keyDown(window, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("encodes user input and opens WhatsApp with safe window features", () => {
    render(<OrderForm product={product} onClose={vi.fn()} />);
    fireEvent.change(screen.getByPlaceholderText("Apna poora naam likhein"), { target: { value: "Ali & Hassan #1" } });
    fireEvent.change(screen.getByPlaceholderText("03XXXXXXXXX"), { target: { value: "03001234567" } });
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "Lahore" } });
    fireEvent.change(screen.getByPlaceholderText("Ghar ka number, gali, mohalla, area"), { target: { value: "House # 45 & Street 12, Block-C" } });
    fireEvent.click(screen.getByRole("button", { name: "Order Confirm Karein" }));
    act(() => { vi.advanceTimersByTime(1500); });
    expect(window.open).toHaveBeenCalledTimes(1);
    const [openedUrl, target, features] = (window.open as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(target).toBe("_blank");
    expect(features).toBe("noopener,noreferrer");
    const text = new URL(openedUrl).searchParams.get("text");
    expect(text).toContain("Ali & Hassan #1");
    expect(text).toContain("House # 45 & Street 12, Block-C");
    expect(openedUrl).not.toContain("Ali & Hassan #1");
  });

  it("renders nothing when there is no product", () => {
    const { container } = render(<OrderForm product={null} onClose={vi.fn()} />);
    expect(container).toBeEmptyDOMElement();
  });
});
