import { describe, expect, it } from 'vitest';
import { cmsOrderColumn, cmsPublicationPatch, matchesCMSRecord } from './cmsRecords';

describe('calendar and subscriber records', () => {
  it('does not query missing publication columns in subscribers or calendars', () => {
    expect(cmsOrderColumn([{ key: 'subscribed_at', type: 'date' }])).toBe('created_at');
    expect(cmsOrderColumn([{ key: 'event_date', type: 'date' }], 'event_date')).toBe('event_date');
    expect(cmsOrderColumn([{ key: 'published_at', type: 'date' }])).toBe('published_at');
  });
  it('does not add nonexistent published_at to calendar saves or status changes', () => {
    expect(cmsPublicationPatch(false, 'published', undefined)).toEqual({});
    expect(cmsPublicationPatch(true, 'published', '2026-06-01T00:00:00Z')).toEqual({});
    expect(cmsPublicationPatch(true, 'draft', undefined)).toEqual({});
    expect(cmsPublicationPatch(true, 'published', undefined).published_at).toBeDefined();
  });
  it('searches subscriber names/emails and calendar event names rather than only titles', () => {
    expect(matchesCMSRecord({ email: 'reader@example.test' }, ['email'], 'reader')).toBe(true);
    expect(matchesCMSRecord({ holiday_name: 'Diwali' }, ['holiday_name'], 'Diwali')).toBe(true);
    expect(matchesCMSRecord({ event_name: 'RBI Policy' }, ['event_name'], 'GDP')).toBe(false);
  });
});