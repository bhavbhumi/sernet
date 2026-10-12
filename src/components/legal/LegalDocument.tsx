import { useMemo } from 'react';
import DOMPurify from 'dompurify';

export function LegalDocument({ body }: { body: string }) {
  const document = useMemo(() => {
    const parsed = new DOMParser().parseFromString(DOMPurify.sanitize(body), 'text/html');
    const headings = Array.from(parsed.querySelectorAll('h2')).map((heading, index) => {
      const id = `legal-section-${index + 1}`;
      heading.id = id;
      return { id, label: heading.textContent || `Section ${index + 1}` };
    });
    return { html: parsed.body.innerHTML, headings };
  }, [body]);

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_220px]">
      <div className="min-w-0 prose max-w-none text-muted-foreground break-words [&_p]:leading-relaxed [&_p]:my-4 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-foreground [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:scroll-mt-40 [&_h2:first-child]:mt-0 [&_h3]:text-lg [&_h3]:font-medium [&_h3]:text-foreground [&_strong]:text-foreground [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:my-2 [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 [&_table]:block [&_table]:overflow-x-auto [&_table]:w-full [&_th]:text-left [&_th]:p-3 [&_th]:border [&_th]:border-border [&_td]:p-3 [&_td]:border [&_td]:border-border" dangerouslySetInnerHTML={{ __html: document.html }} />
      {document.headings.length > 0 && (
        <aside className="order-first lg:order-last">
          <nav aria-label="On this page" className="lg:sticky lg:top-36 border-l border-border pl-5">
            <p className="mb-3 text-xs font-semibold uppercase text-foreground">On this page</p>
            <ol className="space-y-3">
              {document.headings.map((heading) => (
                <li key={heading.id}><a className="text-sm text-muted-foreground hover:text-primary focus-visible:text-primary" href={`#${heading.id}`}>{heading.label}</a></li>
              ))}
            </ol>
          </nav>
        </aside>
      )}
    </div>
  );
}