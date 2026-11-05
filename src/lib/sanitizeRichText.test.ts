import { describe, expect, it } from 'vitest';
import { sanitizeRichText } from './sanitizeRichText';

describe('sanitizeRichText', () => {
  it('removes executable elements, event handlers, and unsafe URL schemes', () => {
    const html = sanitizeRichText(
      '<script>alert(1)</script><p onclick="alert(1)">Safe text</p><a href="javascript:alert(1)">Bad link</a><img src="x" onerror="alert(1)">',
    );

    expect(html).not.toContain('<script');
    expect(html).not.toContain('onclick');
    expect(html).not.toContain('onerror');
    expect(html).not.toContain('javascript:');
    expect(html).toContain('Safe text');
  });

  it('preserves ordinary formatting, tables, and safe links', () => {
    const html = sanitizeRichText(
      '<h2>Checklist</h2><ul><li>Review <strong>details</strong></li></ul><table><tr><td>Value</td></tr></table><a href="/support" target="_blank">Support</a>',
    );

    expect(html).toContain('<h2>Checklist</h2>');
    expect(html).toContain('<li>Review <strong>details</strong></li>');
    expect(html).toContain('<td>Value</td>');
    expect(html).toContain('href="/support"');
  });

  it('returns an empty string for absent CMS content', () => {
    expect(sanitizeRichText(null)).toBe('');
  });
});