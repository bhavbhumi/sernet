import { useMemo } from 'react';
import sanitizeHtml from 'sanitize-html';

// String-based sanitising (no DOM) so the same output is produced on the server
// and in the browser: legal text ships in the initial HTML and hydrates cleanly.
const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [...sanitizeHtml.defaults.allowedTags, 'img', 'h1', 'h2', 'span', 'u', 's', 'sup', 'sub', 'del', 'ins', 'figure', 'figcaption'],
  allowedAttributes: {
    '*': ['id', 'class', 'title', 'data-policy-group', 'style'],
    a: ['href', 'name', 'target', 'rel'],
    img: ['src', 'alt', 'width', 'height', 'loading'],
    td: ['colspan', 'rowspan', 'scope'],
    th: ['colspan', 'rowspan', 'scope'],
  },
  allowedStyles: { '*': { 'text-align': [/^(left|right|center|justify)$/] } },
  allowedSchemes: ['http', 'https', 'mailto', 'tel'],
  allowProtocolRelative: false,
};

function decodeEntities(value: string): string {
  return value
    .replace(/&#x([0-9a-f]+);/gi, (_, hex: string) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec: string) => String.fromCodePoint(Number(dec)))
    .replace(/&nbsp;/g, '\u00a0')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
}

function readAttribute(attributes: string, name: string): string {
  const match = attributes.match(new RegExp(`\\s${name}="([^"]*)"`));
  return match ? decodeEntities(match[1]) : '';
}

export function processLegalHtml(body: string) {
  const usedIds = new Set<string>();
  const headings: { id: string; label: string; group: string }[] = [];
  let index = 0;
  const html = sanitizeHtml(body, SANITIZE_OPTIONS).replace(/<h2((?:\s[^>]*)?)>([\s\S]*?)<\/h2>/g, (_match, attributes: string, inner: string) => {
    const requestedId = readAttribute(attributes, 'id');
    let id = /^legal-section-\d+$/.test(requestedId) && !usedIds.has(requestedId) ? requestedId : `legal-section-${index + 1}`;
    while (usedIds.has(id)) id = `legal-section-${Number(id.replace('legal-section-', '')) + 1}`;
    usedIds.add(id);
    const label = decodeEntities(inner.replace(/<[^>]*>/g, '')).trim() || `Section ${index + 1}`;
    headings.push({ id, label, group: readAttribute(attributes, 'data-policy-group') });
    index += 1;
    const otherAttributes = attributes.replace(/\sid="[^"]*"/, '');
    return `<h2 id="${id}"${otherAttributes}>${inner}</h2>`;
  });
  const groups = headings.reduce<{ label: string; headings: typeof headings }[]>((result, heading) => {
    const lastGroup = result[result.length - 1];
    if (lastGroup?.label === heading.group) lastGroup.headings.push(heading);
    else result.push({ label: heading.group, headings: [heading] });
    return result;
  }, []);
  return { html, headings, groups };
}

export function LegalDocument({ body }: { body: string }) {
  const document = useMemo(() => processLegalHtml(body), [body]);

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_220px]">
      <div className="min-w-0 prose max-w-none text-muted-foreground break-words [&_p]:leading-relaxed [&_p]:my-4 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-foreground [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:scroll-mt-40 [&_h2:first-child]:mt-0 [&_h3]:text-lg [&_h3]:font-medium [&_h3]:text-foreground [&_strong]:text-foreground [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:my-2 [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 [&_table]:block [&_table]:overflow-x-auto [&_table]:w-full [&_th]:text-left [&_th]:p-3 [&_th]:border [&_th]:border-border [&_td]:p-3 [&_td]:border [&_td]:border-border" dangerouslySetInnerHTML={{ __html: document.html }} />
      {document.headings.length > 0 && (
        <aside className="order-first lg:order-last">
          <nav aria-label="On this page" className="lg:sticky lg:top-36 border-l border-border pl-5">
            <p className="mb-3 text-xs font-semibold uppercase text-foreground">On this page</p>
            <div className="space-y-5">
              {document.groups.map((group, index) => (
                <div key={`${group.label}-${index}`}>
                  {group.label && <p className="mb-2 text-xs font-semibold text-foreground">{group.label}</p>}
                  <ol className="space-y-3">
                    {group.headings.map((heading) => (
                      <li key={heading.id}><a className="text-sm text-muted-foreground hover:text-primary focus-visible:text-primary" href={`#${heading.id}`}>{heading.label}</a></li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          </nav>
        </aside>
      )}
    </div>
  );
}