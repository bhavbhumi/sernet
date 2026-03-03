import { AdminGuard } from '@/components/admin/AdminGuard';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Plus, Phone, Mail, Calendar, FileText, CheckCircle2, Clock, Users } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const ACTIVITY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  call: Phone, email: Mail, meeting: Users, note: FileText, task: CheckCircle2, follow_up: Clock,
};

const ACTIVITY_COLORS: Record<string, string> = {
  call: 'text-blue-500', email: 'text-purple-500', meeting: 'text-amber-500',
  note: 'text-muted-foreground', task: 'text-emerald-500', follow_up: 'text-orange-500',
};

export default function AdminCRMActivities() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<string>('all');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ activity_type: 'call', subject: '', description: '', outcome: '', due_date: '' });
  const [saving, setSaving] = useState(false);

  const { data: activities = [], isLoading } = useQuery({
    queryKey: ['crm-activities', filter],
    queryFn: async () => {
      let q = supabase
        .from('crm_activities')
        .select('*, crm_deals(title), crm_contacts(full_name)')
        .order('created_at', { ascending: false })
        .limit(100);
      if (filter !== 'all') q = q.eq('activity_type', filter as any);
      const { data, error } = await q;
      if (error) throw error;
      return data;
    },
  });

  const pending = activities.filter(a => !a.is_completed && a.due_date);
  const overdue = pending.filter(a => new Date(a.due_date!) < new Date());

  const handleCreate = async () => {
    if (!form.subject.trim()) { toast.error('Subject required'); return; }
    setSaving(true);
    try {
      const { error } = await supabase.from('crm_activities').insert({
        activity_type: form.activity_type as any,
        subject: form.subject,
        description: form.description || null,
        outcome: form.outcome || null,
        due_date: form.due_date || null,
      });
      if (error) throw error;
      toast.success('Activity logged');
      setDialogOpen(false);
      setForm({ activity_type: 'call', subject: '', description: '', outcome: '', due_date: '' });
      queryClient.invalidateQueries({ queryKey: ['crm-activities'] });
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  const markComplete = async (id: string) => {
    const { error } = await supabase.from('crm_activities').update({ is_completed: true, completed_at: new Date().toISOString() }).eq('id', id);
    if (error) toast.error(error.message);
    else {
      toast.success('Marked complete');
      queryClient.invalidateQueries({ queryKey: ['crm-activities'] });
    }
  };

  return (
    <AdminGuard>
      <AdminLayout title="Activities" subtitle="Call logs, notes, follow-ups, and tasks">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {['all', 'call', 'email', 'meeting', 'note', 'task', 'follow_up'].map(t => (
            <Button key={t} variant={filter === t ? 'default' : 'outline'} size="sm" onClick={() => setFilter(t)}>
              {t === 'all' ? 'All' : t.replace('_', ' ').replace(/^\w/, c => c.toUpperCase())}
            </Button>
          ))}
          <div className="ml-auto flex items-center gap-2">
            {overdue.length > 0 && <Badge variant="destructive">{overdue.length} overdue</Badge>}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild><Button size="sm"><Plus className="h-4 w-4 mr-1" /> Log Activity</Button></DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Log Activity</DialogTitle></DialogHeader>
                <div className="space-y-3">
                  <div>
                    <Label>Type</Label>
                    <Select value={form.activity_type} onValueChange={v => setForm(f => ({ ...f, activity_type: v }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {['call', 'email', 'meeting', 'note', 'task', 'follow_up'].map(t => (
                          <SelectItem key={t} value={t}>{t.replace('_', ' ').replace(/^\w/, c => c.toUpperCase())}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div><Label>Subject *</Label><Input value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} /></div>
                  <div><Label>Description</Label><Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></div>
                  <div><Label>Outcome</Label><Input value={form.outcome} onChange={e => setForm(f => ({ ...f, outcome: e.target.value }))} placeholder="e.g. Connected, No Answer, Callback" /></div>
                  <div><Label>Due Date</Label><Input type="datetime-local" value={form.due_date} onChange={e => setForm(f => ({ ...f, due_date: e.target.value }))} /></div>
                  <Button onClick={handleCreate} disabled={saving} className="w-full">{saving ? 'Saving...' : 'Log Activity'}</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="space-y-2">
          {isLoading && <p className="text-sm text-muted-foreground py-8 text-center">Loading...</p>}
          {activities.map(act => {
            const Icon = ACTIVITY_ICONS[act.activity_type] || FileText;
            const isOverdue = !act.is_completed && act.due_date && new Date(act.due_date) < new Date();
            return (
              <Card key={act.id} className={cn('p-3 flex items-start gap-3', act.is_completed && 'opacity-60')}>
                <Icon className={cn('h-4 w-4 mt-0.5 shrink-0', ACTIVITY_COLORS[act.activity_type])} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{act.subject}</span>
                    <Badge variant="outline" className="text-[10px]">{act.activity_type.replace('_', ' ')}</Badge>
                    {act.outcome && <Badge variant="secondary" className="text-[10px]">{act.outcome}</Badge>}
                    {isOverdue && <Badge variant="destructive" className="text-[10px]">Overdue</Badge>}
                    {act.is_completed && <Badge variant="default" className="text-[10px] bg-emerald-600">Done</Badge>}
                  </div>
                  {act.description && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{act.description}</p>}
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                    {(act as any).crm_deals?.title && <span>Deal: {(act as any).crm_deals.title}</span>}
                    {(act as any).crm_contacts?.full_name && <span>Contact: {(act as any).crm_contacts.full_name}</span>}
                    <span>{format(new Date(act.created_at), 'dd MMM yyyy HH:mm')}</span>
                    {act.due_date && <span>Due: {format(new Date(act.due_date), 'dd MMM yyyy HH:mm')}</span>}
                  </div>
                </div>
                {!act.is_completed && (
                  <Button variant="ghost" size="sm" className="shrink-0" onClick={() => markComplete(act.id)}>
                    <CheckCircle2 className="h-4 w-4" />
                  </Button>
                )}
              </Card>
            );
          })}
          {!isLoading && activities.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-12">No activities yet. Log your first call or note above.</p>
          )}
        </div>
      </AdminLayout>
    </AdminGuard>
  );
}
