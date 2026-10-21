import { describe, it, expect } from 'vitest';
import { typeSlug, typeFromSlug, postPath } from './insightsTaxonomy';

describe('insights taxonomy', () => {
  it('slugs Macro & Markets', () => expect(typeSlug('Macro & Markets')).toBe('macro-and-markets'));
  it('round-trips type slugs', () => expect(typeFromSlug('personal-finance')).toBe('Personal Finance'));
  it('unknown slug falls back to All', () => expect(typeFromSlug('xyz')).toBe('All'));
  it('analysis posts keep analysis URL', () => expect(postPath({ id: 'a', content_type: 'analysis' })).toBe('/insights/analysis/a'));
  it('other posts keep article URL', () => expect(postPath({ id: 'b', content_type: 'article' })).toBe('/insights/articles/b'));
});
