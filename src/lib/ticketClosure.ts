const SITE_ORIGIN = "https://sernetindia.com";
const SUPPORT_TICKETS_MODULE = "support/tickets";

export function getTicketRatingPath(ticketId: string): string {
  return `/portal?tab=tickets&ticket=${encodeURIComponent(ticketId)}`;
}

export function getTicketRatingUrl(ticketId: string): string {
  return new URL(getTicketRatingPath(ticketId), SITE_ORIGIN).toString();
}

/** Only client-portal paths may be used as a post-sign-in destination. */
export function safeClientPortalPath(value: string | null): string | null {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return null;
  const parsed = new URL(value, SITE_ORIGIN);
  if (parsed.origin !== SITE_ORIGIN) return null;
  if (parsed.pathname !== "/portal" && !parsed.pathname.startsWith("/portal/")) return null;
  return `${parsed.pathname}${parsed.search}${parsed.hash}`;
}

/** Mirrors the admin module gate for the ticket-closure server action. */
export function canManageSupportTickets(
  role: string | null | undefined,
  allowedModules: string[] | null | undefined,
): boolean {
  if (role === "super_admin") return true;
  if (role !== "admin" && role !== "editor") return false;
  if (!allowedModules?.length) return true;
  return allowedModules.includes(SUPPORT_TICKETS_MODULE);
}
