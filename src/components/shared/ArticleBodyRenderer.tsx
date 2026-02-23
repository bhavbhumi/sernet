import React from 'react';

// Slugify a heading text to use as anchor id
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

export interface TocEntry {
  level: 1 | 2 | 3;
  text: string;
  slug: string;
}

// Detect artifact/junk lines from HTML-to-markdown conversion
function isArtifactLine(line: string): boolean {
  const t = line.trim();
  if (!t) return false;
  if (/^[-–—.·•]{1,3}$/.test(t)) return true;
  if (/^<!--.*-->$/.test(t)) return true;
  if (t === '-->' || t === '<!--' || t === '->') return true;
  return false;
}

// Detect and reconstruct flattened HTML tables (plain text with repeating column groups)
function reconstructFlattenedTables(text: string): string {
  const lines = text.split('\n');
  const result: string[] = [];
  let i = 0;

  while (i < lines.length) {
    // Look for a bold header group: consecutive bold lines (**Header1** \n **Header2** ...)
    const headerStart = i;
    const headers: string[] = [];
    let j = i;

    // Collect consecutive bold-only lines as potential headers
    while (j < lines.length) {
      const t = lines[j].trim();
      const boldMatch = t.match(/^\*\*(.+)\*\*$/);
      if (boldMatch) {
        headers.push(boldMatch[1].trim());
        j++;
      } else if (t === '' && headers.length > 0) {
        // allow one blank line after headers
        break;
      } else {
        break;
      }
    }

    // Need at least 2 headers to form a table
    if (headers.length >= 2) {
      // Skip blank line after headers
      if (j < lines.length && lines[j].trim() === '') j++;

      // Try to collect data rows: groups of N non-empty lines separated by blank lines
      const colCount = headers.length;
      const dataRows: string[][] = [];
      let k = j;

      while (k < lines.length) {
        // Collect next group of non-empty lines
        const group: string[] = [];
        while (k < lines.length && lines[k].trim() !== '') {
          group.push(lines[k].trim());
          k++;
        }

        if (group.length === colCount) {
          dataRows.push(group);
          // Skip blank lines between groups
          while (k < lines.length && lines[k].trim() === '') k++;
        } else if (group.length === 0) {
          break;
        } else {
          // Group doesn't match column count — not a table, stop
          // Put back the lines
          k -= group.length;
          break;
        }
      }

      // Need at least 2 data rows for this to be a real table
      if (dataRows.length >= 2) {
        // Build pipe table
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

    // Not a table — output line as-is
    result.push(lines[i]);
    i++;
  }

  return result.join('\n');
}

// Normalize body: promote ###/####/##### → ##, strip TOC block, remove duplicate plain titles, collapse blank lines
export function normalizeBody(body: string): string {
  let text = body
    // ##### heading → ## heading
    .replace(/^#{3,5}\s+/gm, '## ');

  // Remove "Table of Contents" / "Table of Content" section
  text = text.replace(
    /^##\s+(?:Table\s+of\s+Contents?|TOC|Contents)\s*\n((?:[ \t]*(?:[-*\d.]|\[)[^\n]*\n?)*)/gim,
    ''
  );
  text = text.replace(/^(?:Table\s+of\s+Contents?|TOC|Contents)\s*$/gim, '');

  // Reconstruct flattened tables before other processing
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
    if (!t) return true; // keep blank lines
    if (t.startsWith('#')) return true; // keep actual headings
    if (t.startsWith('-') || t.startsWith('*') || /^\d+\./.test(t)) return true; // keep lists
    if (t.startsWith('>') || t.startsWith('|') || t.includes('\t')) return true; // keep quotes/tables
    // If this plain line matches a heading title exactly, remove it
    if (headingTexts.has(t.toLowerCase())) return false;
    // Also check bold wrapped: **Title**
    const boldMatch = t.match(/^\*\*(.+)\*\*$/);
    if (boldMatch && headingTexts.has(boldMatch[1].trim().toLowerCase())) return false;
    return true;
  });

  text = filtered.join('\n');

  // Collapse 3+ consecutive blank lines into 1
  text = text.replace(/\n{3,}/g, '\n\n');

  return text.trim();
}

// Extract headings from raw body text (supports # H1, ## H2)
export function extractToc(body: string): TocEntry[] {
  const normalized = normalizeBody(body);
  const lines = normalized.split('\n');
  const entries: TocEntry[] = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (isArtifactLine(trimmed)) continue;
    const m2 = trimmed.match(/^##\s+(.+)/);
    const m1 = trimmed.match(/^#\s+(.+)/);
    if (m2) entries.push({ level: 2, text: m2[1].trim(), slug: slugify(m2[1].trim()) });
    else if (m1) entries.push({ level: 1, text: m1[1].trim(), slug: slugify(m1[1].trim()) });
  }
  return entries;
}

// Render inline formatting: **bold**, *italic*, `code`, [links](url), <a href="url">, bare URLs
function renderInline(text: string): React.ReactNode[] {
  // Split on bold, code, markdown links, HTML <a> tags, and bare URLs
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\)|<a\s[^>]*>.*?<\/a>|https?:\/\/[^\s<>\])"']+)/g);
  return parts.map((part, i) => {
    const bold = part.match(/^\*\*(.+)\*\*$/);
    if (bold) return <strong key={i} className="font-semibold text-foreground">{bold[1]}</strong>;
    const code = part.match(/^`(.+)`$/);
    if (code) return <code key={i} className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">{code[1]}</code>;
    // Markdown link: [text](url)
    const mdLink = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (mdLink) return <a key={i} href={mdLink[2]} target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors">{mdLink[1]}</a>;
    // HTML <a> tag
    const htmlLink = part.match(/^<a\s+href=["']([^"']+)["'][^>]*>(.*?)<\/a>$/i);
    if (htmlLink) return <a key={i} href={htmlLink[1]} target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors">{htmlLink[2]}</a>;
    // Bare URL
    if (/^https?:\/\//.test(part)) return <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2 hover:text-primary/80 transition-colors break-all">{part}</a>;
    return part;
  });
}

// Parse a markdown pipe-table OR tab-separated table block
function parseTable(lines: string[]): { headers: string[]; rows: string[][] } | null {
  if (lines.length < 2) return null;

  // Try pipe-delimited first
  if (lines[0].includes('|')) {
    const parsePipeRow = (line: string) =>
      line.replace(/^\|/, '').replace(/\|$/, '').split('|').map(c => c.trim());
    const headers = parsePipeRow(lines[0]);
    if (headers.length < 2) return null;
    // Check for separator row (|---|---|) — allow it to be missing for pasted tables
    let dataStart = 1;
    if (lines.length > 1 && /^[\s|:-]+$/.test(lines[1])) {
      dataStart = 2;
    }
    const rows = lines.slice(dataStart).map(parsePipeRow);
    return { headers, rows };
  }

  // Try tab-separated (common when pasting from Excel/web)
  if (lines[0].includes('\t')) {
    const headers = lines[0].split('\t').map(c => c.trim());
    if (headers.length < 2) return null;
    const rows = lines.slice(1).map(l => l.split('\t').map(c => c.trim()));
    return { headers, rows };
  }

  return null;
}

// Render a single line as a React node
function renderLine(line: string, index: number): React.ReactNode {
  const trimmed = line.trim();

  // Skip artifact lines
  if (isArtifactLine(trimmed)) return null;

  // H2 (### and #### are already normalized to ## by normalizeBody)
  const m2 = trimmed.match(/^##\s+(.+)/);
  if (m2) {
    const text = m2[1].trim();
    return (
      <h2 key={index} id={slugify(text)} className="text-xl font-bold text-foreground mt-8 mb-3 border-b border-border/60 pb-1.5 scroll-mt-24">
        {text}
      </h2>
    );
  }
  // H1
  const m1 = trimmed.match(/^#\s+(.+)/);
  if (m1) {
    const text = m1[1].trim();
    return (
      <h1 key={index} id={slugify(text)} className="text-2xl font-extrabold text-foreground mt-10 mb-4 scroll-mt-24">
        {text}
      </h1>
    );
  }
  // Blockquote
  const mq = trimmed.match(/^>\s+(.+)/);
  if (mq) {
    return (
      <blockquote key={index} className="border-l-4 border-primary/50 pl-4 italic text-muted-foreground my-4">
        {renderInline(mq[1])}
      </blockquote>
    );
  }
  // Horizontal rule
  if (/^---+$/.test(trimmed)) {
    return <hr key={index} className="border-border my-6" />;
  }
  // Bullet list items
  const mb = trimmed.match(/^[-*]\s+(.+)/);
  if (mb) {
    return (
      <li key={index} className="ml-5 list-disc text-foreground/90 leading-relaxed my-0.5">
        {renderInline(mb[1])}
      </li>
    );
  }
  // Numbered list items
  const mn = trimmed.match(/^\d+\.\s+(.+)/);
  if (mn) {
    return (
      <li key={index} className="ml-5 list-decimal text-foreground/90 leading-relaxed my-0.5">
        {renderInline(mn[1])}
      </li>
    );
  }
  // Empty line = paragraph break
  if (trimmed === '') {
    return <br key={index} />;
  }
  // Regular paragraph with inline formatting
  return (
    <p key={index} className="text-foreground/90 leading-relaxed my-2">
      {renderInline(trimmed)}
    </p>
  );
}

// Render a table block
function renderTable(tableLines: string[], startIndex: number): React.ReactNode {
  const parsed = parseTable(tableLines);
  if (!parsed) return null;
  const { headers, rows } = parsed;
  return (
    <div key={`table-${startIndex}`} className="my-6 overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-muted/40 border-b border-border">
            {headers.map((h, i) => (
              <th key={i} className="px-4 py-2.5 text-left font-semibold text-foreground whitespace-nowrap">
                {renderInline(h)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((row, ri) => (
            <tr key={ri} className="hover:bg-muted/20 transition-colors">
              {row.map((cell, ci) => (
                <td key={ci} className="px-4 py-2 text-foreground/90">
                  {renderInline(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface Props {
  body: string;
}

export function ArticleBodyRenderer({ body }: Props) {
  const normalized = normalizeBody(body);
  const lines = normalized.split('\n');
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    // Detect table block: line contains pipes or tabs (potential table)
    const lineT = lines[i].trim();
    const isPipeRow = lineT.startsWith('|') || (lineT.includes('|') && lineT.split('|').length >= 3);
    const isTabRow = lineT.includes('\t') && lineT.split('\t').length >= 2;

    if (isPipeRow || isTabRow) {
      const tableStart = i;
      const tableLines: string[] = [];
      while (i < lines.length) {
        const lt = lines[i].trim();
        const matchesPipe = isPipeRow && (lt.startsWith('|') || (lt.includes('|') && lt.split('|').length >= 3) || /^[\s|:-]+$/.test(lt));
        const matchesTab = isTabRow && lt.includes('\t');
        if (matchesPipe || matchesTab) {
          tableLines.push(lines[i]);
          i++;
        } else {
          break;
        }
      }
      const table = renderTable(tableLines, tableStart);
      if (table) {
        elements.push(table);
      } else {
        tableLines.forEach((line, idx) => elements.push(renderLine(line, tableStart + idx)));
      }
    } else {
      elements.push(renderLine(lines[i], i));
      i++;
    }
  }

  // Post-process: wrap consecutive <li> items in <ul> or <ol>
  const wrapped: React.ReactNode[] = [];
  let listBuffer: React.ReactElement[] = [];
  let listType: 'ul' | 'ol' | null = null;

  const flushList = () => {
    if (listBuffer.length > 0 && listType) {
      const Tag = listType;
      wrapped.push(<Tag key={`list-${listBuffer[0].key}`} className={listType === 'ol' ? 'list-decimal pl-5 my-3 space-y-0.5' : 'list-disc pl-5 my-3 space-y-0.5'}>{listBuffer}</Tag>);
      listBuffer = [];
      listType = null;
    }
  };

  for (const el of elements) {
    if (React.isValidElement(el) && el.type === 'li') {
      const cls = (el.props as { className?: string }).className || '';
      const currentType = cls.includes('list-decimal') ? 'ol' : 'ul';
      if (listType && listType !== currentType) flushList();
      listType = currentType;
      listBuffer.push(el);
    } else {
      flushList();
      wrapped.push(el);
    }
  }
  flushList();

  return <div className="space-y-0">{wrapped}</div>;
}
