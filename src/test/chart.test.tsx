import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { ChartStyle } from "@/components/ui/chart";

describe("ChartStyle Security Tests", () => {
  it("sanitizes id, key, and color inputs to prevent CSS injection and XSS", () => {
    const maliciousId = 'test-id"</style><script>alert("xss")</script>';
    const maliciousKey = 'key1; } body { display: none; }';
    const maliciousColor = 'hsl(100 50% 50%)"; </style><script>alert(1)</script>';

    const config = {
      [maliciousKey]: {
        label: "Malicious Key",
        color: maliciousColor,
      },
    };

    const { container } = render(<ChartStyle id={maliciousId} config={config} />);
    const styleElement = container.querySelector("style");

    expect(styleElement).not.toBeNull();
    const styleContent = styleElement?.innerHTML || "";

    // Verify HTML tags, quotes, semicolons, and curly braces are stripped
    expect(styleContent).not.toContain("<script>");
    expect(styleContent).not.toContain("</style>");
    expect(styleContent).not.toContain('"');
    expect(styleContent).not.toContain("display: none");
    expect(styleContent).not.toContain("body {");

    // Verify sanitized outputs remain safe
    expect(styleContent).toContain("[data-chart=test-idstylescriptalertxssscript]");
    expect(styleContent).toContain("--color-key1bodydisplaynone:");
  });
});
