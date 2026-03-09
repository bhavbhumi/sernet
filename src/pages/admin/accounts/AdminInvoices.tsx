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
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { useState, useMemo } from 'react';

const statusColors: Record<string, string> = {
  draft: 'bg-muted text-muted-foreground',
  sent: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  paid: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  overdue: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  cancelled: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
};

type LineItem = { description: string; quantity: number; unit_price: number };

const AdminInvoices = () => {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ contact_id: '', due_date: '', notes: '', status: 'draft' });
  const [items, setItems] = useState<LineItem[]>([{ description: '', quantity: 1, unit_price: 0 }]);

  const { data: invoices = [], isLoading } = useQuery({
    queryKey: ['invoices'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('invoices')
        .select('*, crm_contacts(full_name)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });

  const { data: contacts = [] } = useQuery({
    queryKey: ['crm-contacts-invoiceable'],
    queryFn: async () => {
      const { data, error } = await supabase.from('crm_contacts').select('id, full_name, relationship_type').in('relationship_type', ['client', 'principal', 'partner']).order('full_name');
      if (error) throw error;
      return data || [];
    },
  });

  const { data: serviceCatalog = [] } = useQuery({
    queryKey: ['service-catalog-active'],
    queryFn: async () => {
      const { data, error } = await supabase.from('service_catalog').select('id, name, default_rate, unit').eq('is_active', true).order('name');
      if (error) throw error;
      return data || [];
    },
  });

  const subtotal = items.reduce((s, i) => s + i.quantity * i.unit_price, 0);

  const createInvoice = useMutation({
    mutationFn: async () => {
      const { data: inv, error } = await supabase.from('invoices').insert({
        invoice_number: 'DRAFT', // trigger will overwrite
        contact_id: form.contact_id || null,
        due_date: form.due_date || null,
        notes: form.notes || null,
        status: form.status,
        subtotal,
        tax_amount: 0,
        total: subtotal,
      }).select().single();
      if (error) throw error;

      const validItems = items.filter(i => i.description.trim());
      if (validItems.length > 0) {
        const { error: itemErr } = await supabase.from('invoice_items').insert(
          validItems.map((item, idx) => ({
            invoice_id: inv.id,
            description: item.description,
            quantity: item.quantity,
            unit_price: item.unit_price,
            amount: item.quantity * item.unit_price,
            sort_order: idx,
          }))
        );
        if (itemErr) throw itemErr;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['invoices'] });
      toast.success('Invoice created');
      setOpen(false);
      setForm({ contact_id: '', due_date: '', notes: '', status: 'draft' });
      setItems([{ description: '', quantity: 1, unit_price: 0 }]);
    },
    onError: (e: any) => toast.error(e.message),
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from('invoices').update({ status }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['invoices'] }); toast.success('Invoice updated'); },
  });

  const totalRevenue = invoices.filter((i: any) => i.status === 'paid').reduce((s: number, i: any) => s + Number(i.total || 0), 0);

  const addItem = () => setItems(p => [...p, { description: '', quantity: 1, unit_price: 0 }]);
  const removeItem = (idx: number) => setItems(p => p.filter((_, i) => i !== idx));
  const updateItem = (idx: number, field: keyof LineItem, value: string | number) =>
    setItems(p => p.map((item, i) => i === idx ? { ...item, [field]: value } : item));

  return (
    <AdminLayout title="Invoices" subtitle="Create and manage client invoices">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Total Invoices</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{invoices.length}</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Paid Revenue</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">₹{totalRevenue.toLocaleString('en-IN')}</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Draft</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{invoices.filter((i: any) => i.status === 'draft').length}</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm">Overdue</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{invoices.filter((i: any) => i.status === 'overdue').length}</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>All Invoices</CardTitle>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button size="sm"><Plus className="h-4 w-4 mr-1" />New Invoice</Button></DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader><DialogTitle>Create Invoice</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Bill To</Label>
                    <Select value={form.contact_id} onValueChange={v => setForm(p => ({ ...p, contact_id: v }))}>
                      <SelectTrigger><SelectValue placeholder="Select principal / partner / client" /></SelectTrigger>
                      <SelectContent>{contacts.map((c: any) => <SelectItem key={c.id} value={c.id}>{c.full_name} <span className="text-muted-foreground ml-1 text-xs">({c.relationship_type})</span></SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div><Label>Due Date</Label><Input type="date" value={form.due_date} onChange={e => setForm(p => ({ ...p, due_date: e.target.value }))} /></div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-base font-semibold">Line Items</Label>
                    <Button type="button" size="sm" variant="outline" onClick={addItem}><Plus className="h-3 w-3 mr-1" />Add Item</Button>
                  </div>
                  <div className="space-y-2">
                    {items.map((item, idx) => (
                      <div key={idx} className="grid grid-cols-[1fr_80px_100px_32px] gap-2 items-end">
                        <div>
                          <Select value={item.description} onValueChange={v => {
                            const svc = serviceCatalog.find((s: any) => s.name === v);
                            updateItem(idx, 'description', v);
                            if (svc && svc.default_rate > 0) updateItem(idx, 'unit_price', Number(svc.default_rate));
                          }}>
                            <SelectTrigger><SelectValue placeholder="Select service" /></SelectTrigger>
                            <SelectContent>
                              {serviceCatalog.map((s: any) => <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                        <div><Input type="number" min={1} placeholder="Qty" value={item.quantity} onChange={e => updateItem(idx, 'quantity', Number(e.target.value))} /></div>
                        <div><Input type="number" min={0} placeholder="Price" value={item.unit_price} onChange={e => updateItem(idx, 'unit_price', Number(e.target.value))} /></div>
                        <Button type="button" size="icon" variant="ghost" onClick={() => removeItem(idx)} disabled={items.length === 1}><Trash2 className="h-3 w-3" /></Button>
                      </div>
                    ))}
                  </div>
                  <div className="text-right mt-2 font-semibold">Total: ₹{subtotal.toLocaleString('en-IN')}</div>
                </div>

                <div><Label>Notes</Label><Textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} /></div>
                <Button className="w-full" disabled={items.every(i => !i.description.trim())} onClick={() => createInvoice.mutate()}>Create Invoice</Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {isLoading ? <p className="text-muted-foreground text-sm">Loading...</p> : invoices.length === 0 ? <p className="text-muted-foreground text-sm">No invoices yet.</p> : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((inv: any) => (
                  <TableRow key={inv.id}>
                    <TableCell className="font-mono font-medium">{inv.invoice_number}</TableCell>
                    <TableCell>{inv.crm_contacts?.full_name || '—'}</TableCell>
                    <TableCell>{format(new Date(inv.invoice_date), 'dd MMM yyyy')}</TableCell>
                    <TableCell>{inv.due_date ? format(new Date(inv.due_date), 'dd MMM yyyy') : '—'}</TableCell>
                    <TableCell className="text-right font-medium">₹{Number(inv.total).toLocaleString('en-IN')}</TableCell>
                    <TableCell><Badge className={statusColors[inv.status] || ''}>{inv.status}</Badge></TableCell>
                    <TableCell>
                      <Select value={inv.status} onValueChange={v => updateStatus.mutate({ id: inv.id, status: v })}>
                        <SelectTrigger className="h-8 w-28"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {['draft', 'sent', 'paid', 'overdue', 'cancelled'].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
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

export default AdminInvoices;