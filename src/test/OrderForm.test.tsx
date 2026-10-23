import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import OrderForm from "../components/OrderForm";

describe("OrderForm Security Tests", () => {
  let openSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.useFakeTimers();
    openSpy = vi.spyOn(window, "open").mockImplementation(() => null);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("encodes user input safely into the WhatsApp URL and uses tabnabbing protection", () => {
    const testProduct = {
      name: "Gaming Mouse RGB",
      price: 2500,
      image: "mouse.jpg",
    };

    render(<OrderForm product={testProduct} onClose={() => {}} />);

    // Fill in form inputs including special URL characters like &, #, =, ?
    fireEvent.change(screen.getByPlaceholderText("Apna poora naam likhein"), {
      target: { value: "Ali & Khan #1" },
    });
    fireEvent.change(screen.getByPlaceholderText("03XXXXXXXXX"), {
      target: { value: "03001234567" },
    });
    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "Lahore" },
    });
    fireEvent.change(
      screen.getByPlaceholderText("Ghar ka number, gali, mohalla, area"),
      {
        target: { value: "House 123 & Street 4 = Main Road?" },
      }
    );

    // Submit form
    fireEvent.click(screen.getByText("Order Confirm Karein"));

    // Fast-forward past the 1500ms submit timeout
    act(() => {
      vi.advanceTimersByTime(1500);
    });

    expect(openSpy).toHaveBeenCalledTimes(1);

    const [url, target, windowFeatures] = openSpy.mock.calls[0];

    // Verify security features: noopener,noreferrer target window features
    expect(target).toBe("_blank");
    expect(windowFeatures).toBe("noopener,noreferrer");

    // Extract the 'text' query parameter from the URL
    const parsedUrl = new URL(url);
    const textParam = parsedUrl.searchParams.get("text");

    expect(textParam).not.toBeNull();
    // User inputs with special characters should be preserved in decoded form when parsed from searchParams,
    // meaning they were properly URL-encoded in the raw URL string
    expect(textParam).toContain("Ali & Khan #1");
    expect(textParam).toContain("House 123 & Street 4 = Main Road?");

    // Raw URL string should contain encoded values (e.g. %26 for &, %23 for #)
    expect(url).toContain("Ali%20%26%20Khan%20%231");
  });
});
