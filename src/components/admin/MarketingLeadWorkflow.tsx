import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { readAllMISRows } from '@/lib/misRefresh';
import { canAcceptLead, qualificationSaveStage } from '@/lib/sharedLeadWorkflow';
import { useAdminSession } from './AdminGuard';
import { canHandOff } from '@/lib/marketingWorkflow';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import type { Database } from '@/integrations/supabase/types';
type Lead = Database['public']['Tables']['leads']['Row'];
function permissionEvidence(lead: Lead) {
  const context = lead.context as Record<string, unknown> | null;
  return typeof context?.contact_permission_evidence === 'string' ? context.contact_permission_evidence : '';
}
export function MarketingLeadWorkflow({ lead }: { lead: Lead }) {
  const client = useQueryClient();
  const { session } = useAdminSession();
  const { data: salesAccess = false } = useQuery({ queryKey: ['sales-workflow-access', session?.userId], queryFn: async () => { const {data,error} = await supabase.rpc('can_work_leads', { _module: 'sales/crm' }); if(error) throw error; return data; } });
  const supervisor = session?.role === 'super_admin' || (session?.role === 'admin' && (!session.department || session.department === 'sales'));
  const canAccept = !!session && canAcceptLead(lead, session.userId, salesAccess, supervisor);
  const [form,setForm] = useState({qualification_status:lead.qualification_status,contact_permission:lead.contact_permission,assigned_to:lead.assigned_to,notes:lead.notes ?? '',permission_evidence:permissionEvidence(lead)});
  const [saving,setSaving] = useState(false);
  useEffect(()=>setForm({qualification_status:lead.qualification_status,contact_permission:lead.contact_permission,assigned_to:lead.assigned_to,notes:lead.notes ?? '',permission_evidence:permissionEvidence(lead)}),[lead]);
  const {data:owners=[],error} = useQuery({queryKey:['marketing-sales-owners'],queryFn: async()=>{
    const roles = await readAllMISRows((f,t)=>supabase.from('user_roles').select('user_id,role,department').order('id').range(f,t));
    if (!roles.length) return [];
    const employees = await readAllMISRows((f,t)=>supabase.from('employees').select('user_id,full_name,email').not('user_id','is',null).order('id').range(f,t));
    return roles.filter(r=>r.department==='sales'||r.role==='super_admin').map(r=>{const employee=employees.find(e=>e.user_id===r.user_id);return {id:r.user_id,full_name:employee?.full_name || (r.role==='super_admin'?'Administrator':'Sales staff'),email:employee?.email};});
  }});
  async function save(handoff: string) {
    if (form.contact_permission === 'permitted' && !form.permission_evidence.trim()) { toast.error('Record how and when the client gave contact permission'); return; }
    if (['ready','accepted'].includes(handoff) && !canHandOff(form)) {toast.error('Qualification, contact permission and an owner are required');return;}
    setSaving(true);
    try {
      const {permission_evidence, ...fields} = form;
      const context = lead.context && typeof lead.context === 'object' && !Array.isArray(lead.context) ? lead.context : {};
      const {error} = await supabase.from('leads').update({...fields,context:{...context,contact_permission_evidence:permission_evidence.trim()},notes:form.notes || null,handoff_status:handoff,handoff_at:handoff==='ready' ? new Date().toISOString() : lead.handoff_at}).eq('id',lead.id);
      if(error) throw error;
      await Promise.all(['leads','lead-detail','marketing-leads-overview','admin-dashboard-stats'].map(key=>client.invalidateQueries({queryKey:[key]}))); toast.success('Lead updated');
    } catch(e) {toast.error(e instanceof Error ? e.message : 'Could not update lead');} finally {setSaving(false);}
  }
  return <section className="border-t border-border pt-4 space-y-3"><h3 className="font-medium text-sm">Qualification & Sales handoff</h3>
    <div className="grid grid-cols-2 gap-3"><div><Label>Qualification</Label><Select value={form.qualification_status} onValueChange={v=>setForm(f=>({...f,qualification_status:v}))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{['unreviewed','qualified','not_suitable','duplicate','spam','support_request'].map(v=><SelectItem key={v} value={v}>{v.replaceAll('_',' ')}</SelectItem>)}</SelectContent></Select></div>
    <div><Label>Contact permission</Label><Select value={form.contact_permission} onValueChange={v=>setForm(f=>({...f,contact_permission:v}))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{['unconfirmed','permitted','declined'].map(v=><SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent></Select></div></div>
    <Label>Sales owner</Label><Select value={form.assigned_to ?? 'none'} onValueChange={v=>setForm(f=>({...f,assigned_to:v==='none'?null:v}))}><SelectTrigger><SelectValue placeholder="Select owner" /></SelectTrigger><SelectContent><SelectItem value="none">Unassigned</SelectItem>{owners.map(o=><SelectItem key={o.id} value={o.id}>{o.full_name || o.email || o.id}</SelectItem>)}</SelectContent></Select>
    {error && <p role="alert" className="text-destructive text-xs">Could not load owners.</p>}
    <Label htmlFor="permission-evidence">Contact permission evidence</Label><Textarea id="permission-evidence" placeholder="Permission source, date and contact channels agreed" value={form.permission_evidence} onChange={e=>setForm(f=>({...f,permission_evidence:e.target.value}))} />
    <Label htmlFor="lead-notes">Notes</Label><Textarea id="lead-notes" value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))} />
    <p className="text-xs text-muted-foreground">Handoff: {lead.handoff_status}</p><div className="flex flex-wrap gap-2"><Button size="sm" variant="outline" disabled={saving} onClick={()=>save(qualificationSaveStage(lead.handoff_status))}>Save qualification</Button><Button size="sm" disabled={saving || !canHandOff(form) || ['ready','accepted'].includes(lead.handoff_status)} onClick={()=>save('ready')}>Hand off to Sales</Button>{canAccept && <Button size="sm" disabled={saving} onClick={()=>save('accepted')}>Accept handoff</Button>}{['ready','accepted'].includes(lead.handoff_status) && <Button size="sm" variant="outline" disabled={saving} onClick={()=>save('returned')}>Return to Marketing</Button>}</div>
  </section>;
}