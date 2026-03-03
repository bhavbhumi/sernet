import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminGuard } from '@/components/admin/AdminGuard';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Plus, ChevronRight, User, Phone, IndianRupee, Calendar, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

const STAGES = [
  { key: 'enquiry', label: 'Enquiry', color: 'bg-blue-500', subStatuses: ['contacted', 'not_reachable', 'not_interested', 'dnd'] },
  { key: 'qualified', label: 'Qualified', color: 'bg-amber-500', subStatuses: ['cold', 'warm', 'hot'] },
  { key: 'account', label: 'Account', color: 'bg-purple-500', subStatuses: ['documentation', 'kyc', 'profile', 'mandate'] },
  { key: 'status', label: 'Status', color: 'bg-emerald-500', subStatuses: ['active', 'dormant'] },
] as const;

const SUB_STATUS_LABELS: Record<string, string> = {
  contacted: 'Contacted', not_reachable: 'Not Reachable', not_interested: 'Not Interested', dnd: 'DND',
  cold: 'Cold', warm: 'Warm', hot: 'Hot',
  documentation: 'Documentation', kyc: 'KYC', profile: 'Profile', mandate: 'Mandate',
  active: 'Active', dormant: 'Dormant',
};

const SUB_STATUS_COLORS: Record<string, string> = {
  contacted: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  not_reachable: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  not_interested: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  dnd: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
  cold: 'bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200',
  warm: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  hot: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  documentation: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
  kyc: 'bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200',
  profile: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  mandate: 'bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900 dark:text-fuchsia-200',
  active: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
  dormant: 'bg-stone-100 text-stone-800 dark:bg-stone-900 dark:text-stone-200',
};

type Deal = {
  id: string;
  title: string;
  stage: string;
  sub_status: string;
  deal_value: number;
  product_interest: string | null;
  probability: number;
  expected_close_date: string | null;
  created_at: string;
  contact_id: string | null;
  crm_contacts?: { full_name: string; phone: string | null } | null;
};

function NewDealDialog({ onCreated }: { onCreated: () => void }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: '', stage: 'enquiry' as string, sub_status: 'contacted' as string,
    deal_value: '', product_interest: '', contact_name: '', contact_phone: '', contact_email: '',
  });
  const [saving, setSaving] = useState(false);

  const currentStage = STAGES.find(s => s.key === form.stage);

  const handleSave = async () => {
    if (!form.title.trim()) { toast.error('Title is required'); return; }
    setSaving(true);
    try {
      let contactId: string | null = null;
      if (form.contact_name.trim()) {
        const { data: contact, error: cErr } = await supabase.from('crm_contacts').insert({
          full_name: form.contact_name, phone: form.contact_phone || null, email: form.contact_email || null,
        }).select('id').single();
        if (cErr) throw cErr;
        contactId = contact.id;
      }

      const { error } = await supabase.from('crm_deals').insert({
        title: form.title,
        stage: form.stage as any,
        sub_status: form.sub_status as any,
        deal_value: form.deal_value ? parseFloat(form.deal_value) : 0,
        product_interest: form.product_interest || null,
        contact_id: contactId,
      });
      if (error) throw error;
      toast.success('Deal created');
      setOpen(false);
      setForm({ title: '', stage: 'enquiry', sub_status: 'contacted', deal_value: '', product_interest: '', contact_name: '', contact_phone: '', contact_email: '' });
      onCreated();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm"><Plus className="h-4 w-4 mr-1" /> New Deal</Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>Create New Deal</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Deal Title *</Label>
            <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. MF SIP - Rajesh Patel" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Stage</Label>
              <Select value={form.stage} onValueChange={v => {
                const stg = STAGES.find(s => s.key === v)!;
                setForm(f => ({ ...f, stage: v, sub_status: stg.subStatuses[0] }));
              }}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{STAGES.map(s => <SelectItem key={s.key} value={s.key}>{s.label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Sub-Status</Label>
              <Select value={form.sub_status} onValueChange={v => setForm(f => ({ ...f, sub_status: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{currentStage?.subStatuses.map(ss => <SelectItem key={ss} value={ss}>{SUB_STATUS_LABELS[ss]}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Deal Value (₹)</Label>
              <Input type="number" value={form.deal_value} onChange={e => setForm(f => ({ ...f, deal_value: e.target.value }))} placeholder="0" />
            </div>
            <div>
              <Label>Product Interest</Label>
              <Select value={form.product_interest} onValueChange={v => setForm(f => ({ ...f, product_interest: v }))}>
                <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                <SelectContent>
                  {['Mutual Funds', 'Insurance', 'Trading', 'PMS', 'AIF', 'Bonds', 'FD', 'Other'].map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="border-t pt-3 space-y-3">
            <p className="text-xs font-medium text-muted-foreground">Contact (optional)</p>
            <Input value={form.contact_name} onChange={e => setForm(f => ({ ...f, contact_name: e.target.value }))} placeholder="Full Name" />
            <div className="grid grid-cols-2 gap-3">
              <Input value={form.contact_phone} onChange={e => setForm(f => ({ ...f, contact_phone: e.target.value }))} placeholder="Phone" />
              <Input value={form.contact_email} onChange={e => setForm(f => ({ ...f, contact_email: e.target.value }))} placeholder="Email" />
            </div>
          </div>
          <Button onClick={handleSave} disabled={saving} className="w-full">{saving ? 'Saving...' : 'Create Deal'}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function DealCard({ deal, onMove }: { deal: Deal; onMove: () => void }) {
  const queryClient = useQueryClient();
  const stageIdx = STAGES.findIndex(s => s.key === deal.stage);
  const nextStage = stageIdx < STAGES.length - 1 ? STAGES[stageIdx + 1] : null;

  const moveToNext = async () => {
    if (!nextStage) return;
    const newSub = nextStage.subStatuses[0];
    const { error } = await supabase.from('crm_deals').update({
      stage: nextStage.key as any, sub_status: newSub as any,
    }).eq('id', deal.id);
    if (error) { toast.error(error.message); return; }

    await supabase.from('crm_stage_history').insert({
      deal_id: deal.id,
      from_stage: deal.stage as any,
      from_sub_status: deal.sub_status as any,
      to_stage: nextStage.key as any,
      to_sub_status: newSub as any,
    });
    toast.success(`Moved to ${nextStage.label}`);
    onMove();
  };

  return (
    <Card className="p-3 space-y-2 hover:shadow-md transition-shadow cursor-pointer">
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-sm font-medium leading-tight line-clamp-2">{deal.title}</h4>
        <Badge variant="outline" className={cn('text-[10px] shrink-0', SUB_STATUS_COLORS[deal.sub_status])}>
          {SUB_STATUS_LABELS[deal.sub_status] || deal.sub_status}
        </Badge>
      </div>
      {deal.crm_contacts && (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <User className="h-3 w-3" /> {deal.crm_contacts.full_name}
          {deal.crm_contacts.phone && <><Phone className="h-3 w-3 ml-2" /> {deal.crm_contacts.phone}</>}
        </div>
      )}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          {deal.deal_value > 0 && <><IndianRupee className="h-3 w-3" /> {Number(deal.deal_value).toLocaleString('en-IN')}</>}
          {deal.product_interest && <Badge variant="secondary" className="text-[10px] ml-1">{deal.product_interest}</Badge>}
        </div>
        {nextStage && (
          <Button variant="ghost" size="sm" className="h-6 px-1.5 text-[10px]" onClick={e => { e.stopPropagation(); moveToNext(); }}>
            <ArrowRight className="h-3 w-3 mr-0.5" /> {nextStage.label}
          </Button>
        )}
      </div>
    </Card>
  );
}

export default function AdminCRMPipeline() {
  const queryClient = useQueryClient();

  const { data: deals = [], isLoading } = useQuery({
    queryKey: ['crm-deals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('crm_deals')
        .select('*, crm_contacts(full_name, phone)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Deal[];
    },
  });

  const refresh = () => queryClient.invalidateQueries({ queryKey: ['crm-deals'] });

  const stageCounts = STAGES.map(s => ({
    ...s,
    deals: deals.filter(d => d.stage === s.key),
    totalValue: deals.filter(d => d.stage === s.key).reduce((sum, d) => sum + Number(d.deal_value || 0), 0),
  }));

  return (
    <AdminGuard>
      <AdminLayout title="CRM Pipeline" subtitle="Visual deal pipeline — Enquiry → Qualified → Account → Status">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span>{deals.length} deals</span>
            <span>₹{deals.reduce((s, d) => s + Number(d.deal_value || 0), 0).toLocaleString('en-IN')} total value</span>
          </div>
          <NewDealDialog onCreated={refresh} />
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 min-h-[60vh]">
          {stageCounts.map(stage => (
            <div key={stage.key} className="flex flex-col">
              <div className="flex items-center gap-2 mb-3 px-1">
                <div className={cn('w-2.5 h-2.5 rounded-full', stage.color)} />
                <h3 className="text-sm font-semibold">{stage.label}</h3>
                <Badge variant="secondary" className="text-xs">{stage.deals.length}</Badge>
                {stage.totalValue > 0 && (
                  <span className="text-xs text-muted-foreground ml-auto">₹{stage.totalValue.toLocaleString('en-IN')}</span>
                )}
              </div>
              <div className="flex-1 bg-muted/30 rounded-lg p-2 space-y-2 min-h-[200px]">
                {stage.deals.length === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-8">No deals</p>
                )}
                {stage.deals.map(deal => (
                  <DealCard key={deal.id} deal={deal} onMove={refresh} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </AdminLayout>
    </AdminGuard>
  );
}
