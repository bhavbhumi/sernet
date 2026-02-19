
import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, BarChart2, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface PollOption { id?: string; label: string; sort_order: number; }
interface Poll {
  id: string;
  question: string;
  category: string;
  status: string;
  ends_at: string | null;
  created_at: string;
}

export default function AdminPolls() {
  const { toast } = useToast();
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<Poll | null>(null);
  const [form, setForm] = useState({ question: '', category: 'General', status: 'active', ends_at: '' });
  const [options, setOptions] = useState<PollOption[]>([{ label: '', sort_order: 0 }, { label: '', sort_order: 1 }]);
  const [saving, setSaving] = useState(false);
  const [resultsFor, setResultsFor] = useState<Poll | null>(null);
  const [voteData, setVoteData] = useState<{ label: string; votes: number }[]>([]);

  const fetchPolls = async () => {
    setLoading(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await (supabase.from('polls') as any).select('*').order('created_at', { ascending: false });
    setPolls(data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchPolls(); }, []);

  const openNew = () => {
    setEditItem(null);
    setForm({ question: '', category: 'General', status: 'active', ends_at: '' });
    setOptions([{ label: '', sort_order: 0 }, { label: '', sort_order: 1 }]);
    setDialogOpen(true);
  };

  const openEdit = async (poll: Poll) => {
    setEditItem(poll);
    setForm({ question: poll.question, category: poll.category, status: poll.status, ends_at: poll.ends_at ?? '' });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await (supabase.from('poll_options') as any).select('*').eq('poll_id', poll.id).order('sort_order');
    setOptions(data ?? []);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.question || options.filter(o => o.label).length < 2) {
      toast({ title: 'Validation error', description: 'Question and at least 2 options are required.', variant: 'destructive' });
      return;
    }
    setSaving(true);

    let pollId = editItem?.id;
    if (editItem) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase.from('polls') as any).update(form).eq('id', editItem.id);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase.from('poll_options') as any).delete().eq('poll_id', editItem.id);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data } = await (supabase.from('polls') as any).insert([form]).select().single();
      pollId = data?.id;
    }

    if (pollId) {
      const validOptions = options.filter(o => o.label).map((o, i) => ({ poll_id: pollId, label: o.label, sort_order: i }));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase.from('poll_options') as any).insert(validOptions);
    }

    toast({ title: editItem ? 'Poll updated' : 'Poll created' });
    setSaving(false);
    setDialogOpen(false);
    fetchPolls();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this poll and all votes?')) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from('polls') as any).delete().eq('id', id);
    fetchPolls();
  };

  const viewResults = async (poll: Poll) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: optData } = await (supabase.from('poll_options') as any).select('id, label').eq('poll_id', poll.id);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: voteData } = await (supabase.from('poll_votes') as any).select('option_id').eq('poll_id', poll.id);
    const voteCounts: Record<string, number> = {};
    (voteData ?? []).forEach((v: { option_id: string }) => { voteCounts[v.option_id] = (voteCounts[v.option_id] ?? 0) + 1; });
    const results = (optData ?? []).map((o: { id: string; label: string }) => ({ label: o.label, votes: voteCounts[o.id] ?? 0 }));
    setVoteData(results);
    setResultsFor(poll);
  };

  return (
    <AdminLayout
      title="Polls"
      subtitle="Create and manage community polls — track results in real-time"
      actions={<Button onClick={openNew} size="sm"><Plus className="h-4 w-4 mr-1.5" /> New Poll</Button>}
    >
      <div className="space-y-3">
        {loading ? (
          Array(3).fill(0).map((_, i) => <div key={i} className="h-20 bg-muted animate-pulse rounded-xl" />)
        ) : polls.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground">No polls yet. Create one!</div>
        ) : polls.map(poll => (
          <div key={poll.id} className="bg-card border border-border rounded-xl p-5 flex gap-4 items-start">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <Badge variant="secondary">{poll.category}</Badge>
                <Badge variant={poll.status === 'active' ? 'default' : 'secondary'}>{poll.status}</Badge>
              </div>
              <p className="font-medium text-foreground">{poll.question}</p>
              {poll.ends_at && <p className="text-xs text-muted-foreground mt-1">Ends: {new Date(poll.ends_at).toLocaleDateString()}</p>}
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => viewResults(poll)} title="View Results"><BarChart2 className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(poll)}><Pencil className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDelete(poll.id)}><Trash2 className="h-4 w-4" /></Button>
            </div>
          </div>
        ))}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editItem ? 'Edit Poll' : 'New Poll'}</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-2">
            <div className="space-y-1.5">
              <Label>Question *</Label>
              <Input placeholder="What would you like to ask?" value={form.question} onChange={e => setForm(f => ({ ...f, question: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Category</Label>
                <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {['Markets', 'Platform', 'Education', 'Habits', 'General'].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Status</Label>
                <Select value={form.status} onValueChange={v => setForm(f => ({ ...f, status: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>End Date (optional)</Label>
              <Input type="date" value={form.ends_at} onChange={e => setForm(f => ({ ...f, ends_at: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Options (min. 2)</Label>
                <Button variant="ghost" size="sm" onClick={() => setOptions(o => [...o, { label: '', sort_order: o.length }])}>
                  <Plus className="h-3.5 w-3.5 mr-1" /> Add option
                </Button>
              </div>
              {options.map((opt, i) => (
                <div key={i} className="flex gap-2">
                  <Input placeholder={`Option ${i + 1}`} value={opt.label} onChange={e => setOptions(o => o.map((x, j) => j === i ? { ...x, label: e.target.value } : x))} />
                  {options.length > 2 && (
                    <Button variant="ghost" size="icon" className="shrink-0" onClick={() => setOptions(o => o.filter((_, j) => j !== i))}><X className="h-4 w-4" /></Button>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : editItem ? 'Update' : 'Create'}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Results Dialog */}
      <Dialog open={!!resultsFor} onOpenChange={() => setResultsFor(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Poll Results</DialogTitle></DialogHeader>
          {resultsFor && (
            <div className="space-y-4">
              <p className="text-sm font-medium text-foreground">{resultsFor.question}</p>
              <div className="space-y-2">
                {voteData.map((opt, i) => {
                  const total = voteData.reduce((sum, o) => sum + o.votes, 0);
                  const pct = total ? Math.round((opt.votes / total) * 100) : 0;
                  return (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{opt.label}</span>
                        <span className="font-medium">{opt.votes} votes ({pct}%)</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-muted-foreground">Total votes: {voteData.reduce((s, o) => s + o.votes, 0)}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
