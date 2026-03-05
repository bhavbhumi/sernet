import { AdminGuard } from '@/components/admin/AdminGuard';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { ADMIN_ROUTES } from '@/lib/adminRoutes';
import { DealDetailDrawer } from '@/components/admin/DealDetailDrawer';
import { Search, Eye, IndianRupee, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

// ---- Pipeline config hook (shared pattern) ----
type PipelineSubStatus = {
  sub_status_key: string;
  sub_status_label: string;
  color_class: string;
  is_active: boolean;
};
type PipelineStage = {
  stage_key: string;
  stage_label: string;
  stage_color: string;
  is_active: boolean;
  pipeline_sub_statuses: PipelineSubStatus[];
};

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
          .filter((ss: PipelineSubStatus) => ss.is_active),
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

export default function AdminCRMDeals() {
  const [stageFilter, setStageFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedDealId, setSelectedDealId] = useState<string | null>(null);

  const { data: stages = [] } = usePipelineConfig();
  const { stageLabels, stageColors, subStatusLabels, subStatusColors } = buildLookups(stages);

  const { data: deals = [], isLoading } = useQuery({
    queryKey: ['crm-deals-list', stageFilter, search],
    queryFn: async () => {
      let q = supabase.from('crm_deals').select('*, crm_contacts(full_name, phone)').order('created_at', { ascending: false });
      if (stageFilter !== 'all') q = q.eq('stage', stageFilter as any);
      if (search) q = q.ilike('title', `%${search}%`);
      const { data, error } = await q;
      if (error) throw error;
      return data;
    },
  });

  const totalValue = deals.reduce((s, d) => s + Number(d.deal_value || 0), 0);

  return (
    <AdminGuard>
      <AdminLayout title="All Deals" subtitle="List view of all CRM deals">
        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          {[
            { label: 'Total Deals', value: deals.length, color: 'text-foreground' },
            { label: 'Total Value', value: `₹${totalValue.toLocaleString('en-IN')}`, color: 'text-primary' },
            ...stages.slice(0, 2).map(s => ({
              label: s.stage_label,
              value: deals.filter(d => d.stage === s.stage_key).length,
              color: '',
            })),
          ].map(({ label, value, color }) => (
            <div key={label} className="rounded-lg border border-border bg-background p-3 text-center">
              <p className={cn('text-xl font-bold', color)}>{value}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search deals..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Select value={stageFilter} onValueChange={setStageFilter}>
            <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stages</SelectItem>
              {stages.map(s => <SelectItem key={s.stage_key} value={s.stage_key}>{s.stage_label}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button asChild size="sm" variant="outline"><Link to={ADMIN_ROUTES.sales.pipeline}>Pipeline View</Link></Button>
        </div>

        <div className="rounded-lg border border-border overflow-x-auto">
          <Table>
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
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    <Loader2 className="w-5 h-5 animate-spin inline mr-2" />Loading...
                  </TableCell>
                </TableRow>
              )}
              {deals.map(deal => (
                <TableRow key={deal.id} className="cursor-pointer hover:bg-muted/30" onClick={() => setSelectedDealId(deal.id)}>
                  <TableCell className="font-medium">{deal.title}</TableCell>
                  <TableCell>{(deal as any).crm_contacts?.full_name || '—'}</TableCell>
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
                    <span className="flex items-center gap-0.5 text-sm">
                      <IndianRupee className="h-3 w-3" />{Number(deal.deal_value || 0).toLocaleString('en-IN')}
                    </span>
                  </TableCell>
                  <TableCell>{deal.product_interest || '—'}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{format(new Date(deal.created_at), 'dd MMM yyyy')}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={e => { e.stopPropagation(); setSelectedDealId(deal.id); }}>
                      <Eye className="h-3.5 w-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {!isLoading && deals.length === 0 && (
                <TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">No deals found</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <DealDetailDrawer dealId={selectedDealId} open={!!selectedDealId} onClose={() => setSelectedDealId(null)} />
      </AdminLayout>
    </AdminGuard>
  );
}
