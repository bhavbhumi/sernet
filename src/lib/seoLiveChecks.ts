export type CheckStatus = 'pass' | 'warn' | 'fail';
export type CheckCategory = 'technical' | 'content' | 'performance' | 'social' | 'ai';

export interface LiveSEOCheck {
  id: string;
  label: string;
  status: CheckStatus;
  detail: string;
  recommendation?: string;
  category: CheckCategory;
}

export interface FetchedResource {
  ok: boolean;
  status: number;
  body: string;
  size?: number;
  contentType?: string;
  url?: string;
}

export interface LiveInputs {
  home: FetchedResource;
  robots: FetchedResource;
  sitemapXml: FetchedResource;
  sitemapPage: FetchedResource;
  llms: FetchedResource;
  ogImage: FetchedResource | null;
}

const meta = (html: string, attr: 'name' | 'property', key: string): string | null => {
  const re = new RegExp(`<meta[^>]+${attr}=["']${key}["'][^>]*>`, 'i');
  const tag = html.match(re)?.[0];
  if (!tag) return null;
  return tag.match(/content=["']([^"']*)["']/i)?.[1] ?? '';
};

const decode = (s: string) =>
  s.replace(/&amp;/g, '&').replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>');

/** Pure evaluation of the live site's responses — deterministic and testable. */
export function evaluateLiveChecks(input: LiveInputs): LiveSEOCheck[] {
  const { home, robots, sitemapXml, sitemapPage, llms, ogImage } = input;
  const html = home.body;
  const checks: LiveSEOCheck[] = [];
  const add = (c: LiveSEOCheck) => checks.push(c);

  add({ id: 'https', label: 'HTTPS Enabled', category: 'technical',
    status: home.ok && (home.url ?? '').startsWith('https://') ? 'pass' : 'fail',
    detail: home.ok ? `Homepage responded ${home.status} over HTTPS` : `Homepage responded ${home.status}` });

  const blocksAll = /User-agent:\s*\*[^]*?Disallow:\s*\/\s*$/im.test(robots.body);
  add({ id: 'robots', label: 'Robots.txt', category: 'technical',
    status: !robots.ok ? 'fail' : blocksAll ? 'fail' : 'pass',
    detail: !robots.ok ? `/robots.txt returned ${robots.status}` : blocksAll ? 'robots.txt blocks all crawlers' : '/robots.txt is present and allows crawling',
    recommendation: blocksAll ? 'Remove the wildcard "Disallow: /" rule' : undefined });

  const urlCount = (sitemapXml.body.match(/<loc>/g) ?? []).length;
  add({ id: 'sitemap-xml', label: 'XML Sitemap', category: 'technical',
    status: sitemapXml.ok && urlCount > 0 ? 'pass' : 'fail',
    detail: sitemapXml.ok ? `/sitemap.xml lists ${urlCount.toLocaleString('en-IN')} addresses` : `/sitemap.xml returned ${sitemapXml.status}` });

  add({ id: 'sitemap', label: 'HTML Sitemap', category: 'technical',
    status: sitemapPage.ok ? 'pass' : 'warn',
    detail: sitemapPage.ok ? '/sitemap page is available' : `/sitemap returned ${sitemapPage.status}` });

  const viewport = meta(html, 'name', 'viewport');
  add({ id: 'viewport', label: 'Viewport Meta', category: 'technical',
    status: viewport ? 'pass' : 'fail', detail: viewport ? 'Viewport meta tag is present' : 'No viewport meta tag on homepage' });

  const canonical = html.match(/<link[^>]+rel=["']canonical["'][^>]*>/i)?.[0];
  add({ id: 'canonical', label: 'Canonical Tag', category: 'technical',
    status: canonical ? 'pass' : 'warn', detail: canonical ? 'Homepage has a canonical link' : 'No canonical link on homepage' });

  const favicon = /<link[^>]+rel=["'][^"']*icon[^"']*["']/i.test(html);
  add({ id: 'favicon', label: 'Favicon', category: 'technical',
    status: favicon ? 'pass' : 'warn', detail: favicon ? 'Favicon link is present' : 'No favicon link found' });

  const jsonLd = /<script[^>]+application\/ld\+json/i.test(html);
  add({ id: 'jsonld', label: 'JSON-LD Schema', category: 'technical',
    status: jsonLd ? 'pass' : 'warn', detail: jsonLd ? 'Structured data found on homepage' : 'No structured data on homepage' });

  const ga = html.match(/G-[A-Z0-9]{6,}/)?.[0];
  add({ id: 'ga4', label: 'Google Analytics (GA4)', category: 'technical',
    status: ga ? 'pass' : 'warn', detail: ga ? `GA4 tag ${ga} found` : 'No GA4 tag found on homepage' });

  add({ id: 'llms', label: 'LLMs.txt (AI Discovery)', category: 'ai',
    status: llms.ok && llms.body.trim().length > 0 ? 'pass' : 'warn',
    detail: llms.ok ? '/llms.txt is available for AI crawlers' : `/llms.txt returned ${llms.status}` });

  // Social
  const ogTitle = meta(html, 'property', 'og:title');
  const ogDesc = meta(html, 'property', 'og:description');
  const ogImg = meta(html, 'property', 'og:image');
  const ogMissing = [!ogTitle && 'title', !ogDesc && 'description', !ogImg && 'image'].filter(Boolean);
  add({ id: 'og', label: 'Open Graph Tags', category: 'social',
    status: ogMissing.length ? 'fail' : 'pass',
    detail: ogMissing.length ? `Missing og:${ogMissing.join(', og:')}` : 'og:title, og:description and og:image are set' });

  const card = meta(html, 'name', 'twitter:card');
  add({ id: 'twitter', label: 'Twitter Card Tags', category: 'social',
    status: card ? 'pass' : 'warn', detail: card ? `twitter:card is "${card}"` : 'No twitter:card tag' });

  const imgKb = ogImage ? Math.round((ogImage.size ?? ogImage.body.length) / 1024) : 0;
  add({ id: 'og-image', label: 'Share Image', category: 'social',
    status: !ogImage || !ogImage.ok ? 'fail' : imgKb > 300 ? 'warn' : 'pass',
    detail: !ogImage ? 'No share image declared' : !ogImage.ok ? `Share image returned ${ogImage.status}` : `Share image loads (${imgKb} KB)`,
    recommendation: imgKb > 300 ? 'Keep the share image under 300 KB so WhatsApp shows it' : undefined });

  // Performance — images referenced in the server-rendered homepage
  const imgs = [...html.matchAll(/<img[^>]+src=["']([^"']+)["']/gi)].map(m => m[1]);
  const legacy = imgs.filter(src => /\.(png|jpe?g)(\?|$)/i.test(src) && !/favicon|og-image/i.test(src));
  add({ id: 'webp', label: 'WebP Images', category: 'performance',
    status: legacy.length ? 'warn' : 'pass',
    detail: legacy.length
      ? `${legacy.length} homepage image(s) still PNG/JPG: ${legacy.slice(0, 3).map(s => s.split('/').pop()).join(', ')}`
      : `All ${imgs.length} homepage images use modern formats`,
    recommendation: legacy.length ? 'Convert these images to WebP' : undefined });

  const ssr = /<h1[\s>]/i.test(html) && html.length > 5000;
  add({ id: 'ssr', label: 'Server-rendered Content', category: 'performance',
    status: ssr ? 'pass' : 'fail', detail: ssr ? 'Homepage content is in the initial HTML' : 'Homepage HTML has no rendered content' });

  // Content
  const h1s = (html.match(/<h1[\s>]/gi) ?? []).length;
  add({ id: 'h1', label: 'Single H1 on Homepage', category: 'content',
    status: h1s === 1 ? 'pass' : h1s === 0 ? 'fail' : 'warn', detail: `Homepage has ${h1s} H1 heading(s)` });

  const title = decode(html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1]?.trim() ?? '');
  add({ id: 'title-length', label: 'Title Length (≤60 chars)', category: 'content',
    status: !title ? 'fail' : title.length > 60 ? 'warn' : 'pass',
    detail: title ? `"${title}" — ${title.length} characters` : 'No title tag' });

  const desc = decode(meta(html, 'name', 'description') ?? '');
  add({ id: 'meta-desc', label: 'Meta Description (≤160 chars)', category: 'content',
    status: !desc ? 'fail' : desc.length > 160 ? 'warn' : 'pass',
    detail: desc ? `${desc.length} characters` : 'No meta description' });

  return checks;
}
