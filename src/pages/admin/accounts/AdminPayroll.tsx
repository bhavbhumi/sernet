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
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { useState } from 'react';

const statusColors: Record<string, string> = {
  draft: 'bg-muted text-muted-foreground',
  processed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  paid: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
};

const AdminPayroll = () => {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    employee_id: '', pay_period: '', pay_date: '',
    basic_salary: 0, allowances: 0, deductions: 0, notes: '',
  });

  const netPay = form.basic_salary + form.allowances - form.deductions;

  const { data: records = [], isLoading } = useQuery({
    queryKey: ['payroll-records'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payroll_records')
        .select('*, employees!payroll_records_employee_id_fkey(full_name, employee_code)')
        .order('pay_date', { ascending: false });
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

  const createRecord = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('payroll_records').insert({
        employee_id: form.employee_id,
        pay_period: form.pay_period,
        pay_date: form.pay_date,
        basic_salary: form.basic_salary,
        allowances: form.allowances,
        deductions: form.deductions,
        net_pay: netPay,
        notes: form.notes || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['payroll-records'] });
      toast.success('Payroll record created');
      setOpen(false);
      setForm({ employee_id: '', pay_period: '', pay_date: '', basic_salary: 0, allowances: 0, deductions: 0, notes: '' });
    },
    onError: (e: any) => toast.error(e.message),
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from('payroll_records').update({ status }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['payroll-records'] }); toast.success('Status updated'); },
  });

  const totalNetPay = records.reduce((s: number, r: any) => s + Number(r.net_pay || 0), 0);

  return (
    <AdminLayout title="Payroll Register" subtitle="Monthly salary records and pay processing">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Total Records</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{records.length}</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Total Net Pay</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">₹{totalNetPay.toLocaleString('en-IN')}</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Pending</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{records.filter((r: any) => r.status === 'draft').length}</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Payroll Records</CardTitle>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button size="sm"><Plus className="h-4 w-4 mr-1" />Add Record</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Create Payroll Record</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Employee</Label>
                  <Select value={form.employee_id} onValueChange={v => setForm(p => ({ ...p, employee_id: v }))}>
                    <SelectTrigger><SelectValue placeholder="Select employee" /></SelectTrigger>
                    <SelectContent>{employees.map((e: any) => <SelectItem key={e.id} value={e.id}>{e.full_name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Pay Period</Label><Input placeholder="e.g. Mar 2026" value={form.pay_period} onChange={e => setForm(p => ({ ...p, pay_period: e.target.value }))} /></div>
                  <div><Label>Pay Date</Label><Input type="date" value={form.pay_date} onChange={e => setForm(p => ({ ...p, pay_date: e.target.value }))} /></div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div><Label>Basic Salary</Label><Input type="number" min={0} value={form.basic_salary} onChange={e => setForm(p => ({ ...p, basic_salary: Number(e.target.value) }))} /></div>
                  <div><Label>Allowances</Label><Input type="number" min={0} value={form.allowances} onChange={e => setForm(p => ({ ...p, allowances: Number(e.target.value) }))} /></div>
                  <div><Label>Deductions</Label><Input type="number" min={0} value={form.deductions} onChange={e => setForm(p => ({ ...p, deductions: Number(e.target.value) }))} /></div>
                </div>
                <div className="text-right font-semibold">Net Pay: ₹{netPay.toLocaleString('en-IN')}</div>
                <div><Label>Notes</Label><Input value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} /></div>
                <Button className="w-full" disabled={!form.employee_id || !form.pay_period || !form.pay_date} onClick={() => createRecord.mutate()}>Create Record</Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {isLoading ? <p className="text-muted-foreground text-sm">Loading...</p> : records.length === 0 ? <p className="text-muted-foreground text-sm">No payroll records yet.</p> : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Pay Date</TableHead>
                  <TableHead className="text-right">Basic</TableHead>
                  <TableHead className="text-right">Allowances</TableHead>
                  <TableHead className="text-right">Deductions</TableHead>
                  <TableHead className="text-right">Net Pay</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((r: any) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.employees?.full_name || '—'}</TableCell>
                    <TableCell>{r.employees?.employee_code || '—'}</TableCell>
                    <TableCell>{r.pay_period}</TableCell>
                    <TableCell>{format(new Date(r.pay_date), 'dd MMM yyyy')}</TableCell>
                    <TableCell className="text-right">₹{Number(r.basic_salary).toLocaleString('en-IN')}</TableCell>
                    <TableCell className="text-right">₹{Number(r.allowances).toLocaleString('en-IN')}</TableCell>
                    <TableCell className="text-right">₹{Number(r.deductions).toLocaleString('en-IN')}</TableCell>
                    <TableCell className="text-right font-medium">₹{Number(r.net_pay).toLocaleString('en-IN')}</TableCell>
                    <TableCell><Badge className={statusColors[r.status] || ''}>{r.status}</Badge></TableCell>
                    <TableCell>
                      <Select value={r.status} onValueChange={v => updateStatus.mutate({ id: r.id, status: v })}>
                        <SelectTrigger className="h-8 w-28"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {['draft', 'processed', 'paid'].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                        </SelectContent>
                      </Select>
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

export default AdminPayroll;