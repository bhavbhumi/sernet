import { createServerFn } from "@tanstack/react-start";
import { evaluateLiveChecks, type FetchedResource } from "./seoLiveChecks";

const SITE = "https://sernetindia.com";

async function get(path: string, binary = false): Promise<FetchedResource> {
  try {
    const res = await fetch(new URL(path, SITE), {
      headers: { "user-agent": "SERNET-SEO-Health/1.0" },
      redirect: "follow",
    });
    const body = binary
      ? String.fromCharCode(...new Uint8Array(0)).padEnd((await res.arrayBuffer()).byteLength, " ")
      : await res.text();
    return { ok: res.ok, status: res.status, body, url: res.url, contentType: res.headers.get("content-type") ?? undefined };
  } catch {
    return { ok: false, status: 0, body: "" };
  }
}

/** Checks the live public website only (fixed address, no user input). */
export const runLiveSeoChecks = createServerFn({ method: "GET" }).handler(async () => {
  const [home, robots, sitemapXml, sitemapPage, llms] = await Promise.all([
    get("/"), get("/robots.txt"), get("/sitemap.xml"), get("/sitemap"), get("/llms.txt"),
  ]);
  const ogUrl = home.body.match(/<meta[^>]+property=["']og:image["'][^>]*content=["']([^"']+)["']/i)?.[1];
  let ogImage: FetchedResource | null = null;
  if (ogUrl) {
    const u = new URL(ogUrl, SITE);
    if (u.hostname.endsWith("sernetindia.com") || u.hostname.endsWith(".supabase.co")) {
      ogImage = await get(u.toString(), true);
    }
  }
  return { checkedAt: new Date().toISOString(), checks: evaluateLiveChecks({ home, robots, sitemapXml, sitemapPage, llms, ogImage }) };
});
