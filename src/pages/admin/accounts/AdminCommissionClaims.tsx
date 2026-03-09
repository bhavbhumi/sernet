import { AdminGuard } from '@/components/admin/AdminGuard';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';
import { format } from 'date-fns';
import { RowActions } from '@/components/admin/RowActions';
import { Badge } from '@/components/ui/badge';

const emptyForm = {
  principal_contact_id: '', claim_period: '', product_category: '', gross_aum: 0,
  commission_rate: 0, claim_amount: 0, status: 'pending', received_date: '', reference_number: '', notes: '',
};

export default function AdminCommissionClaims() {
  const [rows, setRows] = useState<any[]>([]);
  const [principals, setPrincipals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const load = async () => {
    setLoading(true);
    const [{ data }, { data: contacts }] = await Promise.all([
      supabase.from('commission_claims').select('*, crm_contacts(full_name)').order('created_at', { ascending: false }),
      supabase.from('crm_contacts').select('id, full_name').eq('relationship_type', 'principal').order('full_name'),
    ]);
    setRows(data || []);
    setPrincipals(contacts || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    const payload = {
      ...form,
      gross_aum: Number(form.gross_aum),
      commission_rate: Number(form.commission_rate),
      claim_amount: Number(form.claim_amount),
      received_date: form.received_date || null,
    };
    const { error } = editing
      ? await supabase.from('commission_claims').update(payload).eq('id', editing)
      : await supabase.from('commission_claims').insert(payload);
    if (error) { toast.error(error.message); return; }
    toast.success(editing ? 'Claim updated' : 'Claim created');
    setDialogOpen(false); setEditing(null); setForm(emptyForm); load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this claim?')) return;
    await supabase.from('commission_claims').delete().eq('id', id);
    toast.success('Deleted'); load();
  };

  const openEdit = (row: any) => {
    setEditing(row.id);
    setForm({
      principal_contact_id: row.principal_contact_id, claim_period: row.claim_period,
      product_category: row.product_category || '', gross_aum: row.gross_aum, commission_rate: row.commission_rate,
      claim_amount: row.claim_amount, status: row.status, received_date: row.received_date || '',
      reference_number: row.reference_number || '', notes: row.notes || '',
    });
    setDialogOpen(true);
  };

  const calcClaim = () => {
    const amount = Number(form.gross_aum) * Number(form.commission_rate) / 100;
    setForm(p => ({ ...p, claim_amount: Math.round(amount * 100) / 100 }));
  };

  const statusColor = (s: string) => s === 'received' ? 'default' : s === 'submitted' ? 'secondary' : 'outline';

  return (
    <AdminGuard>
      <AdminLayout title="Commission Claims" subtitle="Track commissions receivable from principals">
        <div className="flex justify-end mb-4">
          <Button onClick={() => { setEditing(null); setForm(emptyForm); setDialogOpen(true); }}><Plus className="h-4 w-4 mr-2" />New Claim</Button>
        </div>

        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Principal</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Product</TableHead>
                <TableHead className="text-right">AUM (₹)</TableHead>
                <TableHead className="text-right">Rate %</TableHead>
                <TableHead className="text-right">Claim (₹)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">Loading…</TableCell></TableRow>
              ) : rows.length === 0 ? (
                <TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">No claims yet</TableCell></TableRow>
              ) : rows.map(r => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.crm_contacts?.full_name || '—'}</TableCell>
                  <TableCell>{r.claim_period}</TableCell>
                  <TableCell>{r.product_category || '—'}</TableCell>
                  <TableCell className="text-right">₹{Number(r.gross_aum).toLocaleString('en-IN')}</TableCell>
                  <TableCell className="text-right">{r.commission_rate}%</TableCell>
                  <TableCell className="text-right font-semibold">₹{Number(r.claim_amount).toLocaleString('en-IN')}</TableCell>
                  <TableCell><Badge variant={statusColor(r.status)}>{r.status}</Badge></TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" onClick={() => openEdit(r)}><Pencil className="h-4 w-4" /></Button>
                      <Button size="icon" variant="ghost" onClick={() => handleDelete(r.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>{editing ? 'Edit Claim' : 'New Claim'}</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Principal</Label>
                <Select value={form.principal_contact_id || "none"} onValueChange={v => setForm(p => ({ ...p, principal_contact_id: v === "none" ? "" : v }))}>
                  <SelectTrigger><SelectValue placeholder="Select principal" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Select…</SelectItem>
                    {principals.map(p => <SelectItem key={p.id} value={p.id}>{p.full_name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Claim Period</Label><Input value={form.claim_period} onChange={e => setForm(p => ({ ...p, claim_period: e.target.value }))} placeholder="e.g., 2026-Q1" /></div>
                <div><Label>Product Category</Label><Input value={form.product_category} onChange={e => setForm(p => ({ ...p, product_category: e.target.value }))} placeholder="e.g., Mutual Funds" /></div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div><Label>Gross AUM (₹)</Label><Input type="number" value={form.gross_aum} onChange={e => setForm(p => ({ ...p, gross_aum: Number(e.target.value) }))} onBlur={calcClaim} /></div>
                <div><Label>Commission %</Label><Input type="number" value={form.commission_rate} onChange={e => setForm(p => ({ ...p, commission_rate: Number(e.target.value) }))} onBlur={calcClaim} /></div>
                <div><Label>Claim (₹)</Label><Input type="number" value={form.claim_amount} onChange={e => setForm(p => ({ ...p, claim_amount: Number(e.target.value) }))} /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Status</Label>
                  <Select value={form.status} onValueChange={v => setForm(p => ({ ...p, status: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="submitted">Submitted</SelectItem>
                      <SelectItem value="received">Received</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div><Label>Received Date</Label><Input type="date" value={form.received_date} onChange={e => setForm(p => ({ ...p, received_date: e.target.value }))} /></div>
              </div>
              <div><Label>Reference #</Label><Input value={form.reference_number} onChange={e => setForm(p => ({ ...p, reference_number: e.target.value }))} /></div>
              <div><Label>Notes</Label><Textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} rows={2} /></div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleSave} disabled={!form.principal_contact_id || !form.claim_period}>Save</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </AdminLayout>
    </AdminGuard>
  );
}
