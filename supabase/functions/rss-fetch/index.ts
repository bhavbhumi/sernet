const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

// ─── XML helpers ─────────────────────────────────────────────────────────────

function stripCdata(val: string): string {
  return val.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').trim();
}

function extractTag(xml: string, tag: string): string {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i');
  const m = xml.match(re);
  return m ? stripCdata(m[1]).trim() : '';
}

function extractAtom(xml: string): RssItem[] {
  const items: RssItem[] = [];
  const entryRe = /<entry[^>]*>([\s\S]*?)<\/entry>/g;
  let m;
  while ((m = entryRe.exec(xml)) !== null) {
    const body = m[1];
    const title = extractTag(body, 'title');
    const linkMatch = body.match(/<link[^>]+href=["']([^"']+)["'][^>]*\/>/i)
      || body.match(/<link[^>]+href=["']([^"']+)["'][^>]*>/i);
    const link = linkMatch ? linkMatch[1] : '';
    const summary = extractTag(body, 'summary') || extractTag(body, 'content');
    const pubDate = extractTag(body, 'published') || extractTag(body, 'updated');
    const guid = extractTag(body, 'id') || link;
    if (title && link) items.push({ title, link, summary, pubDate, guid });
  }
  return items;
}

interface RssItem {
  title: string;
  link: string;
  summary: string;
  pubDate: string;
  guid: string;
}

function parseRSS(xml: string): RssItem[] {
  if (xml.includes('<feed') && xml.includes('</feed>')) {
    return extractAtom(xml);
  }

  const items: RssItem[] = [];
  const itemRe = /<item[^>]*>([\s\S]*?)<\/item>/g;
  let m;
  while ((m = itemRe.exec(xml)) !== null) {
    const body = m[1];
    const title = extractTag(body, 'title');

    let link = extractTag(body, 'link');
    if (!link) {
      const bare = body.match(/<link\s*\/?>([\s\S]*?)(?=<)/i);
      link = bare ? bare[1].trim() : '';
    }
    if (!link) {
      const guidPerm = body.match(/<guid[^>]*isPermaLink=["']true["'][^>]*>([\s\S]*?)<\/guid>/i);
      link = guidPerm ? stripCdata(guidPerm[1]).trim() : '';
    }

    const summary = extractTag(body, 'description') || extractTag(body, 'summary') || extractTag(body, 'content:encoded');
    const cleanSummary = summary.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').trim().slice(0, 300);

    const pubDate = extractTag(body, 'pubDate') || extractTag(body, 'dc:date') || extractTag(body, 'published');
    const guid = extractTag(body, 'guid') || link;

    if (title && link) {
      items.push({ title, link, summary: cleanSummary, pubDate, guid });
    }
  }
  return items;
}

// ─── Handler ─────────────────────────────────────────────────────────────────

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { feedUrl, limit = 20 } = await req.json();

    if (!feedUrl) {
      return new Response(
        JSON.stringify({ success: false, error: 'feedUrl is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Fetching RSS feed:', feedUrl);

    // Try multiple User-Agent strings for sites that block bots
    const userAgents = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
      'Mozilla/5.0 (compatible; SernetRSSReader/1.0; +https://sernet.in)',
      'Feedly/1.0 (+http://www.feedly.com/fetcher.html; like FeedFetcher-Google)',
    ];

    let response: Response | null = null;
    let lastStatus = 0;

    for (const ua of userAgents) {
      try {
        response = await fetch(feedUrl, {
          redirect: 'follow',
          headers: {
            'User-Agent': ua,
            'Accept': 'application/rss+xml, application/atom+xml, application/xml, text/xml, text/html, */*',
            'Accept-Language': 'en-US,en;q=0.9',
            'Cache-Control': 'no-cache',
          },
          signal: AbortSignal.timeout(15000),
        });
        lastStatus = response.status;
        if (response.ok) break;
      } catch (_) {
        // Try next UA
      }
    }

    if (!response || !response.ok) {
      const errorMsg = lastStatus
        ? `Feed URL returned HTTP ${lastStatus}. The URL may have changed or the source may be blocking automated requests.`
        : 'Could not reach the feed URL. Please check the URL is correct and accessible.';
      return new Response(
        JSON.stringify({ success: false, error: errorMsg, httpStatus: lastStatus }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const xml = await response.text();

    // Sanity-check: must look like XML/RSS
    if (!xml.includes('<item') && !xml.includes('<entry') && !xml.includes('<rss') && !xml.includes('<feed')) {
      return new Response(
        JSON.stringify({ success: false, error: 'The URL did not return a valid RSS/Atom feed. It may require authentication or have moved.' }),
        { status: 422, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const items = parseRSS(xml).slice(0, limit);
    console.log(`Parsed ${items.length} items from feed`);

    return new Response(
      JSON.stringify({ success: true, items, finalUrl: response.url }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    console.error('RSS fetch error:', msg);
    return new Response(
      JSON.stringify({ success: false, error: msg }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
