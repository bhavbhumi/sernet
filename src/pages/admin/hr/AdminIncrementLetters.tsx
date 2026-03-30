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
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Plus, Printer, FileText } from 'lucide-react';

const fmt = (n: number) => Math.round(n).toLocaleString('en-IN');

export default function AdminIncrementLetters() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);

  const { data: letters = [], isLoading } = useQuery({
    queryKey: ['increment-letters'],
    queryFn: async () => {
      const { data } = await supabase
        .from('increment_letters')
        .select('*, employees!increment_letters_employee_id_fkey(full_name, employee_code, department, designation, date_of_joining)')
        .order('created_at', { ascending: false });
      return data || [];
    },
  });

  const { data: employees = [] } = useQuery({
    queryKey: ['employees-list-increment'],
    queryFn: async () => {
      const { data } = await supabase.from('employees').select('id, full_name, employee_code').eq('status', 'active').order('full_name');
      return data || [];
    },
  });

  const { data: salaries = [] } = useQuery({
    queryKey: ['salary-structures-for-increment'],
    queryFn: async () => {
      const res = await (supabase as any).from('salary_structures').select('employee_id, ctc_annual').eq('is_active', true);
      return (res.data || []) as any[];
    },
  });

  const salaryMap = new Map((salaries as any[]).map(s => [s.employee_id, Number(s.ctc_annual)]));

  const [form, setForm] = useState({
    employee_id: '',
    effective_date: format(new Date(), 'yyyy-MM-dd'),
    new_ctc: 0,
  });

  const oldCtc = salaryMap.get(form.employee_id) || 0;
  const incrementPct = oldCtc > 0 ? ((form.new_ctc - oldCtc) / oldCtc * 100) : 0;

  const generateLetterHtml = (emp: any, oldCtc: number, newCtc: number, effectiveDate: string) => {
    return `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 700px; margin: 0 auto; padding: 40px; line-height: 1.8;">
        <h2 style="text-align: center; color: #1a1a1a; margin-bottom: 30px;">SALARY REVISION LETTER</h2>
        <p><strong>Date:</strong> ${format(new Date(effectiveDate), 'dd MMMM yyyy')}</p>
        <p><strong>To:</strong><br/>${emp.full_name}<br/>${emp.designation}, ${emp.department}</p>
        <p>Dear ${emp.full_name.split(' ')[0]},</p>
        <p>We are pleased to inform you that, in recognition of your valuable contributions and consistent performance, the management has decided to revise your compensation effective <strong>${format(new Date(effectiveDate), 'dd MMMM yyyy')}</strong>.</p>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr style="background: #f5f5f5;">
            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Current CTC (Annual)</strong></td>
            <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">₹${fmt(oldCtc)}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Revised CTC (Annual)</strong></td>
            <td style="padding: 10px; border: 1px solid #ddd; text-align: right; font-weight: bold; color: #16a34a;">₹${fmt(newCtc)}</td>
          </tr>
          <tr style="background: #f5f5f5;">
            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Increment</strong></td>
            <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">${((newCtc - oldCtc) / oldCtc * 100).toFixed(1)}%</td>
          </tr>
        </table>
        <p>The detailed breakdown of your revised salary structure will be reflected in your next payslip.</p>
        <p>We look forward to your continued dedication and growth with the organization.</p>
        <p style="margin-top: 40px;">Warm regards,<br/><strong>Human Resources</strong><br/>SERNET Wealth</p>
      </div>
    `;
  };

  const createMutation = useMutation({
    mutationFn: async () => {
      const emp = employees.find((e: any) => e.id === form.employee_id);
      // We need employee details for the letter
      const { data: empDetail } = await supabase.from('employees').select('full_name, designation, department, date_of_joining').eq('id', form.employee_id).single();
      const html = generateLetterHtml(empDetail, oldCtc, form.new_ctc, form.effective_date);
      const { error } = await supabase.from('increment_letters').insert({
        employee_id: form.employee_id,
        effective_date: form.effective_date,
        old_ctc: oldCtc,
        new_ctc: form.new_ctc,
        increment_pct: Number(incrementPct.toFixed(2)),
        letter_html: html,
        status: 'draft',
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Increment letter created');
      queryClient.invalidateQueries({ queryKey: ['increment-letters'] });
      setDialogOpen(false);
    },
    onError: (e: any) => toast.error(e.message),
  });

  const issueMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('increment_letters').update({
        status: 'issued',
        issued_at: new Date().toISOString(),
      }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Letter issued');
      queryClient.invalidateQueries({ queryKey: ['increment-letters'] });
    },
  });

  const printLetter = (html: string) => {
    const win = window.open('', '_blank');
    if (win) {
      win.document.write(`<html><head><title>Increment Letter</title></head><body>${html}</body></html>`);
      win.document.close();
      win.print();
    }
  };

  return (
    <AdminLayout
      title="Increment Letters"
      subtitle="Annual salary revision letters"
      actions={
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="h-4 w-4 mr-1.5" /> New Letter</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Generate Increment Letter</DialogTitle></DialogHeader>
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
              {form.employee_id && (
                <div className="bg-muted/50 rounded-lg p-3 text-sm">
                  <p className="text-muted-foreground">Current CTC: <strong className="text-foreground">₹{fmt(oldCtc)}</strong></p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Effective Date</Label>
                  <Input type="date" value={form.effective_date} onChange={e => setForm(p => ({ ...p, effective_date: e.target.value }))} />
                </div>
                <div>
                  <Label>New CTC (Annual ₹)</Label>
                  <Input type="number" value={form.new_ctc} onChange={e => setForm(p => ({ ...p, new_ctc: Number(e.target.value) }))} />
                </div>
              </div>
              {form.new_ctc > 0 && oldCtc > 0 && (
                <div className="bg-emerald-500/10 rounded-lg p-3 text-center">
                  <p className="text-sm text-muted-foreground">Increment</p>
                  <p className="text-xl font-bold text-emerald-600">{incrementPct.toFixed(1)}%</p>
                  <p className="text-xs text-muted-foreground">₹{fmt(form.new_ctc - oldCtc)} increase</p>
                </div>
              )}
              <Button className="w-full" onClick={() => createMutation.mutate()} disabled={!form.employee_id || !form.new_ctc || createMutation.isPending}>
                Generate Letter
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      }
    >
      <div className="border border-border rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Effective Date</TableHead>
              <TableHead className="text-right">Old CTC</TableHead>
              <TableHead className="text-right">New CTC</TableHead>
              <TableHead className="text-right">Increment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">Loading...</TableCell></TableRow>
            ) : letters.length === 0 ? (
              <TableRow><TableCell colSpan={7} className="text-center py-8 text-muted-foreground">No increment letters yet.</TableCell></TableRow>
            ) : letters.map((l: any) => {
              const emp = l.employees as any;
              return (
                <TableRow key={l.id}>
                  <TableCell className="font-medium">{emp?.full_name}<br /><span className="text-xs text-muted-foreground">{emp?.department}</span></TableCell>
                  <TableCell>{format(new Date(l.effective_date), 'dd MMM yyyy')}</TableCell>
                  <TableCell className="text-right">₹{fmt(Number(l.old_ctc))}</TableCell>
                  <TableCell className="text-right font-semibold text-emerald-600">₹{fmt(Number(l.new_ctc))}</TableCell>
                  <TableCell className="text-right">{Number(l.increment_pct).toFixed(1)}%</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={l.status === 'issued' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-amber-500/10 text-amber-600 border-amber-500/20'}>
                      {l.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {l.letter_html && (
                        <Button variant="ghost" size="sm" onClick={() => printLetter(l.letter_html)}>
                          <Printer className="h-3.5 w-3.5" />
                        </Button>
                      )}
                      {l.status === 'draft' && (
                        <Button variant="outline" size="sm" onClick={() => issueMutation.mutate(l.id)}>Issue</Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Preview dialog */}
      <Dialog open={!!previewHtml} onOpenChange={() => setPreviewHtml(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-auto">
          <DialogHeader><DialogTitle>Letter Preview</DialogTitle></DialogHeader>
          {previewHtml && <div dangerouslySetInnerHTML={{ __html: previewHtml }} />}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
