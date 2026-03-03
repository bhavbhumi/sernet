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

const EMPTY = { name: '', rate: 0, tax_type: 'GST', hsn_sac_code: '', description: '', is_active: true };

const AdminTaxRates = () => {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY);

  const { data: rates = [], isLoading } = useQuery({
    queryKey: ['tax-rates'],
    queryFn: async () => {
      const { data, error } = await supabase.from('tax_rates').select('*').order('rate');
      if (error) throw error;
      return data || [];
    },
  });

  const save = useMutation({
    mutationFn: async () => {
      const payload = { ...form, rate: Number(form.rate) };
      if (editing) {
        const { error } = await supabase.from('tax_rates').update(payload).eq('id', editing);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('tax_rates').insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['tax-rates'] }); toast.success('Tax rate saved'); setOpen(false); setEditing(null); setForm(EMPTY); },
    onError: (e: any) => toast.error(e.message),
  });

  const edit = (r: any) => { setEditing(r.id); setForm({ name: r.name, rate: r.rate, tax_type: r.tax_type, hsn_sac_code: r.hsn_sac_code || '', description: r.description || '', is_active: r.is_active }); setOpen(true); };

  return (
    <AdminLayout title="Tax Rates" subtitle="Manage GST slabs and SAC/HSN codes">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Tax Rates</CardTitle>
          <Dialog open={open} onOpenChange={o => { setOpen(o); if (!o) { setEditing(null); setForm(EMPTY); } }}>
            <DialogTrigger asChild><Button size="sm"><Plus className="h-4 w-4 mr-1" />Add Rate</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{editing ? 'Edit' : 'Add'} Tax Rate</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Name *</Label><Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. GST 18%" /></div>
                  <div><Label>Rate (%)</Label><Input type="number" value={form.rate} onChange={e => setForm(p => ({ ...p, rate: Number(e.target.value) }))} /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Type</Label>
                    <Select value={form.tax_type} onValueChange={v => setForm(p => ({ ...p, tax_type: v }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {['GST', 'IGST', 'CGST+SGST', 'TDS', 'Exempt'].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div><Label>HSN/SAC Code</Label><Input value={form.hsn_sac_code} onChange={e => setForm(p => ({ ...p, hsn_sac_code: e.target.value }))} /></div>
                </div>
                <div><Label>Description</Label><Input value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} /></div>
                <div className="flex items-center gap-2"><Switch checked={form.is_active} onCheckedChange={v => setForm(p => ({ ...p, is_active: v }))} /><Label>Active</Label></div>
                <Button className="w-full" onClick={() => save.mutate()} disabled={!form.name || save.isPending}>{editing ? 'Update' : 'Create'}</Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {isLoading ? <p className="text-muted-foreground text-sm">Loading...</p> : rates.length === 0 ? <p className="text-muted-foreground text-sm">No tax rates configured.</p> : (
            <Table>
              <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Rate</TableHead><TableHead>Type</TableHead><TableHead>SAC/HSN</TableHead><TableHead>Status</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
              <TableBody>
                {rates.map((r: any) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.name}</TableCell>
                    <TableCell>{r.rate}%</TableCell>
                    <TableCell>{r.tax_type}</TableCell>
                    <TableCell className="font-mono text-xs">{r.hsn_sac_code || '—'}</TableCell>
                    <TableCell><Badge variant={r.is_active ? 'default' : 'secondary'}>{r.is_active ? 'Active' : 'Inactive'}</Badge></TableCell>
                    <TableCell><Button size="icon" variant="ghost" onClick={() => edit(r)}><Pencil className="h-3.5 w-3.5" /></Button></TableCell>
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

export default AdminTaxRates;
