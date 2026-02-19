const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

// ─── XML helpers ─────────────────────────────────────────────────────────────

function stripCdata(val: string): string {
  return val.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').trim();
}

function extractTag(xml: string, tag: string): string {
  // Matches <tag ...>content</tag> or <tag>content</tag>, unwrapping CDATA
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i');
  const m = xml.match(re);
  return m ? stripCdata(m[1]).trim() : '';
}

function extractAtom(xml: string): RssItem[] {
  // Atom feeds use <entry> elements
  const items: RssItem[] = [];
  const entryRe = /<entry[^>]*>([\s\S]*?)<\/entry>/g;
  let m;
  while ((m = entryRe.exec(xml)) !== null) {
    const body = m[1];
    const title = extractTag(body, 'title');
    // Atom link: <link href="..." />
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
  // Detect Atom feed
  if (xml.includes('<feed') && xml.includes('</feed>')) {
    return extractAtom(xml);
  }

  const items: RssItem[] = [];
  const itemRe = /<item[^>]*>([\s\S]*?)<\/item>/g;
  let m;
  while ((m = itemRe.exec(xml)) !== null) {
    const body = m[1];
    const title = extractTag(body, 'title');

    // RSS <link> can be bare text node (not inside tags) or inside <link>...</link>
    let link = extractTag(body, 'link');
    if (!link) {
      // Try text node between <link/> and next tag — some RSS feeds omit closing tag
      const bare = body.match(/<link\s*\/?>([\s\S]*?)(?=<)/i);
      link = bare ? bare[1].trim() : '';
    }
    if (!link) {
      // Try <guid isPermaLink="true">
      const guidPerm = body.match(/<guid[^>]*isPermaLink=["']true["'][^>]*>([\s\S]*?)<\/guid>/i);
      link = guidPerm ? stripCdata(guidPerm[1]).trim() : '';
    }

    const summary = extractTag(body, 'description') || extractTag(body, 'summary') || extractTag(body, 'content:encoded');
    // Strip HTML tags from summary
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

    const response = await fetch(feedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; SernetRSSReader/1.0)',
        'Accept': 'application/rss+xml, application/atom+xml, application/xml, text/xml, */*',
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      return new Response(
        JSON.stringify({ success: false, error: `Feed returned HTTP ${response.status}` }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const xml = await response.text();
    const items = parseRSS(xml).slice(0, limit);

    console.log(`Parsed ${items.length} items from feed`);

    return new Response(
      JSON.stringify({ success: true, items }),
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
