import { describe, it, expect } from 'vitest';
import { evaluateLiveChecks, type FetchedResource } from './seoLiveChecks';
const ok = (body: string, url = 'https://sernetindia.com/'): FetchedResource => ({ ok: true, status: 200, body, url });
const home = (img: string, title = 'SERNET Home') => ok(`<html><head><title>${title}</title><meta name="description" content="d"></head><body><h1>Hi</h1><img src="${img}">${'x'.repeat(6000)}</body></html>`);
const base = { robots: ok('User-agent: *\nAllow: /'), sitemapXml: ok('<loc>a</loc>'), sitemapPage: ok(''), llms: ok('x'), ogImage: null };
const get = (c: ReturnType<typeof evaluateLiveChecks>, id: string) => c.find(x => x.id === id)!;
describe('live SEO checks', () => {
  it('warns when a homepage image is PNG', () => {
    expect(get(evaluateLiveChecks({ ...base, home: home('/assets/a.png') }), 'webp').status).toBe('warn');
  });
  it('passes when homepage images are WebP', () => {
    expect(get(evaluateLiveChecks({ ...base, home: home('/assets/a.webp') }), 'webp').status).toBe('pass');
  });
  it('warns when title exceeds 60 characters', () => {
    expect(get(evaluateLiveChecks({ ...base, home: home('/a.webp', 'x'.repeat(61)) }), 'title-length').status).toBe('warn');
  });
  it('fails robots.txt that blocks all crawlers', () => {
    expect(get(evaluateLiveChecks({ ...base, robots: ok('User-agent: *\nDisallow: /'), home: home('/a.webp') }), 'robots').status).toBe('fail');
  });
});
