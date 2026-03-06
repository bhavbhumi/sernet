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

const EMPTY = { name: '', sac_code: '', default_rate: 0, unit: 'per service', tax_rate_id: '', description: '', is_active: true };

export const ServiceCatalogContent = () => {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY);

  const { data: services = [], isLoading } = useQuery({
    queryKey: ['service-catalog'],
    queryFn: async () => {
      const { data, error } = await supabase.from('service_catalog').select('*, tax_rates(name, rate)').order('name');
      if (error) throw error;
      return data || [];
    },
  });

  const { data: taxRates = [] } = useQuery({
    queryKey: ['tax-rates'],
    queryFn: async () => {
      const { data, error } = await supabase.from('tax_rates').select('id, name, rate').eq('is_active', true).order('rate');
      if (error) throw error;
      return data || [];
    },
  });

  const save = useMutation({
    mutationFn: async () => {
      const payload = { ...form, default_rate: Number(form.default_rate), tax_rate_id: form.tax_rate_id || null };
      if (editing) {
        const { error } = await supabase.from('service_catalog').update(payload).eq('id', editing);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('service_catalog').insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['service-catalog'] }); toast.success('Service saved'); setOpen(false); setEditing(null); setForm(EMPTY); },
    onError: (e: any) => toast.error(e.message),
  });

  const edit = (r: any) => { setEditing(r.id); setForm({ name: r.name, sac_code: r.sac_code || '', default_rate: r.default_rate, unit: r.unit, tax_rate_id: r.tax_rate_id || '', description: r.description || '', is_active: r.is_active }); setOpen(true); };

  return (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Services</CardTitle>
          <Dialog open={open} onOpenChange={o => { setOpen(o); if (!o) { setEditing(null); setForm(EMPTY); } }}>
            <DialogTrigger asChild><Button size="sm"><Plus className="h-4 w-4 mr-1" />Add Service</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{editing ? 'Edit' : 'Add'} Service</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div><Label>Service Name *</Label><Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Advisory Fee" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Default Rate (₹)</Label><Input type="number" value={form.default_rate} onChange={e => setForm(p => ({ ...p, default_rate: Number(e.target.value) }))} /></div>
                  <div><Label>Unit</Label><Input value={form.unit} onChange={e => setForm(p => ({ ...p, unit: e.target.value }))} placeholder="per service" /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>SAC Code</Label><Input value={form.sac_code} onChange={e => setForm(p => ({ ...p, sac_code: e.target.value }))} placeholder="997159" /></div>
                  <div>
                    <Label>Tax Rate</Label>
                    <Select value={form.tax_rate_id || "none"} onValueChange={v => setForm(p => ({ ...p, tax_rate_id: v === "none" ? "" : v }))}>
                      <SelectTrigger><SelectValue placeholder="Select tax" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No Tax</SelectItem>
                        {taxRates.map((t: any) => <SelectItem key={t.id} value={t.id}>{t.name} ({t.rate}%)</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div><Label>Description</Label><Input value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} /></div>
                <div className="flex items-center gap-2"><Switch checked={form.is_active} onCheckedChange={v => setForm(p => ({ ...p, is_active: v }))} /><Label>Active</Label></div>
                <Button className="w-full" onClick={() => save.mutate()} disabled={!form.name || save.isPending}>{editing ? 'Update' : 'Create'}</Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {isLoading ? <p className="text-muted-foreground text-sm">Loading...</p> : services.length === 0 ? <p className="text-muted-foreground text-sm">No services configured.</p> : (
            <Table>
              <TableHeader><TableRow><TableHead>Service</TableHead><TableHead>SAC</TableHead><TableHead className="text-right">Rate</TableHead><TableHead>Unit</TableHead><TableHead>Tax</TableHead><TableHead>Status</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
              <TableBody>
                {services.map((s: any) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">{s.name}</TableCell>
                    <TableCell className="font-mono text-xs">{s.sac_code || '—'}</TableCell>
                    <TableCell className="text-right">₹{Number(s.default_rate).toLocaleString('en-IN')}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{s.unit}</TableCell>
                    <TableCell className="text-sm">{s.tax_rates ? `${s.tax_rates.name} (${s.tax_rates.rate}%)` : '—'}</TableCell>
                    <TableCell><Badge variant={s.is_active ? 'default' : 'secondary'}>{s.is_active ? 'Active' : 'Inactive'}</Badge></TableCell>
                    <TableCell><Button size="icon" variant="ghost" onClick={() => edit(s)}><Pencil className="h-3.5 w-3.5" /></Button></TableCell>
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

export default AdminServiceCatalog;
