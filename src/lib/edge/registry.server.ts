// Server-only registry of backend tools that previously ran as separate edge functions.
// Each handler keeps its original request/response contract (including its own
// admin authorization), so behaviour is unchanged after moving into the site.
export type EdgeHandler = (req: Request) => Promise<Response>;

export const EDGE_HANDLERS: Record<string, () => Promise<EdgeHandler>> = {
  "health-check": async () => (await import("./healthCheck.server")).handle,
  "bootstrap-admin": async () => (await import("./bootstrapAdmin.server")).handle,
  "manage-users": async () => (await import("./manageUsers.server")).handle,
  "seo-generate": async () => (await import("./seoGenerate.server")).handle,
  "summarize-content": async () => (await import("./summarizeContent.server")).handle,
  "wp-import": async () => (await import("./wpImport.server")).handle,
  "support-close-ticket": async () => (await import("./closeTicket.server")).handle,
};
