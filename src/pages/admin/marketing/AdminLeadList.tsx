import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { readAllMISRows } from '@/lib/misRefresh';
import { attributionLabel } from '@/lib/leadAttribution';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { LeadDetailDrawer } from '@/components/admin/LeadDetailDrawer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Eye, RefreshCw } from 'lucide-react';
export default function AdminLeadList() {
  const [search,setSearch]=useState(''); const [stage,setStage]=useState('all'); const [leadId,setLeadId]=useState<string|null>(null);
  const {data:leads=[],error,isLoading,refetch}=useQuery({queryKey:['leads','marketing'],queryFn:()=>readAllMISRows((f,t)=>supabase.from('leads').select('*').order('created_at',{ascending:false}).order('id').range(f,t))});
  const rows=leads.filter(l=>(stage==='all'||l.handoff_status===stage)&&[l.name,l.phone,l.email??'',attributionLabel(l.context).campaign??''].join(' ').toLowerCase().includes(search.toLowerCase()));
  return <AdminLayout title="Marketing Leads" actions={<Button variant="outline" size="icon" aria-label="Refresh leads" onClick={()=>refetch()}><RefreshCw className="h-4 w-4" /></Button>}>
    <div className="flex flex-wrap gap-3 mb-5"><Input aria-label="Search leads" placeholder="Name, phone, email or campaign" value={search} onChange={e=>setSearch(e.target.value)} className="max-w-sm" /><Select value={stage} onValueChange={setStage}><SelectTrigger className="w-48"><SelectValue /></SelectTrigger><SelectContent>{['all','marketing','ready','accepted','returned'].map(v=><SelectItem key={v} value={v}>{v==='all'?'All handoffs':v}</SelectItem>)}</SelectContent></Select></div>
    {error && <p role="alert" className="text-destructive">Could not load leads.</p>}{isLoading && <p>Loading…</p>}
    <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b border-border text-left">{['Name','Interest','Source / campaign','Qualification','Handoff','Details'].map(h=><th className="py-3 pr-4" key={h}>{h}</th>)}</tr></thead><tbody>{rows.map(l=><tr key={l.id} className="border-b border-border"><td className="py-3 pr-4"><p className="font-medium">{l.name}</p><p className="text-xs text-muted-foreground">{l.phone}</p></td><td className="pr-4">{l.lead_type.replaceAll('_',' ')}</td><td className="pr-4">{attributionLabel(l.context).campaign ?? attributionLabel(l.context).channel}</td><td className="pr-4">{l.qualification_status.replaceAll('_',' ')}</td><td><Badge variant="outline">{l.handoff_status}</Badge></td><td><Button variant="ghost" size="icon" aria-label="View lead details" onClick={()=>setLeadId(l.id)}><Eye className="h-4 w-4" /></Button></td></tr>)}</tbody></table></div>
    <LeadDetailDrawer leadId={leadId} leadType="web" open={!!leadId} onClose={()=>setLeadId(null)} />
  </AdminLayout>;
}