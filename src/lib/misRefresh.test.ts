import { describe, expect, it } from 'vitest';
import { isMISQuery, readAllMISRows, readMISCount } from './misRefresh';

describe('MIS accuracy', () => {
  it('reads beyond the first 1,000 records', async () => {
    const source = Array.from({ length: 1201 }, (_, id) => ({ id }));
    const result = await readAllMISRows(async (from, to) => ({ data: source.slice(from, to + 1), error: null }));
    expect(result).toHaveLength(1201);
    expect(result[1200].id).toBe(1200);
  });
  it('does not represent a failed count as zero', () => {
    expect(readMISCount({ count: null, error: { message: 'Denied' } })).toBeNull();
    expect(readMISCount({ count: 0, error: null })).toBe(0);
  });
  it('does not return partial totals after a page fails', async () => {
    await expect(readAllMISRows(async from => ({
      data: from === 0 ? Array.from({ length: 500 }, (_, id) => id) : null,
      error: from === 0 ? null : { message: 'Unavailable' },
    }))).rejects.toThrow('Unavailable');
  });
  it('refreshes operational figures but not costly on-demand diagnostics', () => {
    expect(isMISQuery(['crm-deals'])).toBe(true);
    expect(isMISQuery(['system-health'])).toBe(false);
    expect(isMISQuery(['site_settings'])).toBe(false);
  });
});