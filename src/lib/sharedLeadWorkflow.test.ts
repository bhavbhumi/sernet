import { describe, expect, it } from 'vitest';
import { canAcceptLead, inSalesQueue, leadProspect, qualificationSaveStage } from './sharedLeadWorkflow';
describe('Shared enquiry workflow', () => {
  it('converts the referred prospect rather than the referrer', () => expect(leadProspect({ name: 'Referrer', phone: '111', email: null, source: 'referral', context: { referee_name: 'Prospect', referee_phone: '222', referee_email: 'prospect@example.com' } })).toEqual({ name: 'Prospect', phone: '222', email: 'prospect@example.com' }));
  it('does not fall back to referrer when prospect details are absent', () => expect(leadProspect({ name: 'Referrer', phone: '111', email: null, source: 'referral', context: {} }).phone).toBe(''));
  it('includes handed-off leads in Sales queue', () => expect(inSalesQueue({ handoff_status: 'ready', status: 'new' })).toBe(true));
  it('excludes unqualified Marketing enquiries from Sales queue', () => expect(inSalesQueue({ handoff_status: 'marketing', status: 'new' })).toBe(false));
  it('excludes already converted enquiries from the open queue', () => expect(inSalesQueue({ handoff_status: 'accepted', status: 'converted' })).toBe(false));
  it('keeps accepted handoff on qualification save', () => expect(qualificationSaveStage('accepted')).toBe('accepted'));
  it('permits assigned Sales owner to accept ready handoff', () => expect(canAcceptLead({ handoff_status: 'ready', assigned_to: 'owner' }, 'owner', true, false)).toBe(true));
  it('blocks another staff member from accepting', () => expect(canAcceptLead({ handoff_status: 'ready', assigned_to: 'owner' }, 'other', true, false)).toBe(false));
  it('permits authorised Sales supervisor to accept', () => expect(canAcceptLead({ handoff_status: 'ready', assigned_to: 'owner' }, 'supervisor', true, true)).toBe(true));
  it('blocks Marketing-only acceptance', () => expect(canAcceptLead({ handoff_status: 'ready', assigned_to: 'owner' }, 'owner', false, false)).toBe(false));
});