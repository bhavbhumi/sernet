import { supabase } from "@/integrations/supabase/client";
import { runBackendTool, type BackendTool } from "./backendTools.functions";

/**
 * Client helper with the same `{ data, error }` shape as `supabase.functions.invoke`,
 * so admin screens keep their existing handling. Sends the signed-in user's
 * session token (and an optional internal admin key) to the server.
 */
export async function invokeBackendTool<T = any>(
  name: BackendTool,
  options: { body?: unknown; headers?: Record<string, string> } = {},
): Promise<{ data: T | null; error: Error | null }> {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;
    const headers: Record<string, string> = { ...(options.headers ?? {}) };
    if (token && !headers["Authorization"] && !headers["authorization"]) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    const result = await runBackendTool({ data: { name, body: options.body }, headers });
    if (result.status >= 400) {
      const message =
        (result.data && typeof result.data["error"] === "string" && (result.data["error"] as string)) ||
        `Request failed (${result.status})`;
      const error = Object.assign(new Error(message), { status: result.status, context: result.data });
      return { data: result.data as T | null, error };
    }
    return { data: result.data as T, error: null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err : new Error(String(err)) };
  }
}
