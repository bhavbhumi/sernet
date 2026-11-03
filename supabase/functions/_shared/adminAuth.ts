import { createClient } from "npm:@supabase/supabase-js@2";

type Level = "staff" | "admin" | "super_admin";

const ALLOWED: Record<Level, string[]> = {
  staff: ["super_admin", "admin", "editor"],
  admin: ["super_admin", "admin"],
  super_admin: ["super_admin"],
};

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

/**
 * Returns a 401/403 Response when the caller is not allowed, or null when allowed.
 * Accepts either the internal x-admin-key (ADMIN_API_KEY) or a signed-in user
 * whose role in user_roles meets the requested level.
 */
export async function requireAdmin(
  req: Request,
  cors: Record<string, string>,
  level: Level = "admin",
): Promise<Response | null> {
  const deny = (status: number, error: string) =>
    new Response(JSON.stringify({ error }), {
      status,
      headers: { ...cors, "Content-Type": "application/json" },
    });

  const adminKey = Deno.env.get("ADMIN_API_KEY");
  const providedKey = req.headers.get("x-admin-key");
  if (adminKey && providedKey && safeEqual(providedKey, adminKey)) return null;

  const auth = req.headers.get("authorization") ?? "";
  if (!auth.startsWith("Bearer ")) return deny(401, "Unauthorized");
  const token = auth.slice(7);

  const sb = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );
  const { data: userData, error } = await sb.auth.getUser(token);
  if (error || !userData?.user) return deny(401, "Unauthorized");

  const { data: roles } = await sb
    .from("user_roles")
    .select("role")
    .eq("user_id", userData.user.id);
  const ok = (roles ?? []).some((r: { role: string }) => ALLOWED[level].includes(r.role));
  return ok ? null : deny(403, "Forbidden");
}
