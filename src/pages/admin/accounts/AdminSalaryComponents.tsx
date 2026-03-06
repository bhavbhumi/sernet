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
import { Switch } from '@/components/ui/switch';
import { Plus, Pencil } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';

const EMPTY = { name: '', code: '', component_type: 'earning', calculation_type: 'fixed', default_value: 0, is_taxable: true, is_active: true, sort_order: 0 };

export const SalaryComponentsContent = () => {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY);

  const { data: components = [], isLoading } = useQuery({
    queryKey: ['salary-components'],
    queryFn: async () => {
      const { data, error } = await supabase.from('salary_components').select('*').order('sort_order');
      if (error) throw error;
      return data || [];
    },
  });

  const save = useMutation({
    mutationFn: async () => {
      const payload = { ...form, default_value: Number(form.default_value), sort_order: Number(form.sort_order) };
      if (editing) {
        const { error } = await supabase.from('salary_components').update(payload).eq('id', editing);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('salary_components').insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['salary-components'] }); toast.success('Salary component saved'); setOpen(false); setEditing(null); setForm(EMPTY); },
    onError: (e: any) => toast.error(e.message),
  });

  const edit = (r: any) => { setEditing(r.id); setForm({ name: r.name, code: r.code, component_type: r.component_type, calculation_type: r.calculation_type, default_value: r.default_value, is_taxable: r.is_taxable, is_active: r.is_active, sort_order: r.sort_order }); setOpen(true); };

  const earnings = components.filter((c: any) => c.component_type === 'earning');
  const deductions = components.filter((c: any) => c.component_type === 'deduction');

  return (
    <AdminLayout title="Salary Components" subtitle="Configure earnings & deduction heads for payroll">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Earnings</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-green-600">{earnings.length}</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Deductions</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-red-600">{deductions.length}</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>All Components</CardTitle>
          <Dialog open={open} onOpenChange={o => { setOpen(o); if (!o) { setEditing(null); setForm(EMPTY); } }}>
            <DialogTrigger asChild><Button size="sm"><Plus className="h-4 w-4 mr-1" />Add Component</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{editing ? 'Edit' : 'Add'} Salary Component</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Name *</Label><Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Basic Salary" /></div>
                  <div><Label>Code *</Label><Input value={form.code} onChange={e => setForm(p => ({ ...p, code: e.target.value.toUpperCase() }))} placeholder="e.g. BASIC" /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Type</Label>
                    <Select value={form.component_type} onValueChange={v => setForm(p => ({ ...p, component_type: v }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="earning">Earning</SelectItem>
                        <SelectItem value="deduction">Deduction</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Calculation</Label>
                    <Select value={form.calculation_type} onValueChange={v => setForm(p => ({ ...p, calculation_type: v }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fixed">Fixed Amount</SelectItem>
                        <SelectItem value="percentage">% of Basic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Default Value</Label><Input type="number" value={form.default_value} onChange={e => setForm(p => ({ ...p, default_value: Number(e.target.value) }))} /></div>
                  <div><Label>Sort Order</Label><Input type="number" value={form.sort_order} onChange={e => setForm(p => ({ ...p, sort_order: Number(e.target.value) }))} /></div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2"><Switch checked={form.is_taxable} onCheckedChange={v => setForm(p => ({ ...p, is_taxable: v }))} /><Label>Taxable</Label></div>
                  <div className="flex items-center gap-2"><Switch checked={form.is_active} onCheckedChange={v => setForm(p => ({ ...p, is_active: v }))} /><Label>Active</Label></div>
                </div>
                <Button className="w-full" onClick={() => save.mutate()} disabled={!form.name || !form.code || save.isPending}>{editing ? 'Update' : 'Create'}</Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {isLoading ? <p className="text-muted-foreground text-sm">Loading...</p> : components.length === 0 ? <p className="text-muted-foreground text-sm">No salary components configured.</p> : (
            <Table>
              <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Code</TableHead><TableHead>Type</TableHead><TableHead>Calculation</TableHead><TableHead className="text-right">Default</TableHead><TableHead>Taxable</TableHead><TableHead>Status</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
              <TableBody>
                {components.map((c: any) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.name}</TableCell>
                    <TableCell className="font-mono text-xs">{c.code}</TableCell>
                    <TableCell><Badge variant={c.component_type === 'earning' ? 'default' : 'destructive'}>{c.component_type}</Badge></TableCell>
                    <TableCell className="capitalize text-sm">{c.calculation_type === 'percentage' ? '% of Basic' : 'Fixed'}</TableCell>
                    <TableCell className="text-right">{c.calculation_type === 'percentage' ? `${c.default_value}%` : `₹${Number(c.default_value).toLocaleString('en-IN')}`}</TableCell>
                    <TableCell>{c.is_taxable ? '✓' : '—'}</TableCell>
                    <TableCell><Badge variant={c.is_active ? 'default' : 'secondary'}>{c.is_active ? 'Active' : 'Inactive'}</Badge></TableCell>
                    <TableCell><Button size="icon" variant="ghost" onClick={() => edit(c)}><Pencil className="h-3.5 w-3.5" /></Button></TableCell>
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

export default AdminSalaryComponents;
