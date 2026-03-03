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
import { Plus, Pencil, Trash2, FileSignature } from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';

const emptyForm = {
  contact_id: '', agreement_type: 'client_agreement', title: '', status: 'draft',
  start_date: '', end_date: '', document_url: '', terms_summary: '', auto_renew: false,
};

const agreementTypes = [
  { value: 'client_agreement', label: 'Client Agreement' },
  { value: 'partner_mou', label: 'Partner MOU' },
  { value: 'distribution_agreement', label: 'Distribution Agreement' },
  { value: 'nda', label: 'NDA' },
  { value: 'service_agreement', label: 'Service Agreement' },
];

export default function AdminAgreements() {
  const [rows, setRows] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const load = async () => {
    setLoading(true);
    const [{ data }, { data: c }] = await Promise.all([
      supabase.from('agreements').select('*, crm_contacts(full_name, relationship_type)').order('created_at', { ascending: false }),
      supabase.from('crm_contacts').select('id, full_name, relationship_type').order('full_name'),
    ]);
    setRows(data || []);
    setContacts(c || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    const payload = {
      ...form,
      contact_id: form.contact_id || null,
      start_date: form.start_date || null,
      end_date: form.end_date || null,
      document_url: form.document_url || null,
      terms_summary: form.terms_summary || null,
    };
    const { error } = editing
      ? await supabase.from('agreements').update(payload).eq('id', editing)
      : await supabase.from('agreements').insert(payload);
    if (error) { toast.error(error.message); return; }
    toast.success(editing ? 'Agreement updated' : 'Agreement created');
    setDialogOpen(false); setEditing(null); setForm(emptyForm); load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this agreement?')) return;
    await supabase.from('agreements').delete().eq('id', id);
    toast.success('Deleted'); load();
  };

  const openEdit = (row: any) => {
    setEditing(row.id);
    setForm({
      contact_id: row.contact_id || '', agreement_type: row.agreement_type, title: row.title,
      status: row.status, start_date: row.start_date || '', end_date: row.end_date || '',
      document_url: row.document_url || '', terms_summary: row.terms_summary || '', auto_renew: row.auto_renew,
    });
    setDialogOpen(true);
  };

  const statusColor = (s: string) => {
    if (s === 'active') return 'default';
    if (s === 'expired' || s === 'terminated') return 'destructive';
    return 'outline';
  };

  const typeLabel = (t: string) => agreementTypes.find(a => a.value === t)?.label || t;

  return (
    <AdminGuard>
      <AdminLayout title="Agreements" subtitle="Manage client, partner & principal agreements">
        <div className="flex justify-end mb-4">
          <Button onClick={() => { setEditing(null); setForm(emptyForm); setDialogOpen(true); }}><Plus className="h-4 w-4 mr-2" />New Agreement</Button>
        </div>

        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Start</TableHead>
                <TableHead>End</TableHead>
                <TableHead>Auto-Renew</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">Loading…</TableCell></TableRow>
              ) : rows.length === 0 ? (
                <TableRow><TableCell colSpan={8} className="text-center py-8 text-muted-foreground">No agreements yet</TableCell></TableRow>
              ) : rows.map(r => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.title}</TableCell>
                  <TableCell>{typeLabel(r.agreement_type)}</TableCell>
                  <TableCell>{r.crm_contacts?.full_name || '—'}</TableCell>
                  <TableCell><Badge variant={statusColor(r.status)}>{r.status}</Badge></TableCell>
                  <TableCell>{r.start_date ? format(new Date(r.start_date), 'dd MMM yyyy') : '—'}</TableCell>
                  <TableCell>{r.end_date ? format(new Date(r.end_date), 'dd MMM yyyy') : '—'}</TableCell>
                  <TableCell>{r.auto_renew ? 'Yes' : 'No'}</TableCell>
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
            <DialogHeader><DialogTitle>{editing ? 'Edit Agreement' : 'New Agreement'}</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label>Title</Label><Input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="e.g., Advisory Services Agreement" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Type</Label>
                  <Select value={form.agreement_type} onValueChange={v => setForm(p => ({ ...p, agreement_type: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {agreementTypes.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Contact</Label>
                  <Select value={form.contact_id || "none"} onValueChange={v => setForm(p => ({ ...p, contact_id: v === "none" ? "" : v }))}>
                    <SelectTrigger><SelectValue placeholder="Select contact" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {contacts.map(c => <SelectItem key={c.id} value={c.id}>{c.full_name} ({c.relationship_type})</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label>Status</Label>
                  <Select value={form.status} onValueChange={v => setForm(p => ({ ...p, status: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                      <SelectItem value="terminated">Terminated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div><Label>Start Date</Label><Input type="date" value={form.start_date} onChange={e => setForm(p => ({ ...p, start_date: e.target.value }))} /></div>
                <div><Label>End Date</Label><Input type="date" value={form.end_date} onChange={e => setForm(p => ({ ...p, end_date: e.target.value }))} /></div>
              </div>
              <div><Label>Document URL</Label><Input value={form.document_url} onChange={e => setForm(p => ({ ...p, document_url: e.target.value }))} placeholder="Link to signed document" /></div>
              <div><Label>Terms Summary</Label><Textarea value={form.terms_summary} onChange={e => setForm(p => ({ ...p, terms_summary: e.target.value }))} rows={3} /></div>
              <div className="flex items-center gap-2">
                <Checkbox checked={form.auto_renew} onCheckedChange={v => setForm(p => ({ ...p, auto_renew: !!v }))} />
                <Label>Auto-renew</Label>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleSave} disabled={!form.title}>Save</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </AdminLayout>
    </AdminGuard>
  );
}
