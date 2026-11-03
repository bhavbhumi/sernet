import { describe, expect, it } from 'vitest';
import { articlePath, articleShareImage } from './articleMetadata';
import { articleHead } from './articleRoute';

describe('article sharing metadata', () => {
  it('uses the registered article route', () => {
    expect(articlePath('b413f885-3827-5c6d-a5e3-77b0b5f6ae08')).toBe('/insights/articles/b413f885-3827-5c6d-a5e3-77b0b5f6ae08');
  });
  it('uses the analysis route for analysis posts', () => {
    expect(articlePath('x', 'analysis')).toBe('/insights/analysis/x');
  });
  it('uses the same article image in a sized sharing rendition', () => {
    const image = articleShareImage('https://example.com/storage/v1/object/public/cms-media/cover.png');
    expect(image).toBe('https://example.com/storage/v1/render/image/public/cms-media/cover.png?width=600&height=315&resize=cover&quality=60');
  });
  it('builds per-article head tags with a self-referencing canonical and share image', () => {
    const head = articleHead({ id: 'abc', title: 'Funds & growth', excerpt: 'Original report', thumbnail_url: '/cover.webp', media_url: null, content_type: 'article' });
    const meta = head.meta ?? [];
    const prop = (p: string) => meta.find((m) => m['property'] === p)?.['content'];
    expect(meta.find((m) => 'title' in m)?.['title']).toBe('Funds & growth | SERNET Financial Services');
    expect(prop('og:url')).toBe('https://sernetindia.com/insights/articles/abc');
    expect(prop('og:image')).toBe('https://sernetindia.com/cover.webp');
    expect(head.links).toEqual([{ rel: 'canonical', href: 'https://sernetindia.com/insights/articles/abc' }]);
  });
  it('returns no override when the article is missing', () => {
    expect(articleHead(null)).toEqual({});
  });
});
