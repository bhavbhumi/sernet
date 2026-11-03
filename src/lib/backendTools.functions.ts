import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import { z } from "zod";

export const BACKEND_TOOLS = [
  "health-check",
  "bootstrap-admin",
  "manage-users",
  "seo-generate",
  "summarize-content",
  "wp-import",
] as const;
export type BackendTool = (typeof BACKEND_TOOLS)[number];

const InputSchema = z.object({
  name: z.enum(BACKEND_TOOLS),
  body: z.unknown().optional(),
});

/**
 * Runs one of SERNET's backend tools inside the site's server runtime.
 * The caller's Authorization / x-admin-key headers are forwarded unchanged, so
 * each tool's own admin check (requireAdmin, role lookups) still applies.
 */
export const runBackendTool = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => InputSchema.parse(input))
  .handler(async ({ data }) => {
    const { EDGE_HANDLERS } = await import("./edge/registry.server");
    const handler = await EDGE_HANDLERS[data.name]!();
    const headers = new Headers({ "content-type": "application/json" });
    for (const name of ["authorization", "x-admin-key", "x-forwarded-for", "cf-connecting-ip", "user-agent"]) {
      const value = getRequestHeader(name);
      if (value) headers.set(name, value);
    }
    const request = new Request(`https://internal.sernet/${data.name}`, {
      method: "POST",
      headers,
      body: JSON.stringify(data.body ?? {}),
    });
    const response = await handler(request);
    const text = await response.text();
    let json: unknown = null;
    try {
      json = text ? JSON.parse(text) : null;
    } catch {
      json = { error: text };
    }
    return { status: response.status, data: json as Record<string, unknown> | null };
  });
