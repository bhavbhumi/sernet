import { describe, expect, it } from 'vitest';
import { eligibleSubscriber } from './newsletterConsent';
describe('newsletter suppression', () => {
  it('matches legacy promotion targets to promotions preferences', () => {
    expect(eligibleSubscriber({ status: 'active', preferences: ['promotions'], unsubscribed_at: null }, ['promotion'])).toBe(true);
  });
  it('excludes unsubscribed addresses even when their preferences match', () => {
    expect(eligibleSubscriber({ status: 'unsubscribed', preferences: ['articles'], unsubscribed_at: null }, ['articles'])).toBe(false);
  });
  it('excludes active addresses with an outstanding unsubscribe timestamp', () => {
    expect(eligibleSubscriber({ status: 'active', preferences: ['articles'], unsubscribed_at: '2026-11-11T08:31:00Z' }, [])).toBe(false);
  });
  it('does not export a different preference audience', () => {
    expect(eligibleSubscriber({ status: 'active', preferences: ['resources'], unsubscribed_at: null }, ['promotions'])).toBe(false);
  });
});