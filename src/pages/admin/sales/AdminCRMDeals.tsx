import { SalesDealDialog } from '@/components/admin/SalesDealDialog';
import { RowActions } from '@/components/admin/RowActions';
import { readAllMISRows } from '@/lib/misRefresh';
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import {
  Plus, User, Phone, IndianRupee, ArrowRight, ShieldAlert, AlertTriangle,
  ChevronDown, Settings2, LayoutGrid, List, Search, Eye, Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Link } from '@/lib/router-compat';
import { ADMIN_ROUTES } from '@/lib/adminRoutes';
import { DealDetailDrawer } from '@/components/admin/DealDetailDrawer';
import { format } from 'date-fns';

// ---- Types ----
type PipelineSubStatus = {
  id: string; sub_status_key: string; sub_status_label: string;
  color_class: string; sort_order: number; is_active: boolean;
};
type PipelineStage = {
  id: string; stage_key: string; stage_label: string; stage_color: string;
  sort_order: number; is_active: boolean; pipeline_sub_statuses: PipelineSubStatus[];
};
type Deal = {
  id: string; title: string; stage: string; sub_status: string;
  deal_value: number; product_interest: string | null; probability: number;
  expected_close_date: string | null; created_at: string; contact_id: string | null;
  crm_contacts?: { full_name: string; phone: string | null } | null;
};

// ---- Hook: load pipeline config ----
function usePipelineConfig() {
  return useQuery({
    queryKey: ['sales-pipeline-active'],
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

function buildLookups(stages: PipelineStage[]) {
  const stageLabels: Record<string, string> = {};
  const stageColors: Record<string, string> = {};
  const subStatusLabels: Record<string, string> = {};
  const subStatusColors: Record<string, string> = {};
  for (const stage of stages) {
    stageLabels[stage.stage_key] = stage.stage_label;
    stageColors[stage.stage_key] = stage.stage_color;
    for (const ss of stage.pipeline_sub_statuses) {
      subStatusLabels[ss.sub_status_key] = ss.sub_status_label;
      subStatusColors[ss.sub_status_key] = ss.color_class;
    }
  }
  return { stageLabels, stageColors, subStatusLabels, subStatusColors };
}

// ---- Validation helper ----
async function validateTransition(dealId: string, toStage: string, toSubStatus: string) {
  const { data, error } = await supabase.rpc('validate_deal_transition', {
    _deal_id: dealId, _to_stage: toStage as any, _to_sub_status: toSubStatus as any,
  });
  if (error) throw error;
  return data as { allowed: boolean; errors: string[]; requires_approval: boolean };
}

async function executeTransition(deal: Deal, toStage: string, toSubStatus: string) {
  const validation = await validateTransition(deal.id, toStage, toSubStatus);
  if (!validation.allowed) return { success: false, errors: validation.errors, requires_approval: false };
  if (validation.requires_approval) return { success: false, errors: ['Approval is required; keep the current stage until an approval workflow is available'], requires_approval: true };

  const { error } = await supabase.from('crm_deals').update({
    stage: toStage as any, sub_status: toSubStatus as any,
  }).eq('id', deal.id);
  if (error) throw error;

  return { success: true, errors: [], requires_approval: false };
}

// ---- Deal Card (Kanban) ----
function DealCard({ deal, stages, subStatusLabels, subStatusColors, onMove, onSelect }: {
  deal: Deal; stages: PipelineStage[]; subStatusLabels: Record<string, string>;
  subStatusColors: Record<string, string>; onMove: () => void; onSelect: (id: string) => void;
}) {
  const stageIdx = stages.findIndex(s => s.stage_key === deal.stage);
  const currentStage = stages[stageIdx];
  const nextStage = stageIdx < stages.length - 1 ? stages[stageIdx + 1] : null;
  const [moving, setMoving] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const handleMove = async (toStage: string, toSubStatus: string) => {
    if (toStage === deal.stage && toSubStatus === deal.sub_status) return;
    setMoving(true); setValidationErrors([]);
    try {
      const result = await executeTransition(deal, toStage, toSubStatus);
      if (result.success) { toast.success(`Moved to ${subStatusLabels[toSubStatus] || toSubStatus}`); onMove(); }
      else { setValidationErrors(result.errors); toast.error(result.errors[0] || 'Transition blocked'); }
    } catch (e: any) { toast.error(e.message); } finally { setMoving(false); }
  };

  if (!currentStage) return null;

  return (
    <Card className="p-3 space-y-2 hover:shadow-md transition-shadow cursor-pointer" onClick={() => onSelect(deal.id)}>
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-sm font-medium leading-tight line-clamp-2">{deal.title}</h4>
        <Popover>
          <PopoverTrigger asChild>
            <button onClick={e => e.stopPropagation()} className={cn('inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded-full shrink-0 cursor-pointer hover:opacity-80', subStatusColors[deal.sub_status] || 'bg-muted text-muted-foreground')}>
              {subStatusLabels[deal.sub_status] || deal.sub_status}<ChevronDown className="h-2.5 w-2.5" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-40 p-1" align="end">
            <p className="text-[10px] font-medium text-muted-foreground px-2 py-1">Change sub-status</p>
            {currentStage.pipeline_sub_statuses.map(ss => (
              <button key={ss.sub_status_key} disabled={ss.sub_status_key === deal.sub_status || moving}
                onClick={e => { e.stopPropagation(); handleMove(deal.stage, ss.sub_status_key); }}
                className={cn('w-full text-left text-xs px-2 py-1.5 rounded hover:bg-accent disabled:opacity-40', ss.sub_status_key === deal.sub_status && 'font-semibold')}>
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
          <div className="flex items-center gap-1 text-destructive text-[10px] font-medium"><ShieldAlert className="h-3 w-3" /> Stage change blocked</div>
          {validationErrors.map((err, i) => (
            <p key={i} className="text-[10px] text-destructive/80 flex items-start gap-1"><AlertTriangle className="h-3 w-3 shrink-0 mt-0.5" /> {err}</p>
          ))}
        </div>
      )}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          {deal.deal_value > 0 && <><IndianRupee className="h-3 w-3" /> {Number(deal.deal_value).toLocaleString('en-IN')}</>}
          {deal.product_interest && <Badge variant="secondary" className="text-[10px] ml-1">{deal.product_interest}</Badge>}
        </div>
        {nextStage && (
          <Button variant="ghost" size="sm" className="h-6 px-1.5 text-[10px]" disabled={moving}
            onClick={e => { e.stopPropagation(); handleMove(nextStage.stage_key, nextStage.pipeline_sub_statuses[0]?.sub_status_key || ''); }}>
            <ArrowRight className="h-3 w-3 mr-0.5" /> {nextStage.stage_label}
          </Button>
        )}
      </div>
    </Card>
  );
}

// ======== MAIN COMPONENT: Unified Deals & Pipeline ========
export default function AdminCRMDeals() {
  const queryClient = useQueryClient();
  const [view, setView] = useState<'kanban' | 'list'>('kanban');
  const [selectedDealId, setSelectedDealId] = useState<string | null>(null);
  const [stageFilter, setStageFilter] = useState('all');
  const [search, setSearch] = useState('');

  const { data: stages = [], isLoading: stagesLoading, error: stagesError } = usePipelineConfig();
  const { stageLabels, stageColors, subStatusLabels, subStatusColors } = buildLookups(stages);

  const { data: deals = [], isLoading: dealsLoading, error: dealsError } = useQuery({
    queryKey: ['crm-deals'],
    queryFn: async () => {
      return await readAllMISRows((from, to) => supabase.from('crm_deals').select('*, crm_contacts(full_name, phone)').order('created_at', { ascending: false }).order('id').range(from, to)) as Deal[];
    },
  });

  const refresh = () => queryClient.invalidateQueries({ queryKey: ['crm-deals'] });
  const isLoading = stagesLoading || dealsLoading;

  // Filtered deals for list view
  const filteredDeals = deals.filter(d => {
    if (stageFilter !== 'all' && d.stage !== stageFilter) return false;
    if (search) {
      const s = search.toLowerCase();
      return d.title.toLowerCase().includes(s) || (d.crm_contacts?.full_name || '').toLowerCase().includes(s);
    }
    return true;
  });

  const totalValue = deals.reduce((s, d) => s + Number(d.deal_value || 0), 0);
  const stageLabel = stages.map(s => s.stage_label).join(' → ');

  const stageCounts = stages.map(s => ({
    ...s,
    deals: filteredDeals.filter(d => d.stage === s.stage_key),
    totalValue: filteredDeals.filter(d => d.stage === s.stage_key).reduce((sum, d) => sum + Number(d.deal_value || 0), 0),
  }));

  return (
    <AdminGuard>
      <AdminLayout title="Deals & Pipeline" subtitle={stageLabel}>
        {/* Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span>{deals.length} deals</span>
            <span>₹{totalValue.toLocaleString('en-IN')} total</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {/* View Toggle */}
            <div className="flex items-center rounded-lg border border-border p-0.5">
              <Button variant="ghost" size="sm" onClick={() => setView('kanban')}
                className={cn('flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-colors',
                  view === 'kanban' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground')}>
                <LayoutGrid className="h-3.5 w-3.5" /> Kanban
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setView('list')}
                className={cn('flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium transition-colors',
                  view === 'list' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground')}>
                <List className="h-3.5 w-3.5" /> List
              </Button>
            </div>
            <Link to={ADMIN_ROUTES.sales.pipelineConfig}>
              <Button variant="outline" size="sm"><Settings2 className="h-4 w-4 mr-1" /> Configure</Button>
            </Link>
            <SalesDealDialog onCreated={refresh} />
          </div>
        </div>

        {/* List-view filters */}
        {(
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <div className="relative flex-1 min-w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search deals or contacts..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
            </div>
            <Select value={stageFilter} onValueChange={setStageFilter}>
              <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stages</SelectItem>
                {stages.map(s => <SelectItem key={s.stage_key} value={s.stage_key}>{s.stage_label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        )}

        {(stagesError || dealsError) && <p role="alert" className="text-destructive mb-4">Opportunities or pipeline settings could not be loaded.</p>}
        {isLoading ? (
          <div className="flex items-center justify-center h-40 text-muted-foreground"><Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading…</div>
        ) : view === 'kanban' ? (
          /* ===== KANBAN VIEW ===== */
          <div className={cn('grid gap-4 min-h-[60vh]', 'grid-cols-1 md:grid-cols-2 xl:grid-cols-4')}>
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
                  {stage.deals.length === 0 && <p className="text-xs text-muted-foreground text-center py-8">No deals</p>}
                  {stage.deals.map(deal => (
                    <DealCard key={deal.id} deal={deal} stages={stages} subStatusLabels={subStatusLabels}
                      subStatusColors={subStatusColors} onMove={refresh} onSelect={setSelectedDealId} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* ===== LIST VIEW ===== */
          <div className="rounded-lg border border-border overflow-x-auto">
            <Table className="min-w-[800px]">
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Stage</TableHead>
                  <TableHead>Sub-Status</TableHead>
                  <TableHead>Value (₹)</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-[70px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDeals.map(deal => (
                  <TableRow key={deal.id} className="cursor-pointer hover:bg-muted/30" onClick={() => setSelectedDealId(deal.id)}>
                    <TableCell className="font-medium">{deal.title}</TableCell>
                    <TableCell>{deal.crm_contacts?.full_name || '—'}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="gap-1">
                        <span className={cn('w-2 h-2 rounded-full inline-block', stageColors[deal.stage] || 'bg-muted')} />
                        {stageLabels[deal.stage] || deal.stage}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={cn('text-[10px]', subStatusColors[deal.sub_status] || 'bg-muted text-muted-foreground')}>
                        {subStatusLabels[deal.sub_status] || deal.sub_status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="flex items-center gap-0.5 text-sm"><IndianRupee className="h-3 w-3" />{Number(deal.deal_value || 0).toLocaleString('en-IN')}</span>
                    </TableCell>
                    <TableCell>{deal.product_interest || '—'}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{format(new Date(deal.created_at), 'dd MMM yyyy')}</TableCell>
                    <TableCell>
                      <div onClick={e => e.stopPropagation()}><RowActions actions={[{label:'View',onClick:()=>setSelectedDealId(deal.id)}]} /></div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredDeals.length === 0 && (
                  <TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">No deals found</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}

        <DealDetailDrawer dealId={selectedDealId} open={!!selectedDealId} onClose={() => setSelectedDealId(null)} />
      </AdminLayout>
    </AdminGuard>
  );
}
