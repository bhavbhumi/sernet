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
import { Plus, FileText, ExternalLink, Trash2 } from 'lucide-react';

const DOC_TYPES = [
  { value: 'offer_letter', label: 'Offer Letter' },
  { value: 'appointment_letter', label: 'Appointment Letter' },
  { value: 'id_proof', label: 'ID Proof' },
  { value: 'address_proof', label: 'Address Proof' },
  { value: 'pan_card', label: 'PAN Card' },
  { value: 'aadhaar', label: 'Aadhaar Card' },
  { value: 'resume', label: 'Resume/CV' },
  { value: 'experience_letter', label: 'Experience Letter' },
  { value: 'relieving_letter', label: 'Relieving Letter' },
  { value: 'salary_slip', label: 'Salary Slip' },
  { value: 'increment_letter', label: 'Increment Letter' },
  { value: 'other', label: 'Other' },
];

export default function AdminDocumentVault() {
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [empFilter, setEmpFilter] = useState('all');

  const { data: docs = [], isLoading } = useQuery({
    queryKey: ['employee-documents', empFilter],
    queryFn: async () => {
      let q = supabase
        .from('employee_documents')
        .select('*, employees!employee_documents_employee_id_fkey(full_name, employee_code, department)')
        .order('created_at', { ascending: false });
      if (empFilter !== 'all') q = q.eq('employee_id', empFilter);
      const { data } = await q;
      return data || [];
    },
  });

  const { data: employees = [] } = useQuery({
    queryKey: ['employees-list-docs'],
    queryFn: async () => {
      const { data } = await supabase.from('employees').select('id, full_name, employee_code').eq('status', 'active').order('full_name');
      return data || [];
    },
  });

  const [form, setForm] = useState({ employee_id: '', document_type: 'other', title: '', file_url: '', notes: '' });

  const createMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from('employee_documents').insert({
        employee_id: form.employee_id,
        document_type: form.document_type,
        title: form.title,
        file_url: form.file_url || null,
        notes: form.notes || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Document added');
      queryClient.invalidateQueries({ queryKey: ['employee-documents'] });
      setDialogOpen(false);
      setForm({ employee_id: '', document_type: 'other', title: '', file_url: '', notes: '' });
    },
    onError: (e: any) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('employee_documents').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Document deleted');
      queryClient.invalidateQueries({ queryKey: ['employee-documents'] });
    },
  });

  return (
    <AdminLayout
      title="Document Vault"
      subtitle="Employee documents and records"
      actions={
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="h-4 w-4 mr-1.5" /> Add Document</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Employee Document</DialogTitle></DialogHeader>
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
              <div>
                <Label>Document Type</Label>
                <Select value={form.document_type} onValueChange={v => setForm(p => ({ ...p, document_type: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {DOC_TYPES.map(d => <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Title</Label>
                <Input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="e.g. PAN Card - Front" />
              </div>
              <div>
                <Label>File URL (optional)</Label>
                <Input value={form.file_url} onChange={e => setForm(p => ({ ...p, file_url: e.target.value }))} placeholder="https://..." />
              </div>
              <div>
                <Label>Notes (optional)</Label>
                <Input value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} />
              </div>
              <Button className="w-full" onClick={() => createMutation.mutate()} disabled={!form.employee_id || !form.title || createMutation.isPending}>
                Add Document
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      }
    >
      <div className="flex items-center gap-3 mb-6">
        <Select value={empFilter} onValueChange={setEmpFilter}>
          <SelectTrigger className="w-[200px]"><SelectValue placeholder="Filter by employee" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Employees</SelectItem>
            {employees.map((e: any) => <SelectItem key={e.id} value={e.id}>{e.full_name}</SelectItem>)}
          </SelectContent>
        </Select>
        <Badge variant="secondary">{docs.length} documents</Badge>
      </div>

      <div className="border border-border rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Added</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Loading...</TableCell></TableRow>
            ) : docs.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No documents found.</TableCell></TableRow>
            ) : docs.map((d: any) => {
              const emp = d.employees as any;
              const typeLabel = DOC_TYPES.find(t => t.value === d.document_type)?.label || d.document_type;
              return (
                <TableRow key={d.id}>
                  <TableCell className="font-medium">{emp?.full_name}</TableCell>
                  <TableCell><Badge variant="outline">{typeLabel}</Badge></TableCell>
                  <TableCell>{d.title}{d.notes && <span className="text-xs text-muted-foreground ml-2">({d.notes})</span>}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{format(new Date(d.created_at), 'dd MMM yyyy')}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {d.file_url && (
                        <Button variant="ghost" size="sm" asChild><a href={d.file_url} target="_blank" rel="noopener noreferrer"><ExternalLink className="h-3.5 w-3.5" /></a></Button>
                      )}
                      <Button variant="ghost" size="sm" className="text-destructive" onClick={() => deleteMutation.mutate(d.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </AdminLayout>
  );
}
