import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { IndianRupee, Check, X } from 'lucide-react';

const fmt = (n: number) => Math.round(n).toLocaleString('en-IN');

const statusColors: Record<string, string> = {
  pending: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  approved: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  rejected: 'bg-red-500/10 text-red-600 border-red-500/20',
  reimbursed: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
};

export default function AdminExpenseClaims() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState('all');

  const { data: claims = [], isLoading } = useQuery({
    queryKey: ['expense-claims', filter],
    queryFn: async () => {
      let q = supabase
        .from('expense_claims')
        .select('*, employees!expense_claims_employee_id_fkey(full_name, employee_code, department)')
        .order('created_at', { ascending: false });
      if (filter !== 'all') q = q.eq('status', filter);
      const { data } = await q;
      return data || [];
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const updates: any = { status };
      if (status === 'approved' || status === 'rejected') {
        updates.approved_at = new Date().toISOString();
      }
      const { error } = await supabase.from('expense_claims').update(updates).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Claim updated');
      queryClient.invalidateQueries({ queryKey: ['expense-claims'] });
    },
  });

  const totalPending = claims.filter((c: any) => c.status === 'pending').reduce((s: number, c: any) => s + Number(c.amount), 0);
  const totalApproved = claims.filter((c: any) => c.status === 'approved').reduce((s: number, c: any) => s + Number(c.amount), 0);

  return (
    <AdminLayout title="Expense Reimbursements" subtitle="Employee expense claims and approvals">
      <div className="flex items-center gap-3 mb-6">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="reimbursed">Reimbursed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total Claims</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{claims.length}</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Pending Amount</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-amber-600 flex items-center gap-1"><IndianRupee className="h-5 w-5" />{fmt(totalPending)}</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Approved Amount</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-emerald-600 flex items-center gap-1"><IndianRupee className="h-5 w-5" />{fmt(totalApproved)}</p></CardContent></Card>
      </div>

      <div className="border border-border rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">Loading...</TableCell></TableRow>
            ) : claims.length === 0 ? (
              <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No expense claims found.</TableCell></TableRow>
            ) : claims.map((c: any) => {
              const emp = c.employees as any;
              return (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{emp?.full_name}<br /><span className="text-xs text-muted-foreground">{emp?.department}</span></TableCell>
                  <TableCell>{format(new Date(c.claim_date), 'dd MMM yyyy')}</TableCell>
                  <TableCell className="capitalize">{c.category}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{c.description}</TableCell>
                  <TableCell className="text-right font-semibold">₹{fmt(Number(c.amount))}</TableCell>
                  <TableCell><Badge variant="outline" className={statusColors[c.status] || ''}>{c.status}</Badge></TableCell>
                  <TableCell>
                    {c.status === 'pending' && (
                      <div className="flex gap-1">
                        <Button variant="outline" size="sm" className="text-emerald-600" onClick={() => updateStatus.mutate({ id: c.id, status: 'approved' })}>
                          <Check className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600" onClick={() => updateStatus.mutate({ id: c.id, status: 'rejected' })}>
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    )}
                    {c.status === 'approved' && (
                      <Button variant="outline" size="sm" onClick={() => updateStatus.mutate({ id: c.id, status: 'reimbursed' })}>Reimburse</Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </AdminLayout>
  );
}
