import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import OrderForm from "../components/OrderForm";

describe("OrderForm Security", () => {
  const dummyProduct = {
    name: "Test Mouse & Keyboard",
    price: 1500,
    image: "test.jpg",
  };

  beforeEach(() => {
    vi.useFakeTimers();
    vi.stubGlobal("open", vi.fn());
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("safely encodes special characters in user inputs when generating WhatsApp URL", async () => {
    const handleClose = vi.fn();
    render(<OrderForm product={dummyProduct} onClose={handleClose} />);

    const nameInput = screen.getByPlaceholderText("Apna poora naam likhein");
    const mobileInput = screen.getByPlaceholderText("03XXXXXXXXX");
    const citySelect = screen.getByRole("combobox");
    const addressInput = screen.getByPlaceholderText("Ghar ka number, gali, mohalla, area");
    const submitBtn = screen.getByRole("button", { name: "Order Confirm Karein" });

    fireEvent.change(nameInput, { target: { value: "Ali & Hassan #1" } });
    fireEvent.change(mobileInput, { target: { value: "03001234567" } });
    fireEvent.change(citySelect, { target: { value: "Lahore" } });
    fireEvent.change(addressInput, { target: { value: "House # 45 & Street 12, Block-C" } });

    fireEvent.click(submitBtn);

    // Fast-forward timer for submit setTimeout
    act(() => {
      vi.advanceTimersByTime(1500);
    });

    expect(window.open).toHaveBeenCalledTimes(1);
    const [openedUrl, target, features] = (window.open as ReturnType<typeof vi.fn>).mock.calls[0];

    expect(target).toBe("_blank");
    expect(features).toBe("noopener,noreferrer");

    // Extract text query param
    const urlObj = new URL(openedUrl);
    const textParam = urlObj.searchParams.get("text");

    expect(textParam).toContain("Ali & Hassan #1");
    expect(textParam).toContain("House # 45 & Street 12, Block-C");
    expect(openedUrl).not.toContain("Ali & Hassan #1"); // Raw unencoded string shouldn't be in raw URL query
    expect(openedUrl).toContain(encodeURIComponent("Ali & Hassan #1"));
  });
});
