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
import { Plus, Banknote } from 'lucide-react';
import { RowActions } from '@/components/admin/RowActions';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

const emptyForm = {
  partner_contact_id: '', payout_period: '', gross_revenue: 0, share_pct: 0,
  payout_amount: 0, status: 'pending', paid_date: '', reference_number: '', notes: '',
};

export default function AdminPartnerPayouts() {
  const [rows, setRows] = useState<any[]>([]);
  const [partners, setPartners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const load = async () => {
    setLoading(true);
    const [{ data }, { data: contacts }] = await Promise.all([
      supabase.from('partner_payouts').select('*, crm_contacts(full_name)').order('created_at', { ascending: false }),
      supabase.from('crm_contacts').select('id, full_name').eq('relationship_type', 'partner').order('full_name'),
    ]);
    setRows(data || []);
    setPartners(contacts || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    const payload = {
      ...form,
      gross_revenue: Number(form.gross_revenue),
      share_pct: Number(form.share_pct),
      payout_amount: Number(form.payout_amount),
      paid_date: form.paid_date || null,
    };
    const { error } = editing
      ? await supabase.from('partner_payouts').update(payload).eq('id', editing)
      : await supabase.from('partner_payouts').insert(payload);
    if (error) { toast.error(error.message); return; }
    toast.success(editing ? 'Payout updated' : 'Payout created');
    setDialogOpen(false); setEditing(null); setForm(emptyForm); load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this payout record?')) return;
    await supabase.from('partner_payouts').delete().eq('id', id);
    toast.success('Deleted'); load();
  };

  const openEdit = (row: any) => {
    setEditing(row.id);
    setForm({
      partner_contact_id: row.partner_contact_id, payout_period: row.payout_period,
      gross_revenue: row.gross_revenue, share_pct: row.share_pct, payout_amount: row.payout_amount,
      status: row.status, paid_date: row.paid_date || '', reference_number: row.reference_number || '', notes: row.notes || '',
    });
    setDialogOpen(true);
  };

  const calcPayout = () => {
    const amount = Number(form.gross_revenue) * Number(form.share_pct) / 100;
    setForm(p => ({ ...p, payout_amount: Math.round(amount * 100) / 100 }));
  };

  const statusColor = (s: string) => s === 'paid' ? 'default' : s === 'approved' ? 'secondary' : 'outline';

  return (
    <AdminGuard>
      <AdminLayout title="Partner Payouts" subtitle="Revenue-share disbursements to partners & associates">
        <div className="flex justify-end mb-4">
          <Button onClick={() => { setEditing(null); setForm(emptyForm); setDialogOpen(true); }}><Plus className="h-4 w-4 mr-2" />New Payout</Button>
        </div>

        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Partner</TableHead>
                <TableHead>Period</TableHead>
                <TableHead className="text-right">Gross Revenue</TableHead>
                <TableHead className="text-right">Share %</TableHead>
                <TableHead className="text-right">Payout</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Paid Date</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">Loading…</TableCell></TableRow>
              ) : rows.length === 0 ? (
                <TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">No payouts yet</TableCell></TableRow>
              ) : rows.map(r => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.crm_contacts?.full_name || '—'}</TableCell>
                  <TableCell>{r.payout_period}</TableCell>
                  <TableCell className="text-right">₹{Number(r.gross_revenue).toLocaleString('en-IN')}</TableCell>
                  <TableCell className="text-right">{r.share_pct}%</TableCell>
                  <TableCell className="text-right font-semibold">₹{Number(r.payout_amount).toLocaleString('en-IN')}</TableCell>
                  <TableCell><Badge variant={statusColor(r.status)}>{r.status}</Badge></TableCell>
                  <TableCell>{r.paid_date ? format(new Date(r.paid_date), 'dd MMM yyyy') : '—'}</TableCell>
                  <TableCell>
                    <RowActions actions={[
                      { label: 'Edit', onClick: () => openEdit(r) },
                      { label: 'Delete', onClick: () => handleDelete(r.id), variant: 'destructive', separator: true },
                    ]} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>{editing ? 'Edit Payout' : 'New Payout'}</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Partner</Label>
                <Select value={form.partner_contact_id || "none"} onValueChange={v => setForm(p => ({ ...p, partner_contact_id: v === "none" ? "" : v }))}>
                  <SelectTrigger><SelectValue placeholder="Select partner" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Select…</SelectItem>
                    {partners.map(p => <SelectItem key={p.id} value={p.id}>{p.full_name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Payout Period</Label><Input value={form.payout_period} onChange={e => setForm(p => ({ ...p, payout_period: e.target.value }))} placeholder="e.g., 2026-03" /></div>
              <div className="grid grid-cols-3 gap-3">
                <div><Label>Gross Revenue (₹)</Label><Input type="number" value={form.gross_revenue} onChange={e => setForm(p => ({ ...p, gross_revenue: Number(e.target.value) }))} onBlur={calcPayout} /></div>
                <div><Label>Share %</Label><Input type="number" value={form.share_pct} onChange={e => setForm(p => ({ ...p, share_pct: Number(e.target.value) }))} onBlur={calcPayout} /></div>
                <div><Label>Payout (₹)</Label><Input type="number" value={form.payout_amount} onChange={e => setForm(p => ({ ...p, payout_amount: Number(e.target.value) }))} /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Status</Label>
                  <Select value={form.status} onValueChange={v => setForm(p => ({ ...p, status: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div><Label>Paid Date</Label><Input type="date" value={form.paid_date} onChange={e => setForm(p => ({ ...p, paid_date: e.target.value }))} /></div>
              </div>
              <div><Label>Reference #</Label><Input value={form.reference_number} onChange={e => setForm(p => ({ ...p, reference_number: e.target.value }))} /></div>
              <div><Label>Notes</Label><Textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} rows={2} /></div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleSave} disabled={!form.partner_contact_id || !form.payout_period}>Save</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </AdminLayout>
    </AdminGuard>
  );
}
