import { createFileRoute } from "@tanstack/react-router";
import { articlePath } from "@/lib/articleRoute";

const BASE_URL = "https://sernetindia.com";

// Public, indexable static pages. Add new public pages here; leave out redirects, login and admin pages.
const STATIC_PATHS = [
  "/",
  "/about",
  "/about/philosophy",
  "/services",
  "/network",
  "/pricing",
  "/insights",
  "/awareness",
  "/updates",
  "/opinions",
  "/reviews",
  "/calculators",
  "/calculators/sip",
  "/calculators/lumpsum",
  "/calculators/brokerage",
  "/calculators/margin",
  "/calendars",
  "/market-holidays",
  "/economic-calendar",
  "/tickfunds",
  "/tushil",
  "/choicefinx",
  "/contact",
  "/schedule-call",
  "/open-account",
  "/support",
  "/complaints",
  "/raise-ticket",
  "/downloads",
  "/credit-claim",
  "/legal",
  "/investor-charter",
  "/quick-links",
  "/sitemap",
];

const escapeXml = (v: string) =>
  v.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[c]!);

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const { createClient } = await import("@supabase/supabase-js");
        const key = process.env.SUPABASE_PUBLISHABLE_KEY!;
        const supabase = createClient(process.env.SUPABASE_URL!, key, {
          auth: { persistSession: false, autoRefreshToken: false },
        });
        const paths = new Set<string>(STATIC_PATHS);
        const pageSize = 1000;
        for (let offset = 0; ; ) {
          const { data, error } = await supabase
            .from("articles")
            .select("id, content_type")
            .eq("status", "published")
            .order("id")
            .range(offset, offset + pageSize - 1);
          if (error) {
            console.error("Sitemap article query failed", error);
            return new Response("Sitemap temporarily unavailable", { status: 503, headers: { "Cache-Control": "no-store" } });
          }
          if (!data || data.length === 0) break;
          for (const row of data) paths.add(articlePath(row.id, row.content_type));
          offset += data.length;
          if (data.length < pageSize) break;
        }
        const urls = [...paths].map((p) => `<url><loc>${escapeXml(BASE_URL + p)}</loc></url>`).join("");
        const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;
        return new Response(xml, {
          headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});
