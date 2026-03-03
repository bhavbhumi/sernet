import { AdminLayout } from '@/components/admin/AdminLayout';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Check, X } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  approved: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
};

const AdminLeaveManagement = () => {
  const qc = useQueryClient();

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ['leave-requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leave_requests')
        .select('*, employees!leave_requests_employee_id_fkey(full_name), leave_types!leave_requests_leave_type_id_fkey(name)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  const { data: leaveTypes = [] } = useQuery({
    queryKey: ['leave-types'],
    queryFn: async () => {
      const { data, error } = await supabase.from('leave_types').select('*').eq('is_active', true).order('name');
      if (error) throw error;
      return data || [];
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from('leave_requests').update({ status, approved_at: status === 'approved' ? new Date().toISOString() : null }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['leave-requests'] }); toast.success('Leave request updated'); },
  });

  return (
    <AdminLayout title="Leave Management" subtitle="Manage employee leave requests and types">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {['pending', 'approved', 'rejected'].map(s => (
          <Card key={s}>
            <CardHeader className="pb-2"><CardTitle className="text-sm capitalize">{s}</CardTitle></CardHeader>
            <CardContent><p className="text-2xl font-bold">{requests.filter((r: any) => r.status === s).length}</p></CardContent>
          </Card>
        ))}
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">Leave Types</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{leaveTypes.length}</p></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Leave Requests</CardTitle></CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground text-sm">Loading...</p>
          ) : requests.length === 0 ? (
            <p className="text-muted-foreground text-sm">No leave requests yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>From</TableHead>
                  <TableHead>To</TableHead>
                  <TableHead>Days</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((r: any) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.employees?.full_name || '—'}</TableCell>
                    <TableCell>{r.leave_types?.name || '—'}</TableCell>
                    <TableCell>{format(new Date(r.start_date), 'dd MMM yyyy')}</TableCell>
                    <TableCell>{format(new Date(r.end_date), 'dd MMM yyyy')}</TableCell>
                    <TableCell>{r.days_count}</TableCell>
                    <TableCell><Badge className={statusColors[r.status] || ''}>{r.status}</Badge></TableCell>
                    <TableCell>
                      {r.status === 'pending' && (
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline" onClick={() => updateStatus.mutate({ id: r.id, status: 'approved' })}><Check className="h-3 w-3" /></Button>
                          <Button size="sm" variant="outline" onClick={() => updateStatus.mutate({ id: r.id, status: 'rejected' })}><X className="h-3 w-3" /></Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default AdminLeaveManagement;
