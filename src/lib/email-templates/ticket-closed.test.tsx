import React from "react";
import { render } from "@react-email/render";
import { describe, expect, it } from "vitest";
import { template } from "./ticket-closed";

describe("ticket closed email", () => {
  it("includes the ticket reference and its own client rating link", async () => {
    const data = template.previewData!;
    const html = await render(React.createElement(template.component, data));
    expect(html).toContain("TKT-00001");
    expect(html).toContain("Account statement request");
    expect(html).toContain("Rate this support");
    expect(html).toContain(data.ratingUrl);
  });

  it("does not show a rating action when the requester has no client portal", async () => {
    const html = await render(React.createElement(template.component, {
      ...template.previewData,
      ratingUrl: null,
    }));
    expect(html).not.toContain("Rate this support");
    expect(html).toContain("Your support ticket is closed");
  });
});
