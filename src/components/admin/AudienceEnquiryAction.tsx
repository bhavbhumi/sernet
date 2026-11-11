import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { LeadDetailDrawer } from './LeadDetailDrawer';
import { toast } from 'sonner';
export function AudienceEnquiryAction({ kind, id, leadId, phone = '' }: { kind: 'event' | 'newsletter'; id: string; leadId?: string | null; phone?: string }) {
  const client = useQueryClient();
  const [open, setOpen] = useState(false);
  const [viewId, setViewId] = useState<string | null>(null);
  const [form, setForm] = useState({ interest: '', evidence: '', phone });
  const [saving, setSaving] = useState(false);
  async function save() {
    if (form.interest.trim().length < 3 || form.evidence.trim().length < 10 || !form.phone.trim()) { toast.error('Record the enquiry, phone and explicit contact permission'); return; }
    setSaving(true);
    try {
      const { data, error } = await supabase.rpc('create_audience_enquiry', { _kind: kind, _id: id, _interest: form.interest.trim(), _evidence: form.evidence.trim(), _phone: form.phone.trim() });
      if (error) throw error;
      await Promise.all(['leads', 'event-registrations', 'newsletter_subscribers', 'marketing-action-needed', 'admin-dashboard-stats'].map(key => client.invalidateQueries({ queryKey: [key] })));
      setOpen(false); setViewId(data); toast.success('Enquiry saved for Marketing qualification');
    } catch (error) { toast.error(error instanceof Error ? error.message : 'Could not create enquiry'); } finally { setSaving(false); }
  }
  return <><Button size="sm" variant="outline" onClick={() => leadId ? setViewId(leadId) : setOpen(true)}>{leadId ? 'View enquiry' : 'Create enquiry'}</Button>
    <Dialog open={open} onOpenChange={setOpen}><DialogContent className="sm:max-w-md"><DialogHeader><DialogTitle>Create enquiry</DialogTitle></DialogHeader>
      <Label htmlFor={`audience-phone-${id}`}>Phone</Label><Input id={`audience-phone-${id}`} maxLength={40} value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
      <Label htmlFor={`audience-interest-${id}`}>Requested product / service</Label><Textarea id={`audience-interest-${id}`} maxLength={1000} value={form.interest} onChange={e => setForm(f => ({ ...f, interest: e.target.value }))} />
      <Label htmlFor={`audience-evidence-${id}`}>Explicit Sales contact permission — source, date and channels</Label><Textarea id={`audience-evidence-${id}`} maxLength={2000} value={form.evidence} onChange={e => setForm(f => ({ ...f, evidence: e.target.value }))} />
      <Button disabled={saving} onClick={save}>{saving ? 'Saving…' : 'Save enquiry'}</Button>
    </DialogContent></Dialog><LeadDetailDrawer leadId={viewId} leadType="web" open={!!viewId} onClose={() => setViewId(null)} /></>;
}