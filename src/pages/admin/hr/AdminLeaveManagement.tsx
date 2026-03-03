import { AdminLayout } from '@/components/admin/AdminLayout';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, X, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { useState } from 'react';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  approved: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
};

const AdminLeaveManagement = () => {
  const qc = useQueryClient();
  const [requestOpen, setRequestOpen] = useState(false);
  const [typeOpen, setTypeOpen] = useState(false);
  const [form, setForm] = useState({ employee_id: '', leave_type_id: '', start_date: '', end_date: '', days_count: 1, reason: '' });
  const [typeForm, setTypeForm] = useState({ name: '', code: '', default_days: 0, is_paid: true });

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
      const { data, error } = await supabase.from('leave_types').select('*').order('name');
      if (error) throw error;
      return data || [];
    },
  });

  const { data: employees = [] } = useQuery({
    queryKey: ['employees-list'],
    queryFn: async () => {
      const { data, error } = await supabase.from('employees').select('id, full_name').eq('status', 'active').order('full_name');
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

  const createRequest = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('leave_requests').insert({
        employee_id: form.employee_id,
        leave_type_id: form.leave_type_id,
        start_date: form.start_date,
        end_date: form.end_date,
        days_count: form.days_count,
        reason: form.reason || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['leave-requests'] });
      toast.success('Leave request created');
      setRequestOpen(false);
      setForm({ employee_id: '', leave_type_id: '', start_date: '', end_date: '', days_count: 1, reason: '' });
    },
    onError: (e: any) => toast.error(e.message),
  });

  const createType = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('leave_types').insert({
        name: typeForm.name,
        code: typeForm.code,
        default_days: typeForm.default_days,
        is_paid: typeForm.is_paid,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['leave-types'] });
      toast.success('Leave type created');
      setTypeOpen(false);
      setTypeForm({ name: '', code: '', default_days: 0, is_paid: true });
    },
    onError: (e: any) => toast.error(e.message),
  });

  const toggleTypeActive = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase.from('leave_types').update({ is_active }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['leave-types'] }); toast.success('Leave type updated'); },
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
          <CardContent><p className="text-2xl font-bold">{leaveTypes.filter((t: any) => t.is_active).length}</p></CardContent>
        </Card>
      </div>

      <Tabs defaultValue="requests">
        <TabsList>
          <TabsTrigger value="requests">Leave Requests</TabsTrigger>
          <TabsTrigger value="types">Leave Types</TabsTrigger>
        </TabsList>

        <TabsContent value="requests">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Leave Requests</CardTitle>
              <Dialog open={requestOpen} onOpenChange={setRequestOpen}>
                <DialogTrigger asChild><Button size="sm"><Plus className="h-4 w-4 mr-1" />New Request</Button></DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>Create Leave Request</DialogTitle></DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Employee</Label>
                      <Select value={form.employee_id} onValueChange={v => setForm(p => ({ ...p, employee_id: v }))}>
                        <SelectTrigger><SelectValue placeholder="Select employee" /></SelectTrigger>
                        <SelectContent>{employees.map((e: any) => <SelectItem key={e.id} value={e.id}>{e.full_name}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Leave Type</Label>
                      <Select value={form.leave_type_id} onValueChange={v => setForm(p => ({ ...p, leave_type_id: v }))}>
                        <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                        <SelectContent>{leaveTypes.filter((t: any) => t.is_active).map((t: any) => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}</SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div><Label>Start Date</Label><Input type="date" value={form.start_date} onChange={e => setForm(p => ({ ...p, start_date: e.target.value }))} /></div>
                      <div><Label>End Date</Label><Input type="date" value={form.end_date} onChange={e => setForm(p => ({ ...p, end_date: e.target.value }))} /></div>
                    </div>
                    <div><Label>Days</Label><Input type="number" min={0.5} step={0.5} value={form.days_count} onChange={e => setForm(p => ({ ...p, days_count: Number(e.target.value) }))} /></div>
                    <div><Label>Reason</Label><Textarea value={form.reason} onChange={e => setForm(p => ({ ...p, reason: e.target.value }))} /></div>
                    <Button className="w-full" disabled={!form.employee_id || !form.leave_type_id || !form.start_date || !form.end_date} onClick={() => createRequest.mutate()}>Create Request</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {isLoading ? <p className="text-muted-foreground text-sm">Loading...</p> : requests.length === 0 ? <p className="text-muted-foreground text-sm">No leave requests yet.</p> : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>From</TableHead>
                      <TableHead>To</TableHead>
                      <TableHead>Days</TableHead>
                      <TableHead>Reason</TableHead>
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
                        <TableCell className="max-w-[200px] truncate">{r.reason || '—'}</TableCell>
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
        </TabsContent>

        <TabsContent value="types">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Leave Types</CardTitle>
              <Dialog open={typeOpen} onOpenChange={setTypeOpen}>
                <DialogTrigger asChild><Button size="sm"><Plus className="h-4 w-4 mr-1" />Add Type</Button></DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>Add Leave Type</DialogTitle></DialogHeader>
                  <div className="space-y-4">
                    <div><Label>Name</Label><Input value={typeForm.name} onChange={e => setTypeForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Casual Leave" /></div>
                    <div><Label>Code</Label><Input value={typeForm.code} onChange={e => setTypeForm(p => ({ ...p, code: e.target.value }))} placeholder="e.g. CL" /></div>
                    <div><Label>Default Days per Year</Label><Input type="number" value={typeForm.default_days} onChange={e => setTypeForm(p => ({ ...p, default_days: Number(e.target.value) }))} /></div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" checked={typeForm.is_paid} onChange={e => setTypeForm(p => ({ ...p, is_paid: e.target.checked }))} id="is_paid" />
                      <Label htmlFor="is_paid">Paid Leave</Label>
                    </div>
                    <Button className="w-full" disabled={!typeForm.name || !typeForm.code} onClick={() => createType.mutate()}>Add Leave Type</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Default Days</TableHead>
                    <TableHead>Paid</TableHead>
                    <TableHead>Active</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaveTypes.map((t: any) => (
                    <TableRow key={t.id}>
                      <TableCell className="font-medium">{t.name}</TableCell>
                      <TableCell className="font-mono">{t.code}</TableCell>
                      <TableCell>{t.default_days}</TableCell>
                      <TableCell>{t.is_paid ? 'Yes' : 'No'}</TableCell>
                      <TableCell><Badge className={t.is_active ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-muted text-muted-foreground'}>{t.is_active ? 'Active' : 'Inactive'}</Badge></TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline" onClick={() => toggleTypeActive.mutate({ id: t.id, is_active: !t.is_active })}>
                          {t.is_active ? 'Disable' : 'Enable'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default AdminLeaveManagement;