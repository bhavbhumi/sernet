import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Plus, IndianRupee } from 'lucide-react';

const fmt = (n: number) => Math.round(n).toLocaleString('en-IN');

export default function AdminLoans() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: loans = [], isLoading } = useQuery({
    queryKey: ['employee-loans'],
    queryFn: async () => {
      const { data } = await supabase
        .from('employee_loans')
        .select('*, employees!employee_loans_employee_id_fkey(full_name, employee_code, department)')
        .order('created_at', { ascending: false });
      return data || [];
    },
  });

  const { data: employees = [] } = useQuery({
    queryKey: ['employees-list-loans'],
    queryFn: async () => {
      const { data } = await supabase.from('employees').select('id, full_name, employee_code').eq('status', 'active').order('full_name');
      return data || [];
    },
  });

  const [form, setForm] = useState({
    employee_id: '',
    loan_type: 'salary_advance',
    principal_amount: 0,
    emi_amount: 0,
    total_emis: 1,
    disbursed_on: format(new Date(), 'yyyy-MM-dd'),
    notes: '',
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('employee_loans').insert({
        employee_id: form.employee_id,
        loan_type: form.loan_type,
        principal_amount: form.principal_amount,
        emi_amount: form.emi_amount,
        total_emis: form.total_emis,
        outstanding: form.principal_amount,
        disbursed_on: form.disbursed_on || null,
        notes: form.notes || null,
        status: 'active',
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Loan/advance created');
      queryClient.invalidateQueries({ queryKey: ['employee-loans'] });
      setDialogOpen(false);
    },
    onError: (e: any) => toast.error(e.message),
  });

  const recordEMI = useMutation({
    mutationFn: async (loan: any) => {
      const newPaid = Number(loan.emis_paid) + 1;
      const newOutstanding = Math.max(0, Number(loan.outstanding) - Number(loan.emi_amount));
      const newStatus = newPaid >= Number(loan.total_emis) ? 'closed' : 'active';
      const { error } = await supabase.from('employee_loans').update({
        emis_paid: newPaid,
        outstanding: newOutstanding,
        status: newStatus,
      }).eq('id', loan.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('EMI recorded');
      queryClient.invalidateQueries({ queryKey: ['employee-loans'] });
    },
  });

  const totalOutstanding = loans.filter((l: any) => l.status === 'active').reduce((s: number, l: any) => s + Number(l.outstanding), 0);

  return (
    <AdminLayout
      title="Loans & Advances"
      subtitle="Salary advances and EMI tracking"
      actions={
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="h-4 w-4 mr-1.5" /> New Advance</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>New Loan / Salary Advance</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Employee</Label>
                <Select value={form.employee_id} onValueChange={v => setForm(p => ({ ...p, employee_id: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select employee" /></SelectTrigger>
                  <SelectContent>
                    {employees.map((e: any) => <SelectItem key={e.id} value={e.id}>{e.full_name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Type</Label>
                  <Select value={form.loan_type} onValueChange={v => setForm(p => ({ ...p, loan_type: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="salary_advance">Salary Advance</SelectItem>
                      <SelectItem value="personal_loan">Personal Loan</SelectItem>
                      <SelectItem value="emergency">Emergency Advance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Disbursement Date</Label>
                  <Input type="date" value={form.disbursed_on} onChange={e => setForm(p => ({ ...p, disbursed_on: e.target.value }))} />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label>Amount (₹)</Label>
                  <Input type="number" value={form.principal_amount} onChange={e => setForm(p => ({ ...p, principal_amount: Number(e.target.value) }))} />
                </div>
                <div>
                  <Label>EMI (₹)</Label>
                  <Input type="number" value={form.emi_amount} onChange={e => setForm(p => ({ ...p, emi_amount: Number(e.target.value) }))} />
                </div>
                <div>
                  <Label>Total EMIs</Label>
                  <Input type="number" value={form.total_emis} onChange={e => setForm(p => ({ ...p, total_emis: Number(e.target.value) }))} />
                </div>
              </div>
              <div>
                <Label>Notes</Label>
                <Input value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} />
              </div>
              <Button className="w-full" onClick={() => createMutation.mutate()} disabled={!form.employee_id || !form.principal_amount || createMutation.isPending}>
                Create
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Active Loans</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{loans.filter((l: any) => l.status === 'active').length}</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Total Outstanding</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold flex items-center gap-1"><IndianRupee className="h-5 w-5" />{fmt(totalOutstanding)}</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Closed</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-emerald-600">{loans.filter((l: any) => l.status === 'closed').length}</p></CardContent></Card>
      </div>

      <div className="border border-border rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Principal</TableHead>
              <TableHead className="text-right">EMI</TableHead>
              <TableHead className="text-center">Progress</TableHead>
              <TableHead className="text-right">Outstanding</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">Loading...</TableCell></TableRow>
            ) : loans.length === 0 ? (
              <TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">No loans or advances found.</TableCell></TableRow>
            ) : loans.map((l: any) => {
              const emp = l.employees as any;
              return (
                <TableRow key={l.id}>
                  <TableCell className="font-medium">{emp?.full_name}</TableCell>
                  <TableCell className="capitalize">{l.loan_type?.replace('_', ' ')}</TableCell>
                  <TableCell className="text-right">₹{fmt(Number(l.principal_amount))}</TableCell>
                  <TableCell className="text-right">₹{fmt(Number(l.emi_amount))}</TableCell>
                  <TableCell className="text-center">{l.emis_paid}/{l.total_emis}</TableCell>
                  <TableCell className="text-right font-semibold">₹{fmt(Number(l.outstanding))}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={l.status === 'active' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' : 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'}>
                      {l.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {l.status === 'active' && (
                      <Button variant="outline" size="sm" onClick={() => recordEMI.mutate(l)}>Record EMI</Button>
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
