export const CAMPAIGN_TYPES = ['referral', 'email', 'sms', 'whatsapp', 'digital_ad', 'seo', 'sem', 'smm', 'print', 'other'];
export const EVENT_TYPES = ['webinar', 'seminar', 'workshop', 'conference', 'investor_meet', 'other'];
export const label = (value: string) => ({ email: 'Email', sms: 'SMS', seo: 'SEO', sem: 'SEM', smm: 'SMM', whatsapp: 'WhatsApp', digital_ad: 'Digital Ad', investor_meet: 'Investor Meet', other: 'Others' }[value] ?? value.replaceAll('_', ' ').replace(/\b\w/g, c => c.toUpperCase()));
export function trackedLink(destination: string, tags: Record<string, string>) {
  const url = new URL(destination);
  if (!['https:', 'http:'].includes(url.protocol)) throw new Error('Use an HTTP or HTTPS destination');
  for (const key of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']) {
    const value = tags[key]?.trim().toLowerCase();
    if (value) url.searchParams.set(key, value); else url.searchParams.delete(key);
  }
  if (!tags.utm_source?.trim() || !tags.utm_medium?.trim() || !tags.utm_campaign?.trim()) throw new Error('Source, medium and campaign are required');
  return url.toString();
}
export function canHandOff(lead: { qualification_status: string; contact_permission: string; assigned_to: string | null }) {
  return lead.qualification_status === 'qualified' && lead.contact_permission === 'permitted' && !!lead.assigned_to;
}