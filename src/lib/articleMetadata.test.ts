import { describe, expect, it } from 'vitest';
import { articlePath, articleShareImage } from './articleMetadata';
import { articleHtml } from '../../prerender/articlePrerender';

describe('article sharing metadata', () => {
  it('uses the registered article route', () => {
    expect(articlePath('b413f885-3827-5c6d-a5e3-77b0b5f6ae08')).toBe('/insights/articles/b413f885-3827-5c6d-a5e3-77b0b5f6ae08');
  });
  it('uses the same article image in a sized sharing rendition', () => {
    const image = articleShareImage('https://example.com/storage/v1/object/public/cms-media/cover.png');
    expect(image).toBe('https://example.com/storage/v1/render/image/public/cms-media/cover.png?width=1200&height=630&resize=cover&quality=75');
  });
  it('replaces generic metadata in initial HTML, with one self-referencing canonical', () => {
    const template = '<head><title>Generic</title><meta property="og:title" content="Generic"><meta property="og:image" content="generic.png"><meta name="twitter:image" content="generic.png"><link rel="canonical" href="https://example.com/"></head><body></body>';
    const html = articleHtml(template, { id: 'abc', title: 'Funds & growth', excerpt: 'Original report', thumbnail_url: '/cover.webp', media_url: null });
    expect(html).not.toContain('Generic');
    expect(html).not.toContain('generic.png');
    expect(html.match(/rel="canonical"/g)).toHaveLength(1);
    expect(html).toContain('property="og:url" content="https://sernetindia.com/insights/articles/abc"');
    expect(html).toContain('property="og:image" content="https://sernetindia.com/cover.webp"');
    expect(html).toContain('Funds &amp; growth');
  });
});