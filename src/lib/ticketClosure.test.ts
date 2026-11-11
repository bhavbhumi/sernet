import { describe, expect, it } from "vitest";
import { canManageSupportTickets, getTicketRatingPath, getTicketRatingUrl, safeClientPortalPath } from "./ticketClosure";

const ticketId = "2be2b2f2-e7c4-5c98-ae07-0e61b509f3b9";

describe("ticket closure rating links", () => {
  it("links directly to the selected ticket in the client portal", () => {
    expect(getTicketRatingPath(ticketId)).toBe(`/portal?tab=tickets&ticket=${ticketId}`);
    expect(getTicketRatingUrl(ticketId)).toBe(`https://sernetindia.com/portal?tab=tickets&ticket=${ticketId}`);
  });

  it("returns signed-in clients to the requested portal ticket", () => {
    expect(safeClientPortalPath(getTicketRatingPath(ticketId))).toBe(getTicketRatingPath(ticketId));
  });

  it.each([null, "", "/admin", "https://example.com/portal", "//example.com/portal", "/portal.evil"])
    ("rejects a non-client-portal return path: %s", (value) => {
      expect(safeClientPortalPath(value)).toBeNull();
    });
});

describe("ticket closure staff permission", () => {
  it("allows staff explicitly granted Support Tickets", () => {
    expect(canManageSupportTickets("admin", ["support/tickets", "support/service-ratings"])).toBe(true);
  });

  it("blocks staff without Support Tickets when explicit permissions exist", () => {
    expect(canManageSupportTickets("admin", ["sales/crm"])).toBe(false);
  });

  it("allows a super administrator", () => {
    expect(canManageSupportTickets("super_admin", [])).toBe(true);
  });

  it("blocks a portal-only user", () => {
    expect(canManageSupportTickets(null, null)).toBe(false);
  });
});
