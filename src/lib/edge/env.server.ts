// Server-only environment lookup for ported backend tools.
// Lovable Cloud injects platform secrets (SUPABASE_*, LOVABLE_API_KEY) and user
// secrets (ADMIN_API_KEY) into the server runtime as process.env.
const FALLBACKS: Record<string, string[]> = {
  SUPABASE_URL: ["SUPABASE_URL", "VITE_SUPABASE_URL"],
  SUPABASE_ANON_KEY: ["SUPABASE_ANON_KEY", "SUPABASE_PUBLISHABLE_KEY", "VITE_SUPABASE_PUBLISHABLE_KEY"],
};

export function serverEnv(name: string): string | undefined {
  for (const key of FALLBACKS[name] ?? [name]) {
    const value = process.env[key];
    if (value) return value;
  }
  return undefined;
}
