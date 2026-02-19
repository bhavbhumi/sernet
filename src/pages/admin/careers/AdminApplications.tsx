
import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Eye, Trash2, Search, Download } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface Application {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  preferred_role: string;
  cover_note: string;
  resume_url: string;
  status: string;
  applied_at: string;
  notes: string;
}

export default function AdminApplications() {
  const { toast } = useToast();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selected, setSelected] = useState<Application | null>(null);

  const fetchApplications = async () => {
    setLoading(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await (supabase.from('job_applications') as any).select('*').order('applied_at', { ascending: false });
    setApplications(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchApplications(); }, []);

  const updateStatus = async (id: string, status: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from('job_applications') as any).update({ status }).eq('id', id);
    toast({ title: `Application marked as ${status}` });
    fetchApplications();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this application?')) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from('job_applications') as any).delete().eq('id', id);
    fetchApplications();
    setSelected(null);
  };

  const filtered = applications.filter(a => {
    const matchSearch = a.full_name.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase()) ||
      (a.preferred_role ?? '').toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || a.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const statusColors: Record<string, string> = {
    new: 'bg-blue-500/10 text-blue-600',
    reviewing: 'bg-amber-500/10 text-amber-600',
    shortlisted: 'bg-emerald-500/10 text-emerald-600',
    rejected: 'bg-destructive/10 text-destructive',
    hired: 'bg-primary/10 text-primary',
  };

  return (
    <AdminLayout
      title="Job Applications"
      subtitle="Review and manage applications submitted through the careers page"
    >
      <div className="flex gap-3 mb-5 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by name, email, role..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="reviewing">Reviewing</SelectItem>
            <SelectItem value="shortlisted">Shortlisted</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="hired">Hired</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Applicant</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground w-36">Role Applied</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground w-28">Applied</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground w-28">Status</th>
                <th className="px-4 py-3 w-4" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                Array(4).fill(0).map((_, i) => <tr key={i}><td colSpan={5} className="px-4 py-3"><div className="h-4 bg-muted animate-pulse rounded" /></td></tr>)
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-12 text-center text-muted-foreground">No applications found.</td></tr>
              ) : filtered.map(app => (
                <tr key={app.id} className="hover:bg-muted/20">
                  <td className="px-4 py-3">
                    <p className="font-medium text-foreground">{app.full_name}</p>
                    <p className="text-xs text-muted-foreground">{app.email} · {app.phone}</p>
                    {/* Horizontal action bar */}
                    <div className="flex items-center gap-0.5 mt-1.5">
                      <Button variant="ghost" size="sm" className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground gap-1" onClick={() => setSelected(app)}>
                        <Eye className="h-3 w-3" /> View
                      </Button>
                      <Button variant="ghost" size="sm" className="h-6 px-2 text-xs text-destructive hover:text-destructive gap-1" onClick={() => handleDelete(app.id)}>
                        <Trash2 className="h-3 w-3" /> Delete
                      </Button>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{app.preferred_role || '—'}</td>
                  <td className="px-4 py-3 text-muted-foreground">{new Date(app.applied_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[app.status] ?? 'bg-muted text-muted-foreground'}`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 w-4" />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Application — {selected?.full_name}</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">Email:</span> {selected.email}</div>
                <div><span className="text-muted-foreground">Phone:</span> {selected.phone || '—'}</div>
                <div><span className="text-muted-foreground">Role:</span> {selected.preferred_role || '—'}</div>
                <div><span className="text-muted-foreground">Applied:</span> {new Date(selected.applied_at).toLocaleDateString()}</div>
              </div>
              {selected.cover_note && (
                <div>
                  <p className="text-sm font-medium mb-1">Cover Note</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{selected.cover_note}</p>
                </div>
              )}
              {selected.resume_url && (
                <a href={selected.resume_url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-muted rounded-lg text-sm hover:bg-muted/80 transition-colors">
                  <Download className="h-4 w-4" /> Download Resume
                </a>
              )}
              <div>
                <p className="text-sm font-medium mb-2">Update Status</p>
                <div className="flex flex-wrap gap-2">
                  {['new', 'reviewing', 'shortlisted', 'rejected', 'hired'].map(s => (
                    <Button
                      key={s}
                      size="sm"
                      variant={selected.status === s ? 'default' : 'outline'}
                      onClick={() => { updateStatus(selected.id, s); setSelected({ ...selected, status: s }); }}
                      className="capitalize"
                    >
                      {s}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
