import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminGuard } from '@/components/admin/AdminGuard';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Plus, User, Phone, IndianRupee, ArrowRight, ShieldAlert, AlertTriangle, ChevronDown, Settings2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Link } from 'react-router-dom';
import { ADMIN_ROUTES } from '@/lib/adminRoutes';
import { DealDetailDrawer } from '@/components/admin/DealDetailDrawer';

// ---- Types ----
type PipelineSubStatus = {
  id: string;
  sub_status_key: string;
  sub_status_label: string;
  color_class: string;
  sort_order: number;
  is_active: boolean;
};

type PipelineStage = {
  id: string;
  stage_key: string;
  stage_label: string;
  stage_color: string;
  sort_order: number;
  is_active: boolean;
  pipeline_sub_statuses: PipelineSubStatus[];
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

// ---- Hook: load pipeline config ----
function usePipelineConfig() {
  return useQuery({
    queryKey: ['pipeline-config'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pipeline_stages')
        .select('*, pipeline_sub_statuses(*)')
        .eq('pipeline_key', 'default')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });
      if (error) throw error;
      return (data as PipelineStage[]).map(s => ({
        ...s,
        pipeline_sub_statuses: (s.pipeline_sub_statuses || [])
          .filter((ss: PipelineSubStatus) => ss.is_active)
          .sort((a: PipelineSubStatus, b: PipelineSubStatus) => a.sort_order - b.sort_order),
      }));
    },
    staleTime: 60_000,
  });
}

// Build lookup maps from config
function buildLookups(stages: PipelineStage[]) {
  const subStatusLabels: Record<string, string> = {};
  const subStatusColors: Record<string, string> = {};
  for (const stage of stages) {
    for (const ss of stage.pipeline_sub_statuses) {
      subStatusLabels[ss.sub_status_key] = ss.sub_status_label;
      subStatusColors[ss.sub_status_key] = ss.color_class;
    }
  }
  return { subStatusLabels, subStatusColors };
}

// ---- Validation helper ----
async function validateTransition(dealId: string, toStage: string, toSubStatus: string) {
  const { data, error } = await supabase.rpc('validate_deal_transition', {
    _deal_id: dealId,
    _to_stage: toStage as any,
    _to_sub_status: toSubStatus as any,
  });
  if (error) throw error;
  return data as { allowed: boolean; errors: string[]; requires_approval: boolean };
}

async function executeTransition(deal: Deal, toStage: string, toSubStatus: string) {
  const validation = await validateTransition(deal.id, toStage, toSubStatus);
  if (!validation.allowed) {
    return { success: false, errors: validation.errors, requires_approval: false };
  }
  if (validation.requires_approval) {
    return { success: false, errors: ['This transition requires approval (not yet implemented)'], requires_approval: true };
  }

  const { error } = await supabase.from('crm_deals').update({
    stage: toStage as any,
    sub_status: toSubStatus as any,
  }).eq('id', deal.id);
  if (error) throw error;

  await supabase.from('crm_stage_history').insert({
    deal_id: deal.id,
    from_stage: deal.stage as any,
    from_sub_status: deal.sub_status as any,
    to_stage: toStage as any,
    to_sub_status: toSubStatus as any,
  });

  return { success: true, errors: [], requires_approval: false };
}

// ---- New Deal Dialog ----
function NewDealDialog({ stages, onCreated }: { stages: PipelineStage[]; onCreated: () => void }) {
  const [open, setOpen] = useState(false);
  const firstStage = stages[0];
  const [form, setForm] = useState({
    title: '', stage: firstStage?.stage_key || '',
    sub_status: firstStage?.pipeline_sub_statuses[0]?.sub_status_key || '',
    deal_value: '', product_interest: '', contact_name: '', contact_phone: '', contact_email: '',
  });
  const [saving, setSaving] = useState(false);

  const currentStage = stages.find(s => s.stage_key === form.stage);

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
      setForm({
        title: '', stage: firstStage?.stage_key || '',
        sub_status: firstStage?.pipeline_sub_statuses[0]?.sub_status_key || '',
        deal_value: '', product_interest: '', contact_name: '', contact_phone: '', contact_email: '',
      });
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
                const stg = stages.find(s => s.stage_key === v)!;
                setForm(f => ({ ...f, stage: v, sub_status: stg.pipeline_sub_statuses[0]?.sub_status_key || '' }));
              }}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{stages.map(s => <SelectItem key={s.stage_key} value={s.stage_key}>{s.stage_label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Sub-Status</Label>
              <Select value={form.sub_status} onValueChange={v => setForm(f => ({ ...f, sub_status: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{currentStage?.pipeline_sub_statuses.map(ss => <SelectItem key={ss.sub_status_key} value={ss.sub_status_key}>{ss.sub_status_label}</SelectItem>)}</SelectContent>
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

// ---- Deal Card with Blueprint Enforcement ----
function DealCard({ deal, stages, subStatusLabels, subStatusColors, onMove, onSelect }: {
  deal: Deal;
  stages: PipelineStage[];
  subStatusLabels: Record<string, string>;
  subStatusColors: Record<string, string>;
  onMove: () => void;
  onSelect: (id: string) => void;
}) {
  const stageIdx = stages.findIndex(s => s.stage_key === deal.stage);
  const currentStage = stages[stageIdx];
  const nextStage = stageIdx < stages.length - 1 ? stages[stageIdx + 1] : null;
  const [moving, setMoving] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const handleMove = async (toStage: string, toSubStatus: string) => {
    if (toStage === deal.stage && toSubStatus === deal.sub_status) return;
    setMoving(true);
    setValidationErrors([]);
    try {
      const result = await executeTransition(deal, toStage, toSubStatus);
      if (result.success) {
        toast.success(`Moved to ${subStatusLabels[toSubStatus] || toSubStatus}`);
        onMove();
      } else {
        setValidationErrors(result.errors);
        toast.error(result.errors[0] || 'Transition blocked');
      }
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setMoving(false);
    }
  };

  if (!currentStage) return null;

  return (
    <Card className="p-3 space-y-2 hover:shadow-md transition-shadow cursor-pointer" onClick={() => onSelect(deal.id)}>
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-sm font-medium leading-tight line-clamp-2">{deal.title}</h4>
        <Popover>
          <PopoverTrigger asChild>
            <button className={cn('inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded-full shrink-0 cursor-pointer hover:opacity-80', subStatusColors[deal.sub_status] || 'bg-muted text-muted-foreground')}>
              {subStatusLabels[deal.sub_status] || deal.sub_status}
              <ChevronDown className="h-2.5 w-2.5" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-40 p-1" align="end">
            <p className="text-[10px] font-medium text-muted-foreground px-2 py-1">Change sub-status</p>
            {currentStage.pipeline_sub_statuses.map(ss => (
              <button
                key={ss.sub_status_key}
                disabled={ss.sub_status_key === deal.sub_status || moving}
                onClick={() => handleMove(deal.stage, ss.sub_status_key)}
                className={cn(
                  'w-full text-left text-xs px-2 py-1.5 rounded hover:bg-accent disabled:opacity-40',
                  ss.sub_status_key === deal.sub_status && 'font-semibold'
                )}
              >
                {ss.sub_status_label}
              </button>
            ))}
          </PopoverContent>
        </Popover>
      </div>

      {deal.crm_contacts && (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <User className="h-3 w-3" /> {deal.crm_contacts.full_name}
          {deal.crm_contacts.phone && <><Phone className="h-3 w-3 ml-2" /> {deal.crm_contacts.phone}</>}
        </div>
      )}

      {validationErrors.length > 0 && (
        <div className="bg-destructive/10 border border-destructive/20 rounded p-2 space-y-1">
          <div className="flex items-center gap-1 text-destructive text-[10px] font-medium">
            <ShieldAlert className="h-3 w-3" /> Blueprint blocked
          </div>
          {validationErrors.map((err, i) => (
            <p key={i} className="text-[10px] text-destructive/80 flex items-start gap-1">
              <AlertTriangle className="h-3 w-3 shrink-0 mt-0.5" /> {err}
            </p>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          {deal.deal_value > 0 && <><IndianRupee className="h-3 w-3" /> {Number(deal.deal_value).toLocaleString('en-IN')}</>}
          {deal.product_interest && <Badge variant="secondary" className="text-[10px] ml-1">{deal.product_interest}</Badge>}
        </div>
        {nextStage && (
          <Button
            variant="ghost" size="sm"
            className="h-6 px-1.5 text-[10px]"
            disabled={moving}
            onClick={e => { e.stopPropagation(); handleMove(nextStage.stage_key, nextStage.pipeline_sub_statuses[0]?.sub_status_key || ''); }}
          >
            <ArrowRight className="h-3 w-3 mr-0.5" /> {nextStage.stage_label}
          </Button>
        )}
      </div>
    </Card>
  );
}

// ---- Main Pipeline ----
export default function AdminCRMPipeline() {
  const queryClient = useQueryClient();
  const [selectedDealId, setSelectedDealId] = useState<string | null>(null);
  const { data: stages = [], isLoading: stagesLoading } = usePipelineConfig();
  const { subStatusLabels, subStatusColors } = buildLookups(stages);

  const { data: deals = [], isLoading: dealsLoading } = useQuery({
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

  const isLoading = stagesLoading || dealsLoading;

  const stageLabel = stages.map(s => s.stage_label).join(' → ');

  const stageCounts = stages.map(s => ({
    ...s,
    deals: deals.filter(d => d.stage === s.stage_key),
    totalValue: deals.filter(d => d.stage === s.stage_key).reduce((sum, d) => sum + Number(d.deal_value || 0), 0),
  }));

  return (
    <AdminGuard>
      <AdminLayout title="CRM Pipeline" subtitle={`Blueprint-enforced pipeline — ${stageLabel}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span>{deals.length} deals</span>
            <span>₹{deals.reduce((s, d) => s + Number(d.deal_value || 0), 0).toLocaleString('en-IN')} total value</span>
          </div>
          <div className="flex items-center gap-2">
            <Link to={ADMIN_ROUTES.sales.pipelineConfig}>
              <Button variant="outline" size="sm"><Settings2 className="h-4 w-4 mr-1" /> Configure</Button>
            </Link>
            <NewDealDialog stages={stages} onCreated={refresh} />
          </div>
        </div>

        {/* Kanban Board */}
        <div className={cn('grid gap-4 min-h-[60vh]', `grid-cols-1 md:grid-cols-2 xl:grid-cols-${Math.min(stages.length, 6)}`)}>
          {stageCounts.map(stage => (
            <div key={stage.stage_key} className="flex flex-col">
              <div className="flex items-center gap-2 mb-3 px-1">
                <div className={cn('w-2.5 h-2.5 rounded-full', stage.stage_color)} />
                <h3 className="text-sm font-semibold">{stage.stage_label}</h3>
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
                  <DealCard
                    key={deal.id}
                    deal={deal}
                    stages={stages}
                    subStatusLabels={subStatusLabels}
                    subStatusColors={subStatusColors}
                    onMove={refresh}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </AdminLayout>
    </AdminGuard>
  );
}
