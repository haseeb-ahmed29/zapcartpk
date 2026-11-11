import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

describe("Sidebar Cookie Security Tests", () => {
  let cookieSetterSpy: ReturnType<typeof vi.spyOn>;
  let lastCookieSet = "";

  beforeEach(() => {
    lastCookieSet = "";
    cookieSetterSpy = vi.spyOn(document, "cookie", "set").mockImplementation((val: string) => {
      lastCookieSet = val;
    });
  });

  afterEach(() => {
    cookieSetterSpy.mockRestore();
  });

  it("sets SameSite=Strict attribute when updating sidebar cookie state", () => {
    render(
      <SidebarProvider>
        <SidebarTrigger />
      </SidebarProvider>
    );

    const trigger = screen.getByRole("button", { name: /Toggle Sidebar/i });
    fireEvent.click(trigger);

    expect(lastCookieSet).toContain("SameSite=Strict");
    expect(lastCookieSet).toContain("sidebar:state=");
  });

  it("includes Secure flag when window.location.protocol is https:", () => {
    const originalLocation = window.location;
    // @ts-expect-error re-assigning location for testing
    delete window.location;
    // @ts-expect-error location mock
    window.location = { ...originalLocation, protocol: "https:" };

    render(
      <SidebarProvider>
        <SidebarTrigger />
      </SidebarProvider>
    );

    const trigger = screen.getByRole("button", { name: /Toggle Sidebar/i });
    fireEvent.click(trigger);

    expect(lastCookieSet).toContain("SameSite=Strict");
    expect(lastCookieSet).toContain("; Secure");

    // Restore location
    window.location = originalLocation;
  });
});
