import { describe, expect, it } from 'vitest';
import { extractToc, normalizeBody, recoverCollapsedArticle } from './ArticleBodyRenderer';

describe('collapsed article recovery', () => {
  it('unwraps a legacy layout table and restores joined section headings', () => {
    const body = '| Fund growth |\n| --- |\n| A LONGER-TERM PERSPECTIVE OF EQUITY FUND GROWTHMutual fund growth has two measures.One captures AUM.RANKING ACTIVE EQUITY FUNDS ON A COMBINED SCOREActive funds were ranked. |';
    const result = normalizeBody(body);
    expect(result).toContain('## A LONGER-TERM PERSPECTIVE OF EQUITY FUND GROWTH\n\nMutual fund growth');
    expect(result).toContain('two measures.\n\nOne captures AUM.');
    expect(extractToc(body).map(entry => entry.text)).toEqual([
      'Fund growth',
      'A LONGER-TERM PERSPECTIVE OF EQUITY FUND GROWTH',
      'RANKING ACTIVE EQUITY FUNDS ON A COMBINED SCORE',
    ]);
  });

  it('does not guess lost numeric table cells or change their values', () => {
    const body = '| Fund growth |\n| --- |\n| Equity FundCategorySep 2026AUM (₹ Cr)Multi-Cap Fund2,48,18893,75738.33% |';
    expect(recoverCollapsedArticle(body)).toContain('Equity FundCategorySep 2026AUM (₹ Cr)Multi-Cap Fund2,48,18893,75738.33%');
  });

  it('leaves real multi-column tables and already formatted articles unchanged', () => {
    const table = '| Event | Date |\n| --- | --- |\n| Opens | 15 October 2026 |';
    const markdown = '## Company background\n\nA company overview.\n\n## Dates\n\n' + table;
    expect(recoverCollapsedArticle(table)).toBe(table);
    expect(normalizeBody(markdown)).toBe(markdown);
  });

  it('preserves appended account links while recovering the article wrapper', () => {
    const body = '| IPO overview |\n| --- |\n| COMPANY BACKGROUNDThis company operates globally. |\n\n---\n\n## Interested in applying for this IPO?\n\n[Log in](https://example.com/login)';
    expect(normalizeBody(body)).toContain('[Log in](https://example.com/login)');
    expect(extractToc(body).at(-1)?.text).toBe('Interested in applying for this IPO?');
  });
});