const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const BLOG_BASE = 'https://sernetindia.com';
const BLOG_LISTING = `${BLOG_BASE}/blog-dynamic/`;

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
  } catch {}
  return null;
}

// Convert HTML table to markdown pipe table
function htmlTableToMarkdown(tableHtml: string): string {
  const rows: string[][] = [];
  // Extract rows
  const trRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  let trMatch;
  while ((trMatch = trRegex.exec(tableHtml)) !== null) {
    const cells: string[] = [];
    const cellRegex = /<(?:td|th)[^>]*>([\s\S]*?)<\/(?:td|th)>/gi;
    let cellMatch;
    while ((cellMatch = cellRegex.exec(trMatch[1])) !== null) {
      let cellText = cellMatch[1]
        .replace(/<b[^>]*>|<\/b>/gi, '')
        .replace(/<strong[^>]*>|<\/strong>/gi, '')
        .replace(/<em[^>]*>|<\/em>/gi, '')
        .replace(/<i[^>]*>|<\/i>/gi, '')
        .replace(/<span[^>]*>/gi, '').replace(/<\/span>/gi, '')
        .replace(/<br\s*\/?>/gi, ' ')
        .replace(/<[^>]+>/g, '')
        .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/&nbsp;/g, ' ')
        .replace(/&hellip;/g, '...').replace(/&ndash;/g, '–').replace(/&mdash;/g, '—')
        .replace(/\s+/g, ' ')
        .trim();
      // Remove pipe chars within cells to avoid breaking table
      cellText = cellText.replace(/\|/g, '∣');
      cells.push(cellText);
    }
    if (cells.length > 0) rows.push(cells);
  }

  if (rows.length < 2) return '';

  // Normalize column count
  const maxCols = Math.max(...rows.map(r => r.length));
  const normalized = rows.map(r => {
    while (r.length < maxCols) r.push('');
    return r;
  });

  // Build pipe table: first row is header
  const lines: string[] = [];
  lines.push('| ' + normalized[0].join(' | ') + ' |');
  lines.push('| ' + normalized[0].map(() => '---').join(' | ') + ' |');
  for (let i = 1; i < normalized.length; i++) {
    lines.push('| ' + normalized[i].join(' | ') + ' |');
  }
  return lines.join('\n');
}

// Scrape individual article page to get full body content
async function scrapeArticlePage(url: string): Promise<{ body: string | null; excerpt: string | null; thumbnailUrl: string | null; dateStr: string | null }> {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; SERNET-Bot/1.0)' },
    });
    if (!res.ok) return { body: null, excerpt: null, thumbnailUrl: null, dateStr: null };
    
    const html = await res.text();

    // Extract thumbnail from og:image meta tag
    let thumbnailUrl: string | null = null;
    const ogImageMatch = html.match(/<meta[^>]+property="og:image"[^>]+content="([^"]+)"/i) ||
                          html.match(/<meta[^>]+content="([^"]+)"[^>]+property="og:image"/i);
    if (ogImageMatch) thumbnailUrl = ogImageMatch[1];

    // Extract date from meta or structured data
    let dateStr: string | null = null;
    const dateMatch = html.match(/<meta[^>]+property="article:published_time"[^>]+content="([^"T]+)/i);
    if (dateMatch) dateStr = dateMatch[1];

    // Extract excerpt from og:description
    let excerpt: string | null = null;
    const descMatch = html.match(/<meta[^>]+property="og:description"[^>]+content="([^"]+)"/i) ||
                       html.match(/<meta[^>]+name="description"[^>]+content="([^"]+)"/i);
    if (descMatch) excerpt = descMatch[1].replace(/&amp;/g, '&').replace(/&#039;/g, "'").substring(0, 500);

    // Extract main content block
    let body: string | null = null;
    
    const contentMatch = html.match(/class="blog-content[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<\/div>\s*(?:<!--|<div class="comment)/i) ||
                          html.match(/class="blog-detail[^"]*"[^>]*>([\s\S]*?)<div class="comment/i) ||
                          html.match(/<article[^>]*>([\s\S]*?)<\/article>/i);

    if (contentMatch) {
      let contentHtml = contentMatch[1];

      // Step 1: Convert <table> blocks to markdown pipe tables BEFORE stripping HTML
      contentHtml = contentHtml.replace(/<table[^>]*>([\s\S]*?)<\/table>/gi, (fullMatch) => {
        const md = htmlTableToMarkdown(fullMatch);
        return md ? `\n\n${md}\n\n` : '';
      });

      // Step 2: Convert <img> tags to markdown images BEFORE stripping HTML
      contentHtml = contentHtml.replace(/<img[^>]+src="([^"]+)"[^>]*alt="([^"]*)"[^>]*>/gi, (_, src, alt) => {
        if (src.includes('cropped-android-chrome') || src.includes('favicon') || src.includes('logo')) return '';
        return `\n\n![${alt || 'image'}](${src})\n\n`;
      });
      // Also handle img without alt before src
      contentHtml = contentHtml.replace(/<img[^>]+src="([^"]+)"[^>]*>/gi, (fullMatch, src) => {
        if (fullMatch.includes('cropped-android-chrome') || fullMatch.includes('favicon') || fullMatch.includes('logo')) return '';
        // Don't double-process already converted ones
        if (fullMatch.includes('![')) return fullMatch;
        const altMatch = fullMatch.match(/alt="([^"]*)"/i);
        const alt = altMatch ? altMatch[1] : 'image';
        return `\n\n![${alt}](${src})\n\n`;
      });

      // Step 3: Standard HTML-to-markdown conversion
      body = contentHtml
        .replace(/<h1[^>]*>/gi, '# ').replace(/<\/h1>/gi, '\n\n')
        .replace(/<h2[^>]*>/gi, '## ').replace(/<\/h2>/gi, '\n\n')
        .replace(/<h3[^>]*>/gi, '### ').replace(/<\/h3>/gi, '\n\n')
        .replace(/<h4[^>]*>/gi, '#### ').replace(/<\/h4>/gi, '\n\n')
        .replace(/<h5[^>]*>/gi, '##### ').replace(/<\/h5>/gi, '\n\n')
        .replace(/<p[^>]*>/gi, '').replace(/<\/p>/gi, '\n\n')
        .replace(/<li[^>]*>/gi, '- ').replace(/<\/li>/gi, '\n')
        .replace(/<ul[^>]*>|<\/ul>/gi, '\n').replace(/<ol[^>]*>|<\/ol>/gi, '\n')
        .replace(/<strong[^>]*>/gi, '**').replace(/<\/strong>/gi, '**')
        .replace(/<b[^>]*>/gi, '**').replace(/<\/b>/gi, '**')
        .replace(/<em[^>]*>/gi, '_').replace(/<\/em>/gi, '_')
        .replace(/<br\s*\/?>/gi, '\n')
        // Don't strip markdown image syntax - preserve ![alt](url) 
        .replace(/<(?!!)([^>]+)>/g, '')
        .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/&nbsp;/g, ' ')
        .replace(/&hellip;/g, '...').replace(/&ndash;/g, '–').replace(/&mdash;/g, '—')
        .replace(/\n{3,}/g, '\n\n').trim();
    }

    // Fallback if no content found
    if (!body || body.length < 100) {
      const sections = html.matchAll(/<(?:h[1-5])[^>]*>(.*?)<\/h[1-5]>\s*(?:<p[^>]*>([\s\S]*?)<\/p>\s*)*/gi);
      const parts: string[] = [];
      for (const s of sections) {
        const heading = s[1].replace(/<[^>]+>/g, '').trim();
        if (heading && !heading.includes('Subscribe') && !heading.includes('Comment') && !heading.includes('Load More')) {
          parts.push(`# ${heading}`);
          if (s[2]) {
            const para = s[2].replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim();
            if (para) parts.push(para);
          }
        }
      }
      if (parts.length > 0) body = parts.join('\n\n');
    }

    return { body: body || null, excerpt, thumbnailUrl, dateStr };
  } catch (err) {
    console.error(`Error scraping ${url}:`, err);
    return { body: null, excerpt: null, thumbnailUrl: null, dateStr: null };
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const { action = 'list', offset = 0, batch_size = 10, article_url } = body;

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    // Extract caller info for audit
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
    } catch {}

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

    // Action: scrape blog listing to get all article URLs
    if (action === 'list') {
      const res = await fetch(BLOG_LISTING, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; SERNET-Bot/1.0)' },
      });
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

    // Action: scrape a single article page and upsert to DB
    if (action === 'scrape_one' && article_url) {
      const scraped = await scrapeArticlePage(article_url);
      
      const checkRes = await fetch(
        `${supabaseUrl}/rest/v1/articles?media_url=eq.${encodeURIComponent(article_url)}&select=id,body`,
        { headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` } }
      );
      const existing = await checkRes.json();
      
      if (existing.length > 0 && existing[0].id) {
        if (scraped.body || scraped.thumbnailUrl) {
          const updateData: Record<string, string> = {};
          if (scraped.body && !existing[0].body) updateData.body = scraped.body;
          if (scraped.thumbnailUrl) updateData.thumbnail_url = scraped.thumbnailUrl;
          if (scraped.excerpt) updateData.excerpt = scraped.excerpt;
          if (scraped.dateStr) updateData.item_date = scraped.dateStr;
          
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
            return new Response(JSON.stringify({ success: true, action: 'updated', id: existing[0].id }), {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
          }
        }
        return new Response(JSON.stringify({ success: true, action: 'skipped' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const slug = article_url.replace(/\/$/, '').split('/').pop() || '';
      const titleFromSlug = slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

      const insertRes = await fetch(`${supabaseUrl}/rest/v1/articles`, {
        method: 'POST',
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation',
        },
        body: JSON.stringify({
          title: titleFromSlug,
          excerpt: scraped.excerpt,
          body: scraped.body,
          category: mapCategory(titleFromSlug),
          author: 'SERNET Research Team',
          status: 'published',
          format: 'Text',
          thumbnail_url: scraped.thumbnailUrl,
          media_url: article_url,
          item_date: scraped.dateStr,
          read_time: '3 min read',
          published_at: scraped.dateStr ? new Date(scraped.dateStr).toISOString() : new Date().toISOString(),
        }),
      });

      if (!insertRes.ok) {
        const err = await insertRes.text();
        return new Response(JSON.stringify({ success: false, error: err }), {
          status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      await writeAuditLog('import', { article_url, action: 'inserted', title: titleFromSlug });
      return new Response(JSON.stringify({ success: true, action: 'inserted' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Action: re-scrape existing articles to update body content (force overwrite)
    if (action === 'rescrape_one' && article_url) {
      const scraped = await scrapeArticlePage(article_url);
      
      const checkRes = await fetch(
        `${supabaseUrl}/rest/v1/articles?media_url=eq.${encodeURIComponent(article_url)}&select=id`,
        { headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` } }
      );
      const existing = await checkRes.json();
      
      if (existing.length === 0) {
        return new Response(JSON.stringify({ success: false, error: 'Article not found' }), {
          status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const updateData: Record<string, string> = {};
      if (scraped.body) updateData.body = scraped.body;
      if (scraped.thumbnailUrl) updateData.thumbnail_url = scraped.thumbnailUrl;
      if (scraped.excerpt) updateData.excerpt = scraped.excerpt;
      if (scraped.dateStr) updateData.item_date = scraped.dateStr;

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
        return new Response(JSON.stringify({ success: true, action: 'rescrape_updated', id: existing[0].id }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({ success: true, action: 'no_changes' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Action: get all articles with media_url for re-scraping
    if (action === 'list_existing') {
      const listRes = await fetch(
        `${supabaseUrl}/rest/v1/articles?media_url=not.is.null&select=id,media_url&order=item_date.desc.nullslast&limit=1000`,
        { headers: { 'apikey': supabaseKey, 'Authorization': `Bearer ${supabaseKey}` } }
      );
      const articles = await listRes.json();
      const urls = articles.map((a: { media_url: string }) => a.media_url).filter(Boolean);
      return new Response(JSON.stringify({ success: true, total: urls.length, urls }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: false, error: 'Unknown action' }), {
      status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('wp-import error:', error);
    return new Response(JSON.stringify({ success: false, error: String(error) }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
