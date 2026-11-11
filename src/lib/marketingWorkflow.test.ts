import { describe, it, expect } from 'vitest';
import { CAMPAIGN_TYPES, EVENT_TYPES, trackedLink, canHandOff } from './marketingWorkflow';
describe('Marketing workflow', () => {
  it('includes all ten requested campaign categories', () => expect(CAMPAIGN_TYPES).toEqual(['referral','email','sms','whatsapp','digital_ad','seo','sem','smm','print','other']));
  it('includes all six requested event categories', () => expect(EVENT_TYPES).toEqual(['webinar','seminar','workshop','conference','investor_meet','other']));
  it('preserves onboarding tab and anchor in campaign links', () => {
    const url = new URL(trackedLink('https://sernetindia.com/open-account?tab=invest#interest', { utm_source: 'LinkedIn', utm_medium: 'social', utm_campaign: 'sip-nov' }));
    expect(url.searchParams.get('tab')).toBe('invest'); expect(url.hash).toBe('#interest'); expect(url.searchParams.get('utm_source')).toBe('linkedin');
  });
  it('rejects unsafe destination protocols', () => expect(() => trackedLink('javascript:alert(1)', {})).toThrow());
  it('requires qualification before Sales handoff', () => expect(canHandOff({ qualification_status: 'unreviewed', contact_permission: 'permitted', assigned_to: 'owner' })).toBe(false));
  it('requires contact permission before Sales handoff', () => expect(canHandOff({ qualification_status: 'qualified', contact_permission: 'unconfirmed', assigned_to: 'owner' })).toBe(false));
  it('requires an owner before Sales handoff', () => expect(canHandOff({ qualification_status: 'qualified', contact_permission: 'permitted', assigned_to: null })).toBe(false));
  it('requires evidence for permitted contact before Sales handoff', () => expect(canHandOff({ qualification_status: 'qualified', contact_permission: 'permitted', assigned_to: 'owner', permission_evidence: ' ' })).toBe(false));
  it('allows a qualified permitted assigned lead with evidence', () => expect(canHandOff({ qualification_status: 'qualified', contact_permission: 'permitted', assigned_to: 'owner', permission_evidence: 'Client requested a callback on 11 November 2026' })).toBe(true));
});