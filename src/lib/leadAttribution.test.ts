import { describe, expect, it } from 'vitest';
import { attributionLabel, mergeAttribution, parseAttribution } from './leadAttribution';

const now = new Date('2026-11-09T10:00:00Z');

describe('lead attribution', () => {
  it('captures campaign tags and landing page from a tagged visit', () => {
    const a = parseAttribution('https://sernetindia.com/open-account?utm_source=Newsletter&utm_medium=email&utm_campaign=diwali-2026', '', now);
    expect(a).toMatchObject({ utm_source: 'newsletter', utm_medium: 'email', utm_campaign: 'diwali-2026', landing_page: '/open-account' });
  });

  it('records an external referrer but ignores internal navigation', () => {
    expect(parseAttribution('https://sernetindia.com/insights', 'https://www.google.com/', now)?.referrer).toBe('www.google.com');
    expect(parseAttribution('https://sernetindia.com/insights', 'https://sernetindia.com/', now)).toBeNull();
  });

  it('lets a new campaign visit replace an older plain referral', () => {
    const old = parseAttribution('https://sernetindia.com/', 'https://google.com/', now);
    const tagged = parseAttribution('https://sernetindia.com/?utm_source=linkedin', '', now);
    expect(mergeAttribution(old, tagged, now)?.utm_source).toBe('linkedin');
    expect(mergeAttribution(tagged, old, now)?.utm_source).toBe('linkedin');
  });

  it('expires attribution after 30 days', () => {
    const old = parseAttribution('https://sernetindia.com/?utm_source=linkedin', '', new Date('2026-10-01T00:00:00Z'));
    expect(mergeAttribution(old, null, now)).toBeNull();
  });

  it('labels untagged leads as direct / unknown', () => {
    expect(attributionLabel({})).toEqual({ channel: 'direct / unknown', campaign: null });
    expect(attributionLabel({ attribution: { utm_source: 'newsletter', utm_campaign: 'nov' } })).toEqual({ channel: 'newsletter', campaign: 'nov' });
  });
});
