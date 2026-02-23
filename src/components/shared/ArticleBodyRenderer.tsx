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

// Extract headings from raw body text (supports # H1, ## H2, ### H3)
export function extractToc(body: string): TocEntry[] {
  const lines = body.split('\n');
  const entries: TocEntry[] = [];
  for (const line of lines) {
    const m3 = line.match(/^###\s+(.+)/);
    const m2 = line.match(/^##\s+(.+)/);
    const m1 = line.match(/^#\s+(.+)/);
    if (m3) entries.push({ level: 3, text: m3[1].trim(), slug: slugify(m3[1].trim()) });
    else if (m2) entries.push({ level: 2, text: m2[1].trim(), slug: slugify(m2[1].trim()) });
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
  // H3
  const m3 = line.match(/^###\s+(.+)/);
  if (m3) {
    const text = m3[1].trim();
    return (
      <h3 key={index} id={slugify(text)} className="text-base font-semibold text-foreground mt-6 mb-2 scroll-mt-24">
        {text}
      </h3>
    );
  }
  // H2
  const m2 = line.match(/^##\s+(.+)/);
  if (m2) {
    const text = m2[1].trim();
    return (
      <h2 key={index} id={slugify(text)} className="text-xl font-bold text-foreground mt-8 mb-3 border-b border-border/60 pb-1.5 scroll-mt-24">
        {text}
      </h2>
    );
  }
  // H1
  const m1 = line.match(/^#\s+(.+)/);
  if (m1) {
    const text = m1[1].trim();
    return (
      <h1 key={index} id={slugify(text)} className="text-2xl font-extrabold text-foreground mt-10 mb-4 scroll-mt-24">
        {text}
      </h1>
    );
  }
  // Blockquote
  const mq = line.match(/^>\s+(.+)/);
  if (mq) {
    return (
      <blockquote key={index} className="border-l-4 border-primary/50 pl-4 italic text-muted-foreground my-4">
        {renderInline(mq[1])}
      </blockquote>
    );
  }
  // Horizontal rule
  if (/^---+$/.test(line.trim())) {
    return <hr key={index} className="border-border my-6" />;
  }
  // Bullet list items
  const mb = line.match(/^[-*]\s+(.+)/);
  if (mb) {
    return (
      <li key={index} className="ml-5 list-disc text-foreground/90 leading-relaxed my-0.5">
        {renderInline(mb[1])}
      </li>
    );
  }
  // Numbered list items
  const mn = line.match(/^\d+\.\s+(.+)/);
  if (mn) {
    return (
      <li key={index} className="ml-5 list-decimal text-foreground/90 leading-relaxed my-0.5">
        {renderInline(mn[1])}
      </li>
    );
  }
  // Empty line = paragraph break
  if (line.trim() === '') {
    return <br key={index} />;
  }
  // Regular paragraph with inline formatting
  return (
    <p key={index} className="text-foreground/90 leading-relaxed my-2">
      {renderInline(line)}
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
  const lines = body.split('\n');
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
