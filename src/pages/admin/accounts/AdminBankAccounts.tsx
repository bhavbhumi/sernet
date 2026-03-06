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

const EMPTY = { account_name: '', bank_name: '', account_number: '', ifsc_code: '', branch: '', account_type: 'current', is_primary: false, is_active: true };

export const BankAccountsContent = () => {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY);

  const { data: accounts = [], isLoading } = useQuery({
    queryKey: ['bank-accounts'],
    queryFn: async () => {
      const { data, error } = await supabase.from('bank_accounts').select('*').order('created_at');
      if (error) throw error;
      return data || [];
    },
  });

  const save = useMutation({
    mutationFn: async () => {
      if (editing) {
        const { error } = await supabase.from('bank_accounts').update(form).eq('id', editing);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('bank_accounts').insert(form);
        if (error) throw error;
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['bank-accounts'] }); toast.success('Bank account saved'); setOpen(false); setEditing(null); setForm(EMPTY); },
    onError: (e: any) => toast.error(e.message),
  });

  const edit = (r: any) => { setEditing(r.id); setForm({ account_name: r.account_name, bank_name: r.bank_name, account_number: r.account_number, ifsc_code: r.ifsc_code || '', branch: r.branch || '', account_type: r.account_type, is_primary: r.is_primary, is_active: r.is_active }); setOpen(true); };

  return (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Bank Accounts</CardTitle>
          <Dialog open={open} onOpenChange={o => { setOpen(o); if (!o) { setEditing(null); setForm(EMPTY); } }}>
            <DialogTrigger asChild><Button size="sm"><Plus className="h-4 w-4 mr-1" />Add Account</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>{editing ? 'Edit' : 'Add'} Bank Account</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div><Label>Account Name *</Label><Input value={form.account_name} onChange={e => setForm(p => ({ ...p, account_name: e.target.value }))} placeholder="e.g. SERNET Main Account" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Bank Name *</Label><Input value={form.bank_name} onChange={e => setForm(p => ({ ...p, bank_name: e.target.value }))} /></div>
                  <div><Label>Account Number *</Label><Input value={form.account_number} onChange={e => setForm(p => ({ ...p, account_number: e.target.value }))} /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>IFSC Code</Label><Input value={form.ifsc_code} onChange={e => setForm(p => ({ ...p, ifsc_code: e.target.value }))} /></div>
                  <div><Label>Branch</Label><Input value={form.branch} onChange={e => setForm(p => ({ ...p, branch: e.target.value }))} /></div>
                </div>
                <div>
                  <Label>Account Type</Label>
                  <Select value={form.account_type} onValueChange={v => setForm(p => ({ ...p, account_type: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {['current', 'savings', 'overdraft'].map(t => <SelectItem key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2"><Switch checked={form.is_primary} onCheckedChange={v => setForm(p => ({ ...p, is_primary: v }))} /><Label>Primary Account</Label></div>
                  <div className="flex items-center gap-2"><Switch checked={form.is_active} onCheckedChange={v => setForm(p => ({ ...p, is_active: v }))} /><Label>Active</Label></div>
                </div>
                <Button className="w-full" onClick={() => save.mutate()} disabled={!form.account_name || !form.bank_name || !form.account_number || save.isPending}>{editing ? 'Update' : 'Create'}</Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {isLoading ? <p className="text-muted-foreground text-sm">Loading...</p> : accounts.length === 0 ? <p className="text-muted-foreground text-sm">No bank accounts added.</p> : (
            <Table>
              <TableHeader><TableRow><TableHead>Account Name</TableHead><TableHead>Bank</TableHead><TableHead>A/C No.</TableHead><TableHead>IFSC</TableHead><TableHead>Type</TableHead><TableHead>Status</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
              <TableBody>
                {accounts.map((a: any) => (
                  <TableRow key={a.id}>
                    <TableCell className="font-medium">{a.account_name} {a.is_primary && <Badge variant="outline" className="ml-1 text-[10px]">Primary</Badge>}</TableCell>
                    <TableCell>{a.bank_name}</TableCell>
                    <TableCell className="font-mono text-xs">••••{a.account_number.slice(-4)}</TableCell>
                    <TableCell className="font-mono text-xs">{a.ifsc_code || '—'}</TableCell>
                    <TableCell className="capitalize">{a.account_type}</TableCell>
                    <TableCell><Badge variant={a.is_active ? 'default' : 'secondary'}>{a.is_active ? 'Active' : 'Inactive'}</Badge></TableCell>
                    <TableCell><Button size="icon" variant="ghost" onClick={() => edit(a)}><Pencil className="h-3.5 w-3.5" /></Button></TableCell>
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

export default AdminBankAccounts;
