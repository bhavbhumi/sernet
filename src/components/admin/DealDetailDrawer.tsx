import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import {
  User, Phone, Mail, IndianRupee, Clock, FileText, CheckCircle2,
  Plus, ArrowRight, Calendar, Users as UsersIcon
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const ACTIVITY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  call: Phone, email: Mail, meeting: UsersIcon, note: FileText, task: CheckCircle2, follow_up: Clock,
};
const ACTIVITY_COLORS: Record<string, string> = {
  call: 'text-blue-500', email: 'text-purple-500', meeting: 'text-amber-500',
  note: 'text-muted-foreground', task: 'text-emerald-500', follow_up: 'text-orange-500',
};

interface DealDetailDrawerProps {
  dealId: string | null;
  open: boolean;
  onClose: () => void;
}

export function DealDetailDrawer({ dealId, open, onClose }: DealDetailDrawerProps) {
  const queryClient = useQueryClient();
  const [actForm, setActForm] = useState({ activity_type: 'call', subject: '', description: '', outcome: '' });
  const [saving, setSaving] = useState(false);

  const { data: deal } = useQuery({
    queryKey: ['deal-detail', dealId],
    enabled: !!dealId && open,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('crm_deals')
        .select('*, crm_contacts(full_name, phone, email, city)')
        .eq('id', dealId!)
        .single();
      if (error) throw error;
      return data;
    },
  });

  const { data: activities = [] } = useQuery({
    queryKey: ['deal-activities', dealId],
    enabled: !!dealId && open,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('crm_activities')
        .select('*')
        .eq('deal_id', dealId!)
        .order('created_at', { ascending: false })
        .limit(50);
      if (error) throw error;
      return data;
    },
  });

  const { data: history = [] } = useQuery({
    queryKey: ['deal-history', dealId],
    enabled: !!dealId && open,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('crm_stage_history')
        .select('*')
        .eq('deal_id', dealId!)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const handleLogActivity = async () => {
    if (!actForm.subject.trim()) { toast.error('Subject required'); return; }
    setSaving(true);
    try {
      const { error } = await supabase.from('crm_activities').insert({
        deal_id: dealId,
        contact_id: deal?.contact_id || null,
        activity_type: actForm.activity_type as any,
        subject: actForm.subject,
        description: actForm.description || null,
        outcome: actForm.outcome || null,
      });
      if (error) throw error;
      toast.success('Activity logged');
      setActForm({ activity_type: 'call', subject: '', description: '', outcome: '' });
      queryClient.invalidateQueries({ queryKey: ['deal-activities', dealId] });
      queryClient.invalidateQueries({ queryKey: ['crm-activities'] });
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  const markComplete = async (id: string) => {
    await supabase.from('crm_activities').update({ is_completed: true, completed_at: new Date().toISOString() }).eq('id', id);
    queryClient.invalidateQueries({ queryKey: ['deal-activities', dealId] });
  };

  const contact = deal?.crm_contacts as { full_name: string; phone: string | null; email: string | null; city: string | null } | null;

  return (
    <Sheet open={open} onOpenChange={() => onClose()}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-base">{deal?.title || 'Deal Detail'}</SheetTitle>
        </SheetHeader>

        {deal && (
          <div className="mt-4 space-y-4">
            {/* Deal Summary Cards */}
            <div className="grid grid-cols-2 gap-2">
              <Card className="p-3">
                <p className="text-[10px] text-muted-foreground uppercase">Stage</p>
                <Badge variant="outline" className="mt-1 capitalize">{deal.stage}</Badge>
                <Badge variant="secondary" className="mt-1 ml-1 capitalize">{deal.sub_status}</Badge>
              </Card>
              <Card className="p-3">
                <p className="text-[10px] text-muted-foreground uppercase">Value</p>
                <p className="text-sm font-semibold flex items-center gap-1 mt-1"><IndianRupee className="h-3 w-3" /> {Number(deal.deal_value || 0).toLocaleString('en-IN')}</p>
              </Card>
            </div>

            {/* Contact Card */}
            {contact && (
              <Card className="p-3 space-y-1.5">
                <p className="text-[10px] font-medium text-muted-foreground uppercase">Contact</p>
                <div className="flex items-center gap-2 text-sm"><User className="h-3.5 w-3.5 text-muted-foreground" /> {contact.full_name}</div>
                {contact.phone && <div className="flex items-center gap-2 text-xs text-muted-foreground"><Phone className="h-3 w-3" /> {contact.phone}</div>}
                {contact.email && <div className="flex items-center gap-2 text-xs text-muted-foreground"><Mail className="h-3 w-3" /> {contact.email}</div>}
              </Card>
            )}

            {/* Tabs */}
            <Tabs defaultValue="activities">
              <TabsList className="w-full">
                <TabsTrigger value="activities" className="flex-1">Activities ({activities.length})</TabsTrigger>
                <TabsTrigger value="history" className="flex-1">History ({history.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="activities" className="mt-3 space-y-3">
                {/* Quick Log Form */}
                <Card className="p-3 space-y-2 bg-muted/30">
                  <p className="text-xs font-medium text-muted-foreground flex items-center gap-1"><Plus className="h-3 w-3" /> Log Activity</p>
                  <div className="flex gap-2">
                    <Select value={actForm.activity_type} onValueChange={v => setActForm(f => ({ ...f, activity_type: v }))}>
                      <SelectTrigger className="w-[110px] h-8 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {['call', 'email', 'meeting', 'note', 'task', 'follow_up'].map(t => (
                          <SelectItem key={t} value={t}>{t.replace('_', ' ').replace(/^\w/, c => c.toUpperCase())}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input value={actForm.subject} onChange={e => setActForm(f => ({ ...f, subject: e.target.value }))} placeholder="Subject" className="h-8 text-xs" />
                  </div>
                  <Input value={actForm.outcome} onChange={e => setActForm(f => ({ ...f, outcome: e.target.value }))} placeholder="Outcome (optional)" className="h-8 text-xs" />
                  <Textarea value={actForm.description} onChange={e => setActForm(f => ({ ...f, description: e.target.value }))} placeholder="Notes (optional)" className="text-xs min-h-[60px]" />
                  <Button size="sm" onClick={handleLogActivity} disabled={saving} className="w-full h-8 text-xs">{saving ? 'Saving...' : 'Log'}</Button>
                </Card>

                {/* Activity List */}
                {activities.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-6">No activities yet. Log your first one above.</p>
                ) : (
                  <div className="space-y-2">
                    {activities.map(act => {
                      const Icon = ACTIVITY_ICONS[act.activity_type] || FileText;
                      return (
                        <div key={act.id} className={cn('flex items-start gap-2.5 p-2 rounded-lg border', act.is_completed && 'opacity-50')}>
                          <Icon className={cn('h-3.5 w-3.5 mt-0.5 shrink-0', ACTIVITY_COLORS[act.activity_type])} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-medium">{act.subject}</span>
                              <Badge variant="outline" className="text-[9px]">{act.activity_type.replace('_', ' ')}</Badge>
                              {act.outcome && <Badge variant="secondary" className="text-[9px]">{act.outcome}</Badge>}
                            </div>
                            {act.description && <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-2">{act.description}</p>}
                            <p className="text-[10px] text-muted-foreground mt-0.5">{format(new Date(act.created_at), 'dd MMM yyyy HH:mm')}</p>
                          </div>
                          {!act.is_completed && (
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 shrink-0" onClick={() => markComplete(act.id)}>
                              <CheckCircle2 className="h-3.5 w-3.5" />
                            </Button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="history" className="mt-3">
                {history.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-6">No stage transitions recorded yet.</p>
                ) : (
                  <div className="space-y-2">
                    {history.map(h => (
                      <div key={h.id} className="flex items-center gap-2 p-2 rounded-lg border text-xs">
                        <ArrowRight className="h-3 w-3 text-muted-foreground shrink-0" />
                        <div className="flex-1 min-w-0">
                          <span className="text-muted-foreground">{h.from_stage ?? '—'}</span>
                          <span className="mx-1.5">→</span>
                          <span className="font-medium">{h.to_stage}</span>
                          <span className="text-muted-foreground ml-1">({h.to_sub_status})</span>
                        </div>
                        <span className="text-[10px] text-muted-foreground shrink-0">{format(new Date(h.created_at), 'dd MMM HH:mm')}</span>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
