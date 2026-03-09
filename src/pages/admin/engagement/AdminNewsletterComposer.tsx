
import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Pencil, Send, Clock, Eye, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { RowActions } from '@/components/admin/RowActions';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface Newsletter {
  id: string;
  subject: string;
  body: string | null;
  preview_text: string | null;
  category: string;
  target_preferences: string[];
  status: string;
  scheduled_at: string | null;
  sent_at: string | null;
  recipient_count: number;
  created_at: string;
  updated_at: string;
}

const CATEGORIES = ['general', 'market-update', 'research', 'promotion', 'announcement'];
const PREFERENCE_OPTIONS = ['resources', 'articles', 'promotion'];
const STATUSES = ['draft', 'scheduled', 'sent'];

const emptyForm = {
  subject: '',
  body: '',
  preview_text: '',
  category: 'general',
  target_preferences: [] as string[],
  scheduled_at: '',
};

const db = () => supabase.from('newsletters' as any) as any;

const AdminNewsletterComposer = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<Newsletter[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewItem, setPreviewItem] = useState<Newsletter | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const PAGE_SIZE = 25;

  const fetchItems = async () => {
    setLoading(true);
    let query = db().select('*', { count: 'exact' }).order('created_at', { ascending: false });
    if (filter !== 'all') query = query.eq('status', filter);
    const from = (page - 1) * PAGE_SIZE;
    query = query.range(from, from + PAGE_SIZE - 1);
    const { data, count, error } = await query;
    if (!error) {
      setItems(data || []);
      setTotal(count || 0);
    }
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, [filter, page]);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (item: Newsletter) => {
    setEditingId(item.id);
    setForm({
      subject: item.subject,
      body: item.body || '',
      preview_text: item.preview_text || '',
      category: item.category,
      target_preferences: item.target_preferences || [],
      scheduled_at: item.scheduled_at ? item.scheduled_at.slice(0, 16) : '',
    });
    setDialogOpen(true);
  };

  const handleSave = async (saveStatus: 'draft' | 'scheduled') => {
    if (!form.subject.trim()) {
      toast({ title: 'Subject is required', variant: 'destructive' });
      return;
    }
    if (saveStatus === 'scheduled' && !form.scheduled_at) {
      toast({ title: 'Please set a schedule date/time', variant: 'destructive' });
      return;
    }

    const payload: any = {
      subject: form.subject,
      body: form.body || null,
      preview_text: form.preview_text || null,
      category: form.category,
      target_preferences: form.target_preferences,
      status: saveStatus,
      scheduled_at: form.scheduled_at ? new Date(form.scheduled_at).toISOString() : null,
      updated_at: new Date().toISOString(),
    };

    let error;
    if (editingId) {
      ({ error } = await db().update(payload).eq('id', editingId));
    } else {
      ({ error } = await db().insert(payload));
    }

    if (error) {
      toast({ title: 'Error saving newsletter', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: editingId ? 'Newsletter updated' : 'Newsletter created' });
      setDialogOpen(false);
      fetchItems();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this newsletter draft?')) return;
    const { error } = await db().delete().eq('id', id);
    if (!error) {
      toast({ title: 'Newsletter deleted' });
      fetchItems();
    }
  };

  const togglePreference = (pref: string) => {
    setForm(prev => ({
      ...prev,
      target_preferences: prev.target_preferences.includes(pref)
        ? prev.target_preferences.filter(p => p !== pref)
        : [...prev.target_preferences, pref],
    }));
  };

  const statusColor = (s: string) => {
    if (s === 'draft') return 'secondary';
    if (s === 'scheduled') return 'default';
    if (s === 'sent') return 'outline';
    return 'secondary';
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);

  const statCounts = {
    all: total,
    draft: items.filter(i => i.status === 'draft').length,
    scheduled: items.filter(i => i.status === 'scheduled').length,
    sent: items.filter(i => i.status === 'sent').length,
  };

  return (
    <AdminLayout title="Newsletter Composer" subtitle="Compose, preview, and schedule newsletters for subscribers">
      {/* Stats */}
      <div className="flex flex-wrap gap-2 mb-6">
        {STATUSES.map(s => (
          <button
            key={s}
            onClick={() => { setFilter(s); setPage(1); }}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${filter === s ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
        <button
          onClick={() => { setFilter('all'); setPage(1); }}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${filter === 'all' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
        >
          All ({total})
        </button>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-muted-foreground">{total} newsletter{total !== 1 ? 's' : ''}</p>
        <Button onClick={openCreate} size="sm"><Plus className="h-4 w-4 mr-1" /> Compose</Button>
      </div>

      {/* Table */}
      <div className="border border-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Subject</th>
              <th className="text-left px-4 py-3 font-medium w-[120px]">Category</th>
              <th className="text-left px-4 py-3 font-medium w-[100px]">Status</th>
              <th className="text-left px-4 py-3 font-medium w-[160px]">Scheduled</th>
              <th className="text-left px-4 py-3 font-medium w-[140px]">Created</th>
              <th className="text-right px-4 py-3 font-medium w-[120px]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">Loading…</td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">No newsletters yet. Click "Compose" to create one.</td></tr>
            ) : items.map(item => (
              <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3">
                  <div className="font-medium">{item.subject}</div>
                  {item.preview_text && <div className="text-xs text-muted-foreground mt-0.5 truncate max-w-[300px]">{item.preview_text}</div>}
                </td>
                <td className="px-4 py-3"><Badge variant="outline" className="text-xs">{item.category}</Badge></td>
                <td className="px-4 py-3"><Badge variant={statusColor(item.status)}>{item.status}</Badge></td>
                <td className="px-4 py-3 text-muted-foreground">
                  {item.scheduled_at ? format(new Date(item.scheduled_at), 'MMM d, yyyy HH:mm') : '—'}
                </td>
                <td className="px-4 py-3 text-muted-foreground">{format(new Date(item.created_at), 'MMM d, yyyy')}</td>
                <td className="px-4 py-3 text-right">
                  <RowActions actions={[
                    { label: 'View', icon: <Eye className="h-3.5 w-3.5" />, onClick: () => { setPreviewItem(item); setPreviewOpen(true); } },
                    { label: 'Edit', onClick: () => openEdit(item), hidden: item.status === 'sent' },
                    { label: 'Delete', onClick: () => handleDelete(item.id), variant: 'destructive', separator: true, hidden: item.status !== 'draft' },
                  ]} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-xs text-muted-foreground">Page {page} of {totalPages}</p>
          <div className="flex gap-1">
            <Button variant="outline" size="icon" className="h-8 w-8" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Compose / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Newsletter' : 'Compose Newsletter'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <Label>Subject *</Label>
              <Input value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} placeholder="Weekly Market Roundup – Jan 2026" />
            </div>
            <div>
              <Label>Preview Text</Label>
              <Input value={form.preview_text} onChange={e => setForm(f => ({ ...f, preview_text: e.target.value }))} placeholder="Short text shown in inbox preview…" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Category</Label>
                <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Schedule Date/Time</Label>
                <Input type="datetime-local" value={form.scheduled_at} onChange={e => setForm(f => ({ ...f, scheduled_at: e.target.value }))} />
              </div>
            </div>
            <div>
              <Label>Target Subscriber Preferences</Label>
              <div className="flex flex-wrap gap-2 mt-1">
                {PREFERENCE_OPTIONS.map(p => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => togglePreference(p)}
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                      form.target_preferences.includes(p)
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-background text-muted-foreground border-border hover:border-primary/50'
                    }`}
                  >
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Leave empty to send to all subscribers</p>
            </div>
            <div>
              <Label>Body</Label>
              <Textarea
                value={form.body}
                onChange={e => setForm(f => ({ ...f, body: e.target.value }))}
                placeholder="Write your newsletter content here… (HTML supported)"
                className="min-h-[200px] font-mono text-xs"
              />
            </div>
            <div className="flex gap-2 justify-end pt-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button variant="secondary" onClick={() => handleSave('draft')}>
                <Pencil className="h-4 w-4 mr-1" /> Save Draft
              </Button>
              <Button onClick={() => handleSave('scheduled')}>
                <Clock className="h-4 w-4 mr-1" /> Schedule
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Newsletter Preview</DialogTitle>
          </DialogHeader>
          {previewItem && (
            <div className="space-y-4 mt-2">
              <div className="border border-border rounded-lg p-4 bg-muted/30">
                <div className="text-xs text-muted-foreground mb-1">Subject</div>
                <div className="font-semibold text-lg">{previewItem.subject}</div>
                {previewItem.preview_text && (
                  <div className="text-sm text-muted-foreground mt-1">{previewItem.preview_text}</div>
                )}
              </div>
              <div className="flex gap-2">
                <Badge variant="outline">{previewItem.category}</Badge>
                <Badge variant={statusColor(previewItem.status)}>{previewItem.status}</Badge>
                {previewItem.scheduled_at && (
                  <Badge variant="secondary">
                    <Calendar className="h-3 w-3 mr-1" />
                    {format(new Date(previewItem.scheduled_at), 'MMM d, yyyy HH:mm')}
                  </Badge>
                )}
              </div>
              {previewItem.target_preferences?.length > 0 && (
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Target Preferences</div>
                  <div className="flex gap-1">
                    {previewItem.target_preferences.map(p => <Badge key={p} variant="outline" className="text-xs">{p}</Badge>)}
                  </div>
                </div>
              )}
              <div className="border border-border rounded-lg p-4">
                <div className="text-xs text-muted-foreground mb-2">Body</div>
                {previewItem.body ? (
                  <div className="prose prose-sm max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: previewItem.body }} />
                ) : (
                  <p className="text-muted-foreground italic">No body content</p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminNewsletterComposer;
