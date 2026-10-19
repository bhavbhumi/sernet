import { describe, it, expect } from 'vitest';
import { resolvePublishedAt, itemDateToIstMidnight } from './publishedAt';

const NOW = new Date('2026-10-19T10:00:00.000Z');

describe('itemDateToIstMidnight', () => {
  it('converts a date to midnight Asia/Kolkata', () => {
    expect(itemDateToIstMidnight('2024-03-15')).toBe('2024-03-15T00:00:00+05:30');
  });
});

describe('resolvePublishedAt', () => {
  it('uses item_date at IST midnight when publishing', () => {
    expect(resolvePublishedAt({ status: 'published', itemDate: '2024-03-15', now: NOW }))
      .toBe('2024-03-15T00:00:00+05:30');
  });

  it('uses item_date at IST midnight on draft saves too (preserves date through later edits)', () => {
    expect(resolvePublishedAt({ status: 'draft', itemDate: '2024-03-15', now: NOW }))
      .toBe('2024-03-15T00:00:00+05:30');
  });

  it('item_date overrides an existing timestamp', () => {
    expect(resolvePublishedAt({ status: 'published', itemDate: '2024-03-15', existingPublishedAt: '2026-01-01T00:00:00.000Z', now: NOW }))
      .toBe('2024-03-15T00:00:00+05:30');
  });

  it('preserves an existing timestamp when publishing without item_date', () => {
    expect(resolvePublishedAt({ status: 'published', existingPublishedAt: '2025-06-01T05:30:00.000Z', now: NOW }))
      .toBe('2025-06-01T05:30:00.000Z');
  });

  it('uses current time only for a genuinely new undated publication', () => {
    expect(resolvePublishedAt({ status: 'published', now: NOW }))
      .toBe('2026-10-19T10:00:00.000Z');
  });

  it('does not clear a historical published_at when reverting to draft', () => {
    expect(resolvePublishedAt({ status: 'draft', existingPublishedAt: '2025-06-01T05:30:00.000Z', now: NOW }))
      .toBe('2025-06-01T05:30:00.000Z');
  });

  it('returns null for a new undated draft', () => {
    expect(resolvePublishedAt({ status: 'draft', now: NOW })).toBeNull();
  });

  it('treats blank item_date as absent', () => {
    expect(resolvePublishedAt({ status: 'published', itemDate: '  ', existingPublishedAt: '2025-06-01T05:30:00.000Z', now: NOW }))
      .toBe('2025-06-01T05:30:00.000Z');
  });
});
