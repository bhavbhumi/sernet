import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Plus, UserMinus } from 'lucide-react';

const fmt = (n: number) => Math.round(n).toLocaleString('en-IN');

const statusColors: Record<string, string> = {
  initiated: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  processing: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  settled: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  cancelled: 'bg-red-500/10 text-red-600 border-red-500/20',
};

export default function AdminEmployeeExit() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: exits = [], isLoading } = useQuery({
    queryKey: ['employee-exits'],
    queryFn: async () => {
      const { data } = await supabase
        .from('employee_exits')
        .select('*, employees!employee_exits_employee_id_fkey(full_name, employee_code, department, designation)')
        .order('created_at', { ascending: false });
      return data || [];
    },
  });

  const { data: activeEmployees = [] } = useQuery({
    queryKey: ['active-employees-exit'],
    queryFn: async () => {
      const { data } = await supabase
        .from('employees')
        .select('id, full_name, employee_code')
        .eq('status', 'active')
        .order('full_name');
      return data || [];
    },
  });

  const [form, setForm] = useState({
    employee_id: '',
    exit_type: 'resignation',
    resignation_date: format(new Date(), 'yyyy-MM-dd'),
    last_working_day: '',
    reason: '',
    notice_period_days: 30,
    leave_encashment_amount: 0,
    pending_salary: 0,
    deductions: 0,
    handover_notes: '',
  });

  const fnfTotal = Number(form.leave_encashment_amount) + Number(form.pending_salary) - Number(form.deductions);

  const createMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('employee_exits').insert({
        employee_id: form.employee_id,
        exit_type: form.exit_type,
        resignation_date: form.resignation_date || null,
        last_working_day: form.last_working_day || null,
        reason: form.reason || null,
        notice_period_days: form.notice_period_days,
        leave_encashment_amount: form.leave_encashment_amount,
        pending_salary: form.pending_salary,
        deductions: form.deductions,
        fnf_total: fnfTotal,
        handover_notes: form.handover_notes || null,
        status: 'initiated',
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Exit record created');
      queryClient.invalidateQueries({ queryKey: ['employee-exits'] });
      setDialogOpen(false);
    },
    onError: (e: any) => toast.error(e.message),
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const updates: any = { status };
      if (status === 'settled') {
        updates.processed_at = new Date().toISOString();
      }
      const { error } = await supabase.from('employee_exits').update(updates).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Status updated');
      queryClient.invalidateQueries({ queryKey: ['employee-exits'] });
    },
  });

  const counts = {
    initiated: exits.filter((e: any) => e.status === 'initiated').length,
    processing: exits.filter((e: any) => e.status === 'processing').length,
    settled: exits.filter((e: any) => e.status === 'settled').length,
  };

  return (
    <AdminLayout
      title="Employee Exit & FnF"
      subtitle="Full & Final Settlement"
      actions={
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="h-4 w-4 mr-1.5" /> Initiate Exit</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-auto">
            <DialogHeader><DialogTitle>Initiate Employee Exit</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Employee</Label>
                <Select value={form.employee_id} onValueChange={v => setForm(p => ({ ...p, employee_id: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select employee" /></SelectTrigger>
                  <SelectContent>
                    {activeEmployees.map((e: any) => (
                      <SelectItem key={e.id} value={e.id}>{e.full_name} {e.employee_code ? `(${e.employee_code})` : ''}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Exit Type</Label>
                  <Select value={form.exit_type} onValueChange={v => setForm(p => ({ ...p, exit_type: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="resignation">Resignation</SelectItem>
                      <SelectItem value="termination">Termination</SelectItem>
                      <SelectItem value="retirement">Retirement</SelectItem>
                      <SelectItem value="contract_end">Contract End</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Notice Period (days)</Label>
                  <Input type="number" value={form.notice_period_days} onChange={e => setForm(p => ({ ...p, notice_period_days: Number(e.target.value) }))} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Resignation Date</Label>
                  <Input type="date" value={form.resignation_date} onChange={e => setForm(p => ({ ...p, resignation_date: e.target.value }))} />
                </div>
                <div>
                  <Label>Last Working Day</Label>
                  <Input type="date" value={form.last_working_day} onChange={e => setForm(p => ({ ...p, last_working_day: e.target.value }))} />
                </div>
              </div>
              <div>
                <Label>Reason</Label>
                <Textarea value={form.reason} onChange={e => setForm(p => ({ ...p, reason: e.target.value }))} rows={2} />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label>Leave Encashment (₹)</Label>
                  <Input type="number" value={form.leave_encashment_amount} onChange={e => setForm(p => ({ ...p, leave_encashment_amount: Number(e.target.value) }))} />
                </div>
                <div>
                  <Label>Pending Salary (₹)</Label>
                  <Input type="number" value={form.pending_salary} onChange={e => setForm(p => ({ ...p, pending_salary: Number(e.target.value) }))} />
                </div>
                <div>
                  <Label>Deductions (₹)</Label>
                  <Input type="number" value={form.deductions} onChange={e => setForm(p => ({ ...p, deductions: Number(e.target.value) }))} />
                </div>
              </div>
              <div className="bg-muted/50 rounded-lg p-3 text-center">
                <p className="text-sm text-muted-foreground">FnF Total</p>
                <p className="text-xl font-bold text-foreground">₹{fmt(fnfTotal)}</p>
              </div>
              <div>
                <Label>Handover Notes</Label>
                <Textarea value={form.handover_notes} onChange={e => setForm(p => ({ ...p, handover_notes: e.target.value }))} rows={3} />
              </div>
              <Button className="w-full" onClick={() => createMutation.mutate()} disabled={!form.employee_id || createMutation.isPending}>
                Create Exit Record
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Initiated</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-amber-600">{counts.initiated}</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Processing</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-blue-600">{counts.processing}</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Settled</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-emerald-600">{counts.settled}</p></CardContent></Card>
      </div>

      <div className="border border-border rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Resignation</TableHead>
              <TableHead>Last Day</TableHead>
              <TableHead className="text-right">FnF Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">Loading...</TableCell></TableRow>
            ) : exits.length === 0 ? (
              <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No exit records yet.</TableCell></TableRow>
            ) : exits.map((ex: any) => {
              const emp = ex.employees as any;
              return (
                <TableRow key={ex.id}>
                  <TableCell className="font-medium">{emp?.full_name}<br /><span className="text-xs text-muted-foreground">{emp?.department}</span></TableCell>
                  <TableCell className="capitalize">{ex.exit_type?.replace('_', ' ')}</TableCell>
                  <TableCell>{ex.resignation_date ? format(new Date(ex.resignation_date), 'dd MMM yyyy') : '—'}</TableCell>
                  <TableCell>{ex.last_working_day ? format(new Date(ex.last_working_day), 'dd MMM yyyy') : '—'}</TableCell>
                  <TableCell className="text-right font-semibold">₹{fmt(Number(ex.fnf_total))}</TableCell>
                  <TableCell><Badge variant="outline" className={statusColors[ex.status] || ''}>{ex.status}</Badge></TableCell>
                  <TableCell>
                    {ex.status === 'initiated' && (
                      <Button variant="outline" size="sm" onClick={() => updateStatus.mutate({ id: ex.id, status: 'processing' })}>Process</Button>
                    )}
                    {ex.status === 'processing' && (
                      <Button variant="outline" size="sm" onClick={() => updateStatus.mutate({ id: ex.id, status: 'settled' })}>Settle</Button>
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
