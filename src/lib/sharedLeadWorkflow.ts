export type ProspectLead = { name: string; phone: string; email: string | null; source: string; context: unknown };
export function leadProspect(lead: ProspectLead) {
  if (lead.source !== 'referral') return { name: lead.name, phone: lead.phone, email: lead.email };
  const context = lead.context && typeof lead.context === 'object' && !Array.isArray(lead.context) ? lead.context as Record<string, unknown> : {};
  const text = (key: string) => typeof context[key] === 'string' ? context[key] as string : '';
  return { name: text('referee_name'), phone: text('referee_phone'), email: text('referee_email') || null };
}
export function inSalesQueue(lead: { handoff_status: string; status: string }) {
  return ['ready', 'accepted'].includes(lead.handoff_status) && lead.status !== 'converted';
}
export function canAcceptLead(lead: { handoff_status: string; assigned_to: string | null }, userId: string, salesAccess: boolean, supervisor: boolean) {
  return lead.handoff_status === 'ready' && salesAccess && (lead.assigned_to === userId || supervisor);
}
export function qualificationSaveStage(stage: string) { return stage; }