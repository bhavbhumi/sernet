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
import { Switch } from '@/components/ui/switch';
import { Plus } from 'lucide-react';
import { RowActions } from '@/components/admin/RowActions';
import { toast } from 'sonner';
import { useState } from 'react';

const EMPTY = { name: '', days: 0, description: '', is_default: false, is_active: true };

export const PaymentTermsContent = () => {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY);

  const { data: terms = [], isLoading } = useQuery({
    queryKey: ['payment-terms'],
    queryFn: async () => {
      const { data, error } = await supabase.from('payment_terms').select('*').order('days');
      if (error) throw error;
      return data || [];
    },
  });

  const save = useMutation({
    mutationFn: async () => {
      const payload = { ...form, days: Number(form.days) };
      if (editing) {
        const { error } = await supabase.from('payment_terms').update(payload).eq('id', editing);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('payment_terms').insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['payment-terms'] }); toast.success('Payment term saved'); setOpen(false); setEditing(null); setForm(EMPTY); },
    onError: (e: any) => toast.error(e.message),
  });

  const edit = (r: any) => { setEditing(r.id); setForm({ name: r.name, days: r.days, description: r.description || '', is_default: r.is_default, is_active: r.is_active }); setOpen(true); };

  return (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Payment Terms</CardTitle>
          <Dialog open={open} onOpenChange={o => { setOpen(o); if (!o) { setEditing(null); setForm(EMPTY); } }}>
            <DialogTrigger asChild><Button size="sm"><Plus className="h-4 w-4 mr-1" />Add Term</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{editing ? 'Edit' : 'Add'} Payment Term</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div><Label>Name *</Label><Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Net 30" /></div>
                <div><Label>Days</Label><Input type="number" value={form.days} onChange={e => setForm(p => ({ ...p, days: Number(e.target.value) }))} /></div>
                <div><Label>Description</Label><Input value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Payment due within 30 days" /></div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2"><Switch checked={form.is_default} onCheckedChange={v => setForm(p => ({ ...p, is_default: v }))} /><Label>Default Term</Label></div>
                  <div className="flex items-center gap-2"><Switch checked={form.is_active} onCheckedChange={v => setForm(p => ({ ...p, is_active: v }))} /><Label>Active</Label></div>
                </div>
                <Button className="w-full" onClick={() => save.mutate()} disabled={!form.name || save.isPending}>{editing ? 'Update' : 'Create'}</Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {isLoading ? <p className="text-muted-foreground text-sm">Loading...</p> : terms.length === 0 ? <p className="text-muted-foreground text-sm">No payment terms configured.</p> : (
            <Table>
              <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Days</TableHead><TableHead>Description</TableHead><TableHead>Status</TableHead><TableHead className="w-12"></TableHead></TableRow></TableHeader>
              <TableBody>
                {terms.map((t: any) => (
                  <TableRow key={t.id}>
                    <TableCell className="font-medium">{t.name} {t.is_default && <Badge variant="outline" className="ml-1 text-[10px]">Default</Badge>}</TableCell>
                    <TableCell>{t.days}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{t.description || '—'}</TableCell>
                    <TableCell><Badge variant={t.is_active ? 'default' : 'secondary'}>{t.is_active ? 'Active' : 'Inactive'}</Badge></TableCell>
                    <TableCell><Button size="icon" variant="ghost" onClick={() => edit(t)}><Pencil className="h-3.5 w-3.5" /></Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
  );
};

const AdminPaymentTerms = () => (
  <AdminLayout title="Payment Terms" subtitle="Configure invoice payment term presets">
    <PaymentTermsContent />
  </AdminLayout>
);

export default AdminPaymentTerms;
