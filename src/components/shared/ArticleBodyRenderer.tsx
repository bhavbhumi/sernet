import React, { useId } from 'react';

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
        {mq[1]}
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
        {mb[1]}
      </li>
    );
  }
  // Numbered list items
  const mn = line.match(/^\d+\.\s+(.+)/);
  if (mn) {
    return (
      <li key={index} className="ml-5 list-decimal text-foreground/90 leading-relaxed my-0.5">
        {mn[1]}
      </li>
    );
  }
  // Bold text inline (**text**)
  // Empty line = paragraph break
  if (line.trim() === '') {
    return <br key={index} />;
  }
  // Regular paragraph with inline bold support
  const parts = line.split(/(\*\*[^*]+\*\*)/g);
  return (
    <p key={index} className="text-foreground/90 leading-relaxed my-2">
      {parts.map((part, i) => {
        const bold = part.match(/^\*\*(.+)\*\*$/);
        return bold ? <strong key={i} className="font-semibold text-foreground">{bold[1]}</strong> : part;
      })}
    </p>
  );
}

interface Props {
  body: string;
}

export function ArticleBodyRenderer({ body }: Props) {
  const lines = body.split('\n');
  return (
    <div className="space-y-0">
      {lines.map((line, i) => renderLine(line, i))}
    </div>
  );
}
