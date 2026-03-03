const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const BLOG_BASE = 'https://sernetindia.com';
const BLOG_LISTING = `${BLOG_BASE}/blog-dynamic/`;

// ── Helpers ─────────────────────────────────────────────────────────────

function mapCategory(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes('economy') || lower.includes('fiscal') || lower.includes('budget') || lower.includes('trade') || lower.includes('foreign') || lower.includes('cpi') || lower.includes('gdp') || lower.includes('fmcg') || lower.includes('rbi')) return 'Economy';
  if (lower.includes('investment') || lower.includes('mutual fund') || lower.includes('mf') || lower.includes('sip') || lower.includes('fpi') || lower.includes('gold') || lower.includes('debt fund') || lower.includes('passive') || lower.includes('etf') || lower.includes('folio')) return 'Investment';
  if (lower.includes('trading') || lower.includes('ipo') || lower.includes('sebi') || lower.includes('buyback') || lower.includes('large cap') || lower.includes('mid-cap') || lower.includes('mid cap') || lower.includes('swing') || lower.includes('nifty') || lower.includes('equity') || lower.includes('stock')) return 'Trading';
  if (lower.includes('weekly') || lower.includes('market wrap') || lower.includes('capsule') || lower.includes('trigger') || lower.includes('outlook')) return 'Weekly Update';
  if (lower.includes('insurance')) return 'Insurance';
  return 'Economy';
}

function parseDateStr(raw: string): string | null {
  if (!raw) return null;
  const cleaned = raw.trim().replace(/(\d+)-([A-Za-z]+)-(\d+)/, '$1 $2 $3').replace(/(\d+)([A-Za-z]+)(\d+)/, '$1 $2 $3');
  try {
    const d = new Date(cleaned);
    if (!isNaN(d.getTime())) return d.toISOString().split('T')[0];
  } catch { /* ignore */ }
  return null;
}

function calcReadTime(text: string): string {
  const words = text.replace(/[#*|\-\[\]()>]/g, ' ').split(/\s+/).filter(Boolean).length;
  const mins = Math.max(1, Math.ceil(words / 200));
  return `${mins} min read`;
}

function decodeEntities(text: string): string {
  return text
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/&nbsp;/g, ' ')
    .replace(/&hellip;/g, '...').replace(/&ndash;/g, '–').replace(/&mdash;/g, '—')
    .replace(/&#8211;/g, '–').replace(/&#8212;/g, '—').replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"').replace(/&#8221;/g, '"').replace(/&#8216;/g, "'")
    .replace(/&rsquo;/g, "'").replace(/&lsquo;/g, "'").replace(/&rdquo;/g, '"').replace(/&ldquo;/g, '"');
}

// ── HTML table → Markdown pipe table ────────────────────────────────────

function htmlTableToMarkdown(tableHtml: string): string {
  const rows: string[][] = [];
  const trRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  let trMatch;
  while ((trMatch = trRegex.exec(tableHtml)) !== null) {
    const cells: string[] = [];
    const cellRegex = /<(?:td|th)[^>]*>([\s\S]*?)<\/(?:td|th)>/gi;
    let cellMatch;
    while ((cellMatch = cellRegex.exec(trMatch[1])) !== null) {
      let cellText = cellMatch[1]
        .replace(/<b[^>]*>|<\/b>/gi, '').replace(/<strong[^>]*>|<\/strong>/gi, '')
        .replace(/<em[^>]*>|<\/em>/gi, '').replace(/<i[^>]*>|<\/i>/gi, '')
        .replace(/<span[^>]*>/gi, '').replace(/<\/span>/gi, '')
        .replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, '');
      cellText = decodeEntities(cellText).replace(/\s+/g, ' ').trim().replace(/\|/g, '∣');
      cells.push(cellText);
    }
    if (cells.length > 0) rows.push(cells);
  }
  if (rows.length < 2) return '';
  const maxCols = Math.max(...rows.map(r => r.length));
  const normalized = rows.map(r => { while (r.length < maxCols) r.push(''); return r; });
  const lines: string[] = [];
  lines.push('| ' + normalized[0].join(' | ') + ' |');
  lines.push('| ' + normalized[0].map(() => '---').join(' | ') + ' |');
  for (let i = 1; i < normalized.length; i++) {
    lines.push('| ' + normalized[i].join(' | ') + ' |');
  }
  return lines.join('\n');
}

// ── Scrape individual article page ──────────────────────────────────────

interface ScrapeResult {
  title: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  excerpt: string | null;
  body: string | null;
  thumbnailUrl: string | null;
  mediaUrl: string | null;
  dateStr: string | null;
  wpCategory: string | null;
  readTime: string | null;
}

async function scrapeArticlePage(url: string): Promise<ScrapeResult> {
  const empty: ScrapeResult = { title: null, metaTitle: null, metaDescription: null, excerpt: null, body: null, thumbnailUrl: null, mediaUrl: null, dateStr: null, wpCategory: null, readTime: null };
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; SERNET-Bot/1.0)' } });
    if (!res.ok) return empty;
    const html = await res.text();

    // ── 1. Extract SEO meta fields ──
    const metaTitleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const metaTitle = metaTitleMatch ? decodeEntities(metaTitleMatch[1]).replace(/\s*[-–|].*$/, '').trim() : null;

    const metaDescMatch = html.match(/<meta[^>]+property="og:description"[^>]+content="([^"]+)"/i) ||
                           html.match(/<meta[^>]+name="description"[^>]+content="([^"]+)"/i);
    const metaDescription = metaDescMatch ? decodeEntities(metaDescMatch[1]).substring(0, 300) : null;

    // ── 2. Extract Blog Read Title (h2 inside hero) ──
    let title: string | null = null;
    const heroTitleMatch = html.match(/class="blogdetails-hero-title[^"]*"[^>]*>[\s\S]*?<h2[^>]*>([\s\S]*?)<\/h2>/i) ||
                            html.match(/<h1[^>]*class="[^"]*entry-title[^"]*"[^>]*>([\s\S]*?)<\/h1>/i) ||
                            html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    if (heroTitleMatch) {
      title = heroTitleMatch[1].replace(/<[^>]+>/g, '').trim();
      title = decodeEntities(title);
    }

    // ── 3. Extract Blog Short Desc → excerpt ──
    let excerpt: string | null = null;
    const heroDescMatch = html.match(/class="blogdetails-hero-title[^"]*"[^>]*>[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>/i);
    if (heroDescMatch) {
      excerpt = heroDescMatch[1].replace(/<[^>]+>/g, '').trim();
      excerpt = decodeEntities(excerpt).substring(0, 500);
    }
    if (!excerpt) excerpt = metaDescription;

    // ── 4. Extract Featured Image → media_url (actual image) ──
    let mediaUrl: string | null = null;
    const ogImageMatch = html.match(/<meta[^>]+property="og:image"[^>]+content="([^"]+)"/i) ||
                          html.match(/<meta[^>]+content="([^"]+)"[^>]+property="og:image"/i);
    if (ogImageMatch) {
      const imgUrl = ogImageMatch[1];
      if (/\.(jpg|jpeg|png|gif|webp|svg)/i.test(imgUrl)) {
        mediaUrl = imgUrl;
      }
    }
    // Also try featured image in content
    if (!mediaUrl) {
      const featImgMatch = html.match(/class="[^"]*featured[^"]*"[^>]*>[\s\S]*?<img[^>]+src="([^"]+)"/i) ||
                            html.match(/class="[^"]*blog-image[^"]*"[^>]*>[\s\S]*?<img[^>]+src="([^"]+)"/i);
      if (featImgMatch && /\.(jpg|jpeg|png|gif|webp|svg)/i.test(featImgMatch[1])) {
        mediaUrl = featImgMatch[1];
      }
    }

    // thumbnail_url = same as media_url (featured image)
    const thumbnailUrl = mediaUrl;

    // ── 5. Extract date ──
    let dateStr: string | null = null;
    const dateMatch = html.match(/<meta[^>]+property="article:published_time"[^>]+content="([^"T]+)/i);
    if (dateMatch) dateStr = dateMatch[1];
    if (!dateStr) {
      const dateLdMatch = html.match(/"datePublished"\s*:\s*"(\d{4}-\d{2}-\d{2})/);
      if (dateLdMatch) dateStr = dateLdMatch[1];
    }

    // ── 6. Extract WP category from tags ──
    let wpCategory: string | null = null;
    const catMatch = html.match(/<a[^>]+rel="category tag"[^>]*>([^<]+)<\/a>/i);
    if (catMatch) {
      wpCategory = decodeEntities(catMatch[1]).trim();
    }

    // ── 7. Extract body content ──
    let body: string | null = null;
    const contentMatch = html.match(/class="blog-content[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<\/div>\s*(?:<!--|<div class="comment)/i) ||
                          html.match(/class="blog-detail[^"]*"[^>]*>([\s\S]*?)<div class="comment/i) ||
                          html.match(/<article[^>]*>([\s\S]*?)<\/article>/i);

    if (contentMatch) {
      let contentHtml = contentMatch[1];

      // Drop TOC title (h5.table-title or similar)
      contentHtml = contentHtml.replace(/<h5[^>]*class="[^"]*table-title[^"]*"[^>]*>[\s\S]*?<\/h5>/gi, '');
      // Drop generic "Table of Contents" blocks
      contentHtml = contentHtml.replace(/<div[^>]*class="[^"]*table-of-content[^"]*"[^>]*>[\s\S]*?<\/div>/gi, '');
      // Drop TOC nav/lists
      contentHtml = contentHtml.replace(/<nav[^>]*class="[^"]*toc[^"]*"[^>]*>[\s\S]*?<\/nav>/gi, '');

      // Convert <table> to markdown pipe table
      contentHtml = contentHtml.replace(/<table[^>]*>([\s\S]*?)<\/table>/gi, (fullMatch) => {
        const md = htmlTableToMarkdown(fullMatch);
        return md ? `\n\n${md}\n\n` : '';
      });

      // Convert <img> to markdown images
      contentHtml = contentHtml.replace(/<img[^>]+src="([^"]+)"[^>]*alt="([^"]*)"[^>]*>/gi, (_, src, alt) => {
        if (src.includes('cropped-android-chrome') || src.includes('favicon') || src.includes('logo')) return '';
        return `\n\n![${alt || 'image'}](${src})\n\n`;
      });
      contentHtml = contentHtml.replace(/<img[^>]+src="([^"]+)"[^>]*>/gi, (fullMatch, src) => {
        if (fullMatch.includes('cropped-android-chrome') || fullMatch.includes('favicon') || fullMatch.includes('logo')) return '';
        if (fullMatch.includes('![')) return fullMatch;
        const altMatch = fullMatch.match(/alt="([^"]*)"/i);
        const alt = altMatch ? altMatch[1] : 'image';
        return `\n\n![${alt}](${src})\n\n`;
      });

      // HTML to markdown - promote h3 to h2 (## heading) for our renderer
      body = contentHtml
        .replace(/<h1[^>]*>/gi, '# ').replace(/<\/h1>/gi, '\n\n')
        .replace(/<h2[^>]*>/gi, '## ').replace(/<\/h2>/gi, '\n\n')
        .replace(/<h3[^>]*>/gi, '## ').replace(/<\/h3>/gi, '\n\n')
        .replace(/<h4[^>]*>/gi, '## ').replace(/<\/h4>/gi, '\n\n')
        .replace(/<h5[^>]*>/gi, '## ').replace(/<\/h5>/gi, '\n\n')
        .replace(/<p[^>]*>/gi, '').replace(/<\/p>/gi, '\n\n')
        .replace(/<li[^>]*>/gi, '- ').replace(/<\/li>/gi, '\n')
        .replace(/<ul[^>]*>|<\/ul>/gi, '\n').replace(/<ol[^>]*>|<\/ol>/gi, '\n')
        .replace(/<strong[^>]*>/gi, '**').replace(/<\/strong>/gi, '**')
        .replace(/<b[^>]*>/gi, '**').replace(/<\/b>/gi, '**')
        .replace(/<em[^>]*>/gi, '_').replace(/<\/em>/gi, '_')
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<(?!!)([^>]+)>/g, '');

      body = decodeEntities(body);

      // Clean up: remove duplicate title at top of body
      if (title) {
        const escapedTitle = title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        body = body.replace(new RegExp(`^\\s*(?:#+ )?${escapedTitle}\\s*\n+`, 'i'), '');
      }

      // Remove "Table of Contents" text headings
      body = body.replace(/^##\s+(?:Table\s+of\s+Contents?|TOC|Contents)\s*$/gim, '');

      // Collapse excessive blank lines
      body = body.replace(/\n{3,}/g, '\n\n').trim();
    }

    // Fallback if body too short
    if (!body || body.length < 100) {
      const sections = html.matchAll(/<(?:h[1-5])[^>]*>(.*?)<\/h[1-5]>\s*(?:<p[^>]*>([\s\S]*?)<\/p>\s*)*/gi);
      const parts: string[] = [];
      for (const s of sections) {
        const heading = s[1].replace(/<[^>]+>/g, '').trim();
        if (heading && !heading.includes('Subscribe') && !heading.includes('Comment') && !heading.includes('Load More')) {
          parts.push(`## ${heading}`);
          if (s[2]) {
            const para = decodeEntities(s[2].replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim());
            if (para) parts.push(para);
          }
        }
      }
      if (parts.length > 0) body = parts.join('\n\n');
    }

    // Auto-generate excerpt from body if still missing
    if (!excerpt && body) {
      const plainBody = body.replace(/[#*|\-\[\]()>!]/g, ' ').replace(/\s+/g, ' ').trim();
      excerpt = plainBody.substring(0, 200).replace(/\s\S*$/, '') + '...';
    }

    // Calculate read_time
    const readTime = body ? calcReadTime(body) : '2 min read';

    return { title, metaTitle, metaDescription, excerpt, body, thumbnailUrl, mediaUrl, dateStr, wpCategory, readTime };
  } catch (err) {
    console.error(`Error scraping ${url}:`, err);
    return empty;
  }
}

// ── Main handler ────────────────────────────────────────────────────────

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const { action = 'list', article_url } = body;

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const authHeader = req.headers.get('authorization') ?? '';
    const callerIp = req.headers.get('x-forwarded-for') || req.headers.get('cf-connecting-ip') || 'unknown';
    const callerUA = req.headers.get('user-agent') || '';

    let callerUserId: string | null = null;
    let callerEmail: string | null = null;
    try {
      const token = authHeader.replace('Bearer ', '');
      const payload = JSON.parse(atob(token.split('.')[1]));
      callerUserId = payload.sub || null;
      callerEmail = payload.email || null;
    } catch { /* ignore */ }

    const writeAuditLog = async (logAction: string, details: Record<string, unknown>) => {
      try {
        await fetch(`${supabaseUrl}/rest/v1/audit_logs`, {
          method: 'POST',
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal',
          },
          body: JSON.stringify({
            action: logAction,
            entity_type: 'articles',
            source: 'edge_function',
            user_id: callerUserId,
            user_email: callerEmail,
            ip_address: callerIp,
            user_agent: callerUA,
            details,
          }),
        });
      } catch (e) {
        console.error('Audit log write failed:', e);
      }
    };

    // ── ACTION: list ──
    if (action === 'list') {
      const res = await fetch(BLOG_LISTING, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; SERNET-Bot/1.0)' } });
      if (!res.ok) {
        return new Response(JSON.stringify({ success: false, error: `Blog listing fetch failed: ${res.status}` }), {
          status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      const html = await res.text();
      const urlRegex = /href="(https:\/\/sernetindia\.com\/blog\/[a-z0-9\-\/]+)"/g;
      const seen = new Set<string>();
      const urls: string[] = [];
      let m;
      while ((m = urlRegex.exec(html)) !== null) {
        const url = m[1].replace(/\/$/, '') + '/';
        if (!seen.has(url)) { seen.add(url); urls.push(url); }
      }
      return new Response(JSON.stringify({ success: true, total: urls.length, urls }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // ── ACTION: scrape_one ──
    if (action === 'scrape_one' && article_url) {
      const scraped = await scrapeArticlePage(article_url);

      // Dedup by source_url
      const checkRes = await fetch(
        `${supabaseUrl}/rest/v1/articles?source_url=eq.${encodeURIComponent(article_url)}&select=id,title,category,author`,
        { headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` } }
      );
      const existing = await checkRes.json();

      if (existing.length > 0 && existing[0].id) {
        // Update existing — preserve manually set category/author, update everything else
        const updateData: Record<string, string | null> = {};
        if (scraped.title) updateData.title = scraped.title;
        if (scraped.body) updateData.body = scraped.body;
        if (scraped.mediaUrl) updateData.media_url = scraped.mediaUrl;
        if (scraped.thumbnailUrl) updateData.thumbnail_url = scraped.thumbnailUrl;
        if (scraped.excerpt) updateData.excerpt = scraped.excerpt;
        if (scraped.dateStr) updateData.item_date = scraped.dateStr;
        if (scraped.readTime) updateData.read_time = scraped.readTime;
        if (scraped.metaTitle) updateData.meta_title = scraped.metaTitle;
        if (scraped.metaDescription) updateData.meta_description = scraped.metaDescription;
        if (scraped.dateStr) updateData.published_at = new Date(scraped.dateStr).toISOString();

        if (Object.keys(updateData).length > 0) {
          await fetch(`${supabaseUrl}/rest/v1/articles?id=eq.${existing[0].id}`, {
            method: 'PATCH',
            headers: {
              'apikey': supabaseKey,
              'Authorization': `Bearer ${supabaseKey}`,
              'Content-Type': 'application/json',
              'Prefer': 'return=minimal',
            },
            body: JSON.stringify(updateData),
          });
          return new Response(JSON.stringify({ success: true, action: 'updated', id: existing[0].id, title: scraped.title }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        return new Response(JSON.stringify({ success: true, action: 'skipped' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Also check legacy dedup by media_url (for articles imported before migration)
      const legacyCheck = await fetch(
        `${supabaseUrl}/rest/v1/articles?media_url=eq.${encodeURIComponent(article_url)}&select=id`,
        { headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` } }
      );
      const legacyExisting = await legacyCheck.json();
      if (legacyExisting.length > 0) {
        return new Response(JSON.stringify({ success: true, action: 'skipped' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Determine category: use WP tag if available, else keyword mapping on title
      const finalTitle = scraped.title || article_url.replace(/\/$/, '').split('/').pop()!.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      const category = scraped.wpCategory ? mapCategory(scraped.wpCategory) : mapCategory(finalTitle);

      const insertRes = await fetch(`${supabaseUrl}/rest/v1/articles`, {
        method: 'POST',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation',
        },
        body: JSON.stringify({
          title: finalTitle,
          excerpt: scraped.excerpt,
          body: scraped.body,
          category,
          author: 'SERNET Research Team',
          status: 'published',
          format: 'Text',
          thumbnail_url: scraped.thumbnailUrl,
          media_url: scraped.mediaUrl,
          source_url: article_url,
          meta_title: scraped.metaTitle,
          meta_description: scraped.metaDescription,
          item_date: scraped.dateStr,
          read_time: scraped.readTime || '2 min read',
          published_at: scraped.dateStr ? new Date(scraped.dateStr).toISOString() : new Date().toISOString(),
        }),
      });

      if (!insertRes.ok) {
        const err = await insertRes.text();
        return new Response(JSON.stringify({ success: false, error: err }), {
          status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      await writeAuditLog('import', { article_url, action: 'inserted', title: finalTitle });
      return new Response(JSON.stringify({ success: true, action: 'inserted', title: finalTitle }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // ── ACTION: rescrape_one ──
    if (action === 'rescrape_one' && article_url) {
      const scraped = await scrapeArticlePage(article_url);

      // Look up by source_url first, fallback to media_url for legacy
      let checkRes = await fetch(
        `${supabaseUrl}/rest/v1/articles?source_url=eq.${encodeURIComponent(article_url)}&select=id,category,author`,
        { headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` } }
      );
      let existing = await checkRes.json();

      if (existing.length === 0) {
        checkRes = await fetch(
          `${supabaseUrl}/rest/v1/articles?media_url=eq.${encodeURIComponent(article_url)}&select=id,category,author`,
          { headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` } }
        );
        existing = await checkRes.json();
      }

      if (existing.length === 0) {
        return new Response(JSON.stringify({ success: false, error: 'Article not found' }), {
          status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const updateData: Record<string, string | null> = {};
      if (scraped.title) updateData.title = scraped.title;
      if (scraped.body) updateData.body = scraped.body;
      if (scraped.mediaUrl) updateData.media_url = scraped.mediaUrl;
      if (scraped.thumbnailUrl) updateData.thumbnail_url = scraped.thumbnailUrl;
      if (scraped.excerpt) updateData.excerpt = scraped.excerpt;
      if (scraped.dateStr) updateData.item_date = scraped.dateStr;
      if (scraped.readTime) updateData.read_time = scraped.readTime;
      if (scraped.metaTitle) updateData.meta_title = scraped.metaTitle;
      if (scraped.metaDescription) updateData.meta_description = scraped.metaDescription;
      if (scraped.dateStr) updateData.published_at = new Date(scraped.dateStr).toISOString();
      // Set source_url if missing (legacy migration)
      updateData.source_url = article_url;

      if (Object.keys(updateData).length > 0) {
        await fetch(`${supabaseUrl}/rest/v1/articles?id=eq.${existing[0].id}`, {
          method: 'PATCH',
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal',
          },
          body: JSON.stringify(updateData),
        });
        await writeAuditLog('rescrape', { article_url, action: 'rescrape_updated', id: existing[0].id });
        return new Response(JSON.stringify({ success: true, action: 'rescrape_updated', id: existing[0].id, title: scraped.title }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({ success: true, action: 'no_changes' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // ── ACTION: list_existing ──
    if (action === 'list_existing') {
      const targetTable = body.target_table || 'articles';
      
      if (targetTable === 'analyses') {
        // For analyses: get those with source_url
        const listRes = await fetch(
          `${supabaseUrl}/rest/v1/analyses?source_url=not.is.null&select=id,source_url&order=created_at.desc&limit=1000`,
          { headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` } }
        );
        const analyses = await listRes.json();
        const urls = analyses.map((a: { source_url: string }) => a.source_url).filter(Boolean);
        return new Response(JSON.stringify({ success: true, total: urls.length, urls }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Default: articles
      const listRes1 = await fetch(
        `${supabaseUrl}/rest/v1/articles?source_url=not.is.null&select=id,source_url&order=item_date.desc.nullslast&limit=1000`,
        { headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` } }
      );
      const articles1 = await listRes1.json();

      const listRes2 = await fetch(
        `${supabaseUrl}/rest/v1/articles?source_url=is.null&media_url=like.https%3A%2F%2Fsernetindia.com%2Fblog%2F*&select=id,media_url&order=item_date.desc.nullslast&limit=1000`,
        { headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` } }
      );
      const articles2 = await listRes2.json();

      const urls = [
        ...articles1.map((a: { source_url: string }) => a.source_url),
        ...articles2.map((a: { media_url: string }) => a.media_url),
      ].filter(Boolean);

      return new Response(JSON.stringify({ success: true, total: urls.length, urls }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // ── ACTION: match_analyses ──
    // Fetches all analyses without source_url, converts their slug-like titles to WP URLs,
    // then scrapes and updates each one
    if (action === 'match_analyses') {
      const listRes = await fetch(
        `${supabaseUrl}/rest/v1/analyses?source_url=is.null&select=id,title&order=created_at.asc&limit=1000`,
        { headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` } }
      );
      const analyses = await listRes.json();
      
      // Convert title to slug URL
      const items = analyses.map((a: { id: string; title: string }) => {
        const slug = a.title.toLowerCase()
          .replace(/['']/g, '')
          .replace(/&/g, 'and')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '');
        return { id: a.id, title: a.title, url: `${BLOG_BASE}/blog/${slug}/` };
      });

      return new Response(JSON.stringify({ success: true, total: items.length, items }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // ── ACTION: import_analysis_as_article ──
    // Takes an analysis WP URL and imports it into the articles table with a migration marker
    if (action === 'import_analysis_as_article' && article_url) {
      const analysisId = body.analysis_id;
      const originalTitle = body.original_title || '';

      // Check if already imported with this source_url
      const checkRes = await fetch(
        `${supabaseUrl}/rest/v1/articles?source_url=eq.${encodeURIComponent(article_url)}&select=id,title`,
        { headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` } }
      );
      const existing = await checkRes.json();

      if (existing.length > 0) {
        // Already exists — re-scrape and update it
        const scraped = await scrapeArticlePage(article_url);
        if (scraped.title || scraped.body || scraped.mediaUrl) {
          const updateData: Record<string, string | null> = {};
          if (scraped.title) updateData.title = scraped.title;
          if (scraped.body) updateData.body = scraped.body;
          if (scraped.mediaUrl) updateData.media_url = scraped.mediaUrl;
          if (scraped.thumbnailUrl) updateData.thumbnail_url = scraped.thumbnailUrl;
          if (scraped.excerpt) updateData.excerpt = scraped.excerpt;
          if (scraped.readTime) updateData.read_time = scraped.readTime;
          if (scraped.dateStr) updateData.item_date = scraped.dateStr;
          if (scraped.dateStr) updateData.published_at = new Date(scraped.dateStr).toISOString();
          if (scraped.metaTitle) updateData.meta_title = scraped.metaTitle;
          if (scraped.metaDescription) updateData.meta_description = scraped.metaDescription;

          await fetch(`${supabaseUrl}/rest/v1/articles?id=eq.${existing[0].id}`, {
            method: 'PATCH',
            headers: {
              'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}`,
              'Content-Type': 'application/json', 'Prefer': 'return=minimal',
            },
            body: JSON.stringify(updateData),
          });
          return new Response(JSON.stringify({ success: true, action: 'updated', id: existing[0].id, title: scraped.title || existing[0].title }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        return new Response(JSON.stringify({ success: true, action: 'skipped', id: existing[0].id }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Scrape the WP page
      const scraped = await scrapeArticlePage(article_url);
      const finalTitle = scraped.title || originalTitle || article_url.replace(/\/$/, '').split('/').pop()!.replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase());
      const category = scraped.wpCategory ? mapCategory(scraped.wpCategory) : mapCategory(finalTitle);

      const insertRes = await fetch(`${supabaseUrl}/rest/v1/articles`, {
        method: 'POST',
        headers: {
          'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json', 'Prefer': 'return=representation',
        },
        body: JSON.stringify({
          title: finalTitle,
          excerpt: scraped.excerpt,
          body: scraped.body,
          category: `__analysis_import::${category}`,
          author: 'Research Desk',
          status: 'published',
          format: 'Text',
          thumbnail_url: scraped.thumbnailUrl,
          media_url: scraped.mediaUrl,
          source_url: article_url,
          meta_title: scraped.metaTitle,
          meta_description: scraped.metaDescription,
          item_date: scraped.dateStr,
          read_time: scraped.readTime || '2 min read',
          published_at: scraped.dateStr ? new Date(scraped.dateStr).toISOString() : new Date().toISOString(),
        }),
      });

      if (!insertRes.ok) {
        const err = await insertRes.text();
        return new Response(JSON.stringify({ success: false, error: err }), {
          status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const hasData = !!(scraped.title || scraped.body || scraped.mediaUrl);
      return new Response(JSON.stringify({ success: true, action: hasData ? 'inserted' : 'inserted_empty', title: finalTitle, hasData }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // ── ACTION: move_analyses_from_articles ──
    // Moves all articles with '__analysis_import::' prefix category into the analyses table
    if (action === 'move_analyses_from_articles') {
      // Get all tagged articles
      const listRes = await fetch(
        `${supabaseUrl}/rest/v1/articles?category=like.__analysis_import::*&select=id,title,body,excerpt,category,author,status,thumbnail_url,media_url,source_url,meta_title,meta_description,item_date,read_time,published_at,created_at&limit=1000`,
        { headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` } }
      );
      const tagged = await listRes.json();

      if (!tagged || tagged.length === 0) {
        return new Response(JSON.stringify({ success: true, moved: 0, message: 'No tagged articles to move' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      let moved = 0, errors = 0;
      for (const art of tagged) {
        const realCategory = art.category.replace('__analysis_import::', '');
        try {
          // Insert into analyses
          const insertRes = await fetch(`${supabaseUrl}/rest/v1/analyses`, {
            method: 'POST',
            headers: {
              'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}`,
              'Content-Type': 'application/json', 'Prefer': 'return=minimal',
            },
            body: JSON.stringify({
              title: art.title,
              body: art.body,
              excerpt: art.excerpt,
              category: realCategory,
              author: art.author || 'Research Desk',
              status: art.status,
              thumbnail_url: art.thumbnail_url,
              media_url: art.media_url,
              source_url: art.source_url,
              item_date: art.item_date,
              published_at: art.published_at,
              icon_name: 'TrendingUp',
            }),
          });

          if (insertRes.ok) {
            // Delete from articles
            await fetch(`${supabaseUrl}/rest/v1/articles?id=eq.${art.id}`, {
              method: 'DELETE',
              headers: {
                'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}`,
                'Prefer': 'return=minimal',
              },
            });
            moved++;
          } else {
            errors++;
            console.error(`Failed to insert analysis: ${await insertRes.text()}`);
          }
        } catch (e) {
          errors++;
          console.error(`Move error for ${art.id}:`, e);
        }
      }

      return new Response(JSON.stringify({ success: true, moved, errors, total: tagged.length }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // ── ACTION: rescrape_analysis ──
    if (action === 'rescrape_analysis' && article_url) {
      const analysisId = body.analysis_id;
      if (!analysisId) {
        return new Response(JSON.stringify({ success: false, error: 'analysis_id required' }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const scraped = await scrapeArticlePage(article_url);

      const updateData: Record<string, string | null> = {};
      if (scraped.title) updateData.title = scraped.title;
      if (scraped.body) updateData.body = scraped.body;
      if (scraped.mediaUrl) updateData.media_url = scraped.mediaUrl;
      if (scraped.thumbnailUrl) updateData.thumbnail_url = scraped.thumbnailUrl;
      if (scraped.excerpt) updateData.excerpt = scraped.excerpt;
      if (scraped.dateStr) updateData.item_date = scraped.dateStr;
      if (scraped.metaTitle) updateData.meta_title = scraped.metaTitle;
      if (scraped.metaDescription) updateData.meta_description = scraped.metaDescription;
      if (scraped.dateStr) updateData.published_at = new Date(scraped.dateStr).toISOString();
      updateData.source_url = article_url;

      if (Object.keys(updateData).length > 1) { // more than just source_url
        await fetch(`${supabaseUrl}/rest/v1/analyses?id=eq.${analysisId}`, {
          method: 'PATCH',
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal',
          },
          body: JSON.stringify(updateData),
        });
        await writeAuditLog('rescrape_analysis', { article_url, action: 'updated', id: analysisId });
        return new Response(JSON.stringify({ success: true, action: 'rescrape_updated', id: analysisId, title: scraped.title }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Even if no scraped data, set the source_url so we know it was attempted
      await fetch(`${supabaseUrl}/rest/v1/analyses?id=eq.${analysisId}`, {
        method: 'PATCH',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify({ source_url: article_url }),
      });

      return new Response(JSON.stringify({ success: true, action: 'no_data', id: analysisId }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // ── ACTION: rescrape_one (for analyses with existing source_url) ──
    if (action === 'rescrape_one' && article_url) {
      const targetTable = body.target_table || 'articles';

      if (targetTable === 'analyses') {
        const scraped = await scrapeArticlePage(article_url);
        const checkRes = await fetch(
          `${supabaseUrl}/rest/v1/analyses?source_url=eq.${encodeURIComponent(article_url)}&select=id,category,author`,
          { headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` } }
        );
        const existing = await checkRes.json();
        if (existing.length === 0) {
          return new Response(JSON.stringify({ success: false, error: 'Analysis not found' }), {
            status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        const updateData: Record<string, string | null> = {};
        if (scraped.title) updateData.title = scraped.title;
        if (scraped.body) updateData.body = scraped.body;
        if (scraped.mediaUrl) updateData.media_url = scraped.mediaUrl;
        if (scraped.thumbnailUrl) updateData.thumbnail_url = scraped.thumbnailUrl;
        if (scraped.excerpt) updateData.excerpt = scraped.excerpt;
        if (scraped.dateStr) updateData.item_date = scraped.dateStr;
        if (scraped.metaTitle) updateData.meta_title = scraped.metaTitle;
        if (scraped.metaDescription) updateData.meta_description = scraped.metaDescription;
        if (scraped.dateStr) updateData.published_at = new Date(scraped.dateStr).toISOString();
        updateData.source_url = article_url;

        if (Object.keys(updateData).length > 0) {
          await fetch(`${supabaseUrl}/rest/v1/analyses?id=eq.${existing[0].id}`, {
            method: 'PATCH',
            headers: {
              'apikey': supabaseKey,
              'Authorization': `Bearer ${supabaseKey}`,
              'Content-Type': 'application/json',
              'Prefer': 'return=minimal',
            },
            body: JSON.stringify(updateData),
          });
          return new Response(JSON.stringify({ success: true, action: 'rescrape_updated', id: existing[0].id, title: scraped.title }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        return new Response(JSON.stringify({ success: true, action: 'no_changes' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Default: articles rescrape_one (existing logic)
      const scraped = await scrapeArticlePage(article_url);
      let checkRes = await fetch(
        `${supabaseUrl}/rest/v1/articles?source_url=eq.${encodeURIComponent(article_url)}&select=id,category,author`,
        { headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` } }
      );
      let existing = await checkRes.json();

      if (existing.length === 0) {
        checkRes = await fetch(
          `${supabaseUrl}/rest/v1/articles?media_url=eq.${encodeURIComponent(article_url)}&select=id,category,author`,
          { headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` } }
        );
        existing = await checkRes.json();
      }

      if (existing.length === 0) {
        return new Response(JSON.stringify({ success: false, error: 'Article not found' }), {
          status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const updateData: Record<string, string | null> = {};
      if (scraped.title) updateData.title = scraped.title;
      if (scraped.body) updateData.body = scraped.body;
      if (scraped.mediaUrl) updateData.media_url = scraped.mediaUrl;
      if (scraped.thumbnailUrl) updateData.thumbnail_url = scraped.thumbnailUrl;
      if (scraped.excerpt) updateData.excerpt = scraped.excerpt;
      if (scraped.dateStr) updateData.item_date = scraped.dateStr;
      if (scraped.readTime) updateData.read_time = scraped.readTime;
      if (scraped.metaTitle) updateData.meta_title = scraped.metaTitle;
      if (scraped.metaDescription) updateData.meta_description = scraped.metaDescription;
      if (scraped.dateStr) updateData.published_at = new Date(scraped.dateStr).toISOString();
      updateData.source_url = article_url;

      if (Object.keys(updateData).length > 0) {
        await fetch(`${supabaseUrl}/rest/v1/articles?id=eq.${existing[0].id}`, {
          method: 'PATCH',
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal',
          },
          body: JSON.stringify(updateData),
        });
        await writeAuditLog('rescrape', { article_url, action: 'rescrape_updated', id: existing[0].id });
        return new Response(JSON.stringify({ success: true, action: 'rescrape_updated', id: existing[0].id, title: scraped.title }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({ success: true, action: 'no_changes' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: false, error: 'Unknown action' }), {
      status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: String(error) }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
