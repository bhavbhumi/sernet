import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Strip raw WordPress HTML structures and extract clean markdown
function stripWordPressHtml(text: string): string {
  if (!text.includes('<!--') && !text.includes('<')) return text;

  // Remove everything before "<!-- Tab Content -->" marker
  const tabContentIdx = text.indexOf('<!-- Tab Content -->');
  if (tabContentIdx !== -1) {
    text = text.substring(tabContentIdx + '<!-- Tab Content -->'.length);
  }

  // Remove HTML comments
  text = text.replace(/<!--[\s\S]*?-->/g, '');

  // Remove script/style
  text = text.replace(/<script[\s\S]*?<\/script>/gi, '');
  text = text.replace(/<style[\s\S]*?<\/style>/gi, '');

  // Convert <br> to newlines
  text = text.replace(/<br\s*\/?>/gi, '\n');

  // Convert <p> tags
  text = text.replace(/<\/p>/gi, '\n\n');
  text = text.replace(/<p[^>]*>/gi, '');

  // Convert <li> to markdown list items
  text = text.replace(/<li[^>]*>/gi, '- ');
  text = text.replace(/<\/li>/gi, '\n');

  // Convert header tags to markdown
  text = text.replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, '# $1\n');
  text = text.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, '## $1\n');
  text = text.replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, '## $1\n');
  text = text.replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, '## $1\n');
  text = text.replace(/<h5[^>]*>([\s\S]*?)<\/h5>/gi, '## $1\n');

  // Convert <strong>/<b> to markdown bold
  text = text.replace(/<(?:strong|b)[^>]*>([\s\S]*?)<\/(?:strong|b)>/gi, '**$1**');

  // Convert <em>/<i> to markdown italic
  text = text.replace(/<(?:em|i)[^>]*>([\s\S]*?)<\/(?:em|i)>/gi, '*$1*');

  // Convert <a href="...">text</a> to markdown links
  text = text.replace(/<a\s+[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi, '[$2]($1)');

  // Convert <img> to markdown images
  text = text.replace(/<img\s+[^>]*src=["']([^"']+)["'][^>]*alt=["']([^"']*)["'][^>]*\/?>/gi, '![$2]($1)');
  text = text.replace(/<img\s+[^>]*src=["']([^"']+)["'][^>]*\/?>/gi, '![image]($1)');

  // Convert HTML tables to markdown tables
  text = convertHtmlTables(text);

  // Strip all remaining HTML tags
  text = text.replace(/<[^>]+>/g, '');

  // Decode HTML entities
  text = text.replace(/&amp;/g, '&');
  text = text.replace(/&lt;/g, '<');
  text = text.replace(/&gt;/g, '>');
  text = text.replace(/&quot;/g, '"');
  text = text.replace(/&#39;/g, "'");
  text = text.replace(/&nbsp;/g, ' ');
  text = text.replace(/&#8211;/g, '–');
  text = text.replace(/&#8212;/g, '—');
  text = text.replace(/&#8216;/g, '\u2018');
  text = text.replace(/&#8217;/g, '\u2019');
  text = text.replace(/&#8220;/g, '\u201C');
  text = text.replace(/&#8221;/g, '\u201D');
  text = text.replace(/&rsquo;/g, '\u2019');
  text = text.replace(/&lsquo;/g, '\u2018');
  text = text.replace(/&rdquo;/g, '\u201D');
  text = text.replace(/&ldquo;/g, '\u201C');
  text = text.replace(/&mdash;/g, '—');
  text = text.replace(/&ndash;/g, '–');
  text = text.replace(/&hellip;/g, '…');
  text = text.replace(/&#?\w+;/g, '');

  return text;
}

// Convert HTML <table> structures to markdown pipe tables
function convertHtmlTables(text: string): string {
  return text.replace(/<table[^>]*>([\s\S]*?)<\/table>/gi, (_match, tableContent: string) => {
    const rows: string[][] = [];
    const rowMatches = tableContent.match(/<tr[^>]*>([\s\S]*?)<\/tr>/gi) || [];
    for (const rowHtml of rowMatches) {
      const cells: string[] = [];
      const cellMatches = rowHtml.match(/<(?:td|th)[^>]*>([\s\S]*?)<\/(?:td|th)>/gi) || [];
      for (const cellHtml of cellMatches) {
        const cellContent = cellHtml.replace(/<[^>]+>/g, '').trim();
        cells.push(cellContent);
      }
      if (cells.length > 0) rows.push(cells);
    }
    if (rows.length < 2) return '';
    const headers = rows[0];
    const mdLines = [
      '| ' + headers.join(' | ') + ' |',
      '| ' + headers.map(() => '---').join(' | ') + ' |',
      ...rows.slice(1).map(r => '| ' + r.join(' | ') + ' |'),
    ];
    return '\n' + mdLines.join('\n') + '\n';
  });
}

// Reconstruct flattened tables
function reconstructFlattenedTables(text: string): string {
  const lines = text.split('\n');
  const result: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const headers: string[] = [];
    let j = i;

    while (j < lines.length) {
      const t = lines[j].trim();
      const boldMatch = t.match(/^\*\*(.+)\*\*$/);
      if (boldMatch) {
        headers.push(boldMatch[1].trim());
        j++;
      } else if (t === '' && headers.length > 0) {
        break;
      } else {
        break;
      }
    }

    if (headers.length >= 2) {
      if (j < lines.length && lines[j].trim() === '') j++;
      const colCount = headers.length;
      const dataRows: string[][] = [];
      let k = j;

      while (k < lines.length) {
        const group: string[] = [];
        while (k < lines.length && lines[k].trim() !== '') {
          group.push(lines[k].trim());
          k++;
        }
        if (group.length === colCount) {
          dataRows.push(group);
          while (k < lines.length && lines[k].trim() === '') k++;
        } else if (group.length === 0) {
          break;
        } else {
          k -= group.length;
          break;
        }
      }

      if (dataRows.length >= 2) {
        result.push('| ' + headers.join(' | ') + ' |');
        result.push('| ' + headers.map(() => '---').join(' | ') + ' |');
        for (const row of dataRows) {
          result.push('| ' + row.join(' | ') + ' |');
        }
        result.push('');
        i = k;
        continue;
      }
    }

    result.push(lines[i]);
    i++;
  }

  return result.join('\n');
}

// Full normalization pipeline
function normalizeBody(body: string): string {
  let text = stripWordPressHtml(body);

  // Collapse excessive inline whitespace (from HTML stripping) - normalize each line
  text = text.split('\n').map(line => {
    const trimmed = line.trim();
    if (!trimmed) return '';
    return trimmed.replace(/\s{2,}/g, ' ');
  }).join('\n');

  // Merge orphaned list markers: a line that is just "-" or "*" followed by blank lines then text
  // Pattern: "- \n\n SomeText" → "- SomeText"
  text = text.replace(/^(-|\*)\s*\n+([^\n-*#|>])/gm, '$1 $2');

  // Promote ### / #### / ##### headings → ##
  text = text.replace(/^#{3,5}\s+/gm, '## ');

  // Remove "Table of Contents" / "Table of Content" heading and following list
  text = text.replace(
    /^##\s+(?:Table\s+of\s+Contents?|TOC|Contents)\s*\n((?:[ \t]*(?:[-*\d.]|\[)[^\n]*\n?)*)/gim,
    ''
  );
  text = text.replace(/^(?:Table\s+of\s+Contents?|TOC|Contents)\s*$/gim, '');

  // Remove standalone TOC-like blocks at the very start (3+ short list items, possibly with blank lines between)
  text = text.replace(/^\s*((?:[ \t]*-\s+[^\n]+\n(?:\s*\n)*){3,})/m, (match, tocBlock) => {
    const items = tocBlock.trim().split('\n').filter((l: string) => l.trim().startsWith('-'));
    const allShort = items.every((item: string) => item.trim().length < 100);
    return allShort && items.length >= 3 ? '' : match;
  });

  // Reconstruct flattened tables
  text = reconstructFlattenedTables(text);

  // Collect all ## heading texts
  const lines = text.split('\n');
  const headingTexts = new Set<string>();
  for (const line of lines) {
    const m = line.trim().match(/^##\s+(.+)/);
    if (m) headingTexts.add(m[1].trim().toLowerCase());
  }

  // Remove plain lines that exactly duplicate a ## heading title
  const filtered = lines.filter(line => {
    const t = line.trim();
    if (!t) return true;
    if (t.startsWith('#')) return true;
    if (t.startsWith('-') || t.startsWith('*') || /^\d+\./.test(t)) return true;
    if (t.startsWith('>') || t.startsWith('|') || t.includes('\t')) return true;
    if (headingTexts.has(t.toLowerCase())) return false;
    const boldMatch = t.match(/^\*\*(.+)\*\*$/);
    if (boldMatch && headingTexts.has(boldMatch[1].trim().toLowerCase())) return false;
    return true;
  });

  text = filtered.join('\n');

  // Remove lines that are only whitespace
  text = text.replace(/^[ \t]+$/gm, '');

  // Collapse 3+ consecutive blank lines into 1
  text = text.replace(/\n{3,}/g, '\n\n');

  return text.trim();
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { table, dry_run = true, limit = 10, force_all = false } = await req.json();

    if (!table || !['articles', 'analyses', 'awareness'].includes(table)) {
      return new Response(JSON.stringify({ error: "Invalid table. Use: articles, analyses, awareness" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch records - either all or just those with known issues
    let query = supabase
      .from(table)
      .select('id, title, body')
      .not('body', 'is', null);

    if (!force_all) {
      query = query.or('body.ilike.%<!--%,body.ilike.%<div%,body.ilike.%<span%,body.ilike.%<p>%,body.ilike.%<ul%,body.ilike.%<table%,body.ilike.%#####%,body.ilike.%####%,body.ilike.%###%,body.ilike.%  %');
    }

    const { data: records, error } = await query.limit(limit);

    if (error) throw error;

    const results: { id: string; title: string; changed: boolean; bodyLenBefore: number; bodyLenAfter: number }[] = [];

    for (const record of records || []) {
      if (!record.body) continue;

      const normalized = normalizeBody(record.body);
      const changed = normalized !== record.body.trim();

      if (changed && !dry_run) {
        const { error: updateError } = await supabase
          .from(table)
          .update({ body: normalized })
          .eq('id', record.id);

        if (updateError) {
          console.error(`Failed to update ${record.id}:`, updateError);
        }
      }

      results.push({
        id: record.id,
        title: record.title,
        changed,
        bodyLenBefore: record.body.length,
        bodyLenAfter: normalized.length,
      });
    }

    return new Response(
      JSON.stringify({
        table,
        dry_run,
        total_checked: results.length,
        total_changed: results.filter(r => r.changed).length,
        results,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
