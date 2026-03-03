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

const STAGE_LABELS: Record<string, string> = {
  enquiry: 'Enquiry', qualified: 'Qualified', account: 'Account', status: 'Status',
};
const SUB_LABELS: Record<string, string> = {
  contacted: 'Contacted', not_reachable: 'Not Reachable', not_interested: 'Not Interested', dnd: 'DND',
  cold: 'Cold', warm: 'Warm', hot: 'Hot',
  documentation: 'Documentation', kyc: 'KYC', profile: 'Profile', mandate: 'Mandate',
  active: 'Active', dormant: 'Dormant',
};

export default function AdminCRMDeals() {
  const [stageFilter, setStageFilter] = useState('all');
  const [search, setSearch] = useState('');

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

  return (
    <AdminGuard>
      <AdminLayout title="All Deals" subtitle="List view of all CRM deals">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <Input placeholder="Search deals..." value={search} onChange={e => setSearch(e.target.value)} className="max-w-xs" />
          <Select value={stageFilter} onValueChange={setStageFilter}>
            <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stages</SelectItem>
              {Object.entries(STAGE_LABELS).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
            </SelectContent>
          </Select>
          <span className="text-sm text-muted-foreground ml-auto">{deals.length} deals</span>
          <Button asChild size="sm" variant="outline"><Link to={ADMIN_ROUTES.sales.pipeline}>Pipeline View</Link></Button>
        </div>

        <div className="rounded-lg border">
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">Loading...</TableCell></TableRow>}
              {deals.map(deal => (
                <TableRow key={deal.id}>
                  <TableCell className="font-medium">{deal.title}</TableCell>
                  <TableCell>{(deal as any).crm_contacts?.full_name || '—'}</TableCell>
                  <TableCell><Badge variant="outline">{STAGE_LABELS[deal.stage] || deal.stage}</Badge></TableCell>
                  <TableCell><Badge variant="secondary">{SUB_LABELS[deal.sub_status] || deal.sub_status}</Badge></TableCell>
                  <TableCell>{Number(deal.deal_value || 0).toLocaleString('en-IN')}</TableCell>
                  <TableCell>{deal.product_interest || '—'}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{format(new Date(deal.created_at), 'dd MMM yyyy')}</TableCell>
                </TableRow>
              ))}
              {!isLoading && deals.length === 0 && <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No deals found</TableCell></TableRow>}
            </TableBody>
          </Table>
        </div>
      </AdminLayout>
    </AdminGuard>
  );
}
