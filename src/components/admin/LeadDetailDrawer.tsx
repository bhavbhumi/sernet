import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import {
  User, Phone, Mail, Clock, FileText, CheckCircle2,
  Plus, ArrowRight, Calendar, Globe, Tag, PhoneCall, Video, MessageSquare,
  MapPin, Target, TrendingUp, GitBranch, HandshakeIcon
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { leadProspect } from '@/lib/sharedLeadWorkflow';
import { MarketingLeadWorkflow } from '@/components/admin/MarketingLeadWorkflow';

const ACTIVITY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  call: PhoneCall, email: Mail, meeting: Video, note: FileText, task: CheckCircle2, follow_up: Clock,
};
const ACTIVITY_COLORS: Record<string, string> = {
  call: 'text-blue-500', email: 'text-purple-500', meeting: 'text-amber-500',
  note: 'text-muted-foreground', task: 'text-emerald-500', follow_up: 'text-orange-500',
};

const SOURCE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  calculator: Target, referral: GitBranch, tieup: HandshakeIcon,
  service: TrendingUp, contact: Mail, open_account: User, website: Globe,
};

interface LeadDetailDrawerProps {
  leadId: string | null;
  leadType: 'web' | 'calculator';
  open: boolean;
  onClose: () => void;
  onConverted?: () => void;
}

export function LeadDetailDrawer({ leadId, leadType, open, onClose, onConverted }: LeadDetailDrawerProps) {
  const queryClient = useQueryClient();
  const [actForm, setActForm] = useState({ activity_type: 'call', subject: '', description: '', outcome: '', due_date: '' });
  const [saving, setSaving] = useState(false);

  // Fetch lead
  const { data: lead } = useQuery({
    queryKey: ['lead-detail', leadId, leadType],
    enabled: !!leadId && open,
    queryFn: async () => {
      if (!leadId) throw new Error('Select a lead');
      if (leadType === 'calculator') {
        const { data, error } = await supabase.from('calculator_leads').select('*').eq('id', leadId).single();
        if (error) throw error;
        return { ...data, _type: 'calculator' as const };
      }
      const { data, error } = await supabase.from('leads').select('*').eq('id', leadId).single();
      if (error) throw error;
      return { ...data, _type: 'web' as const };
    },
  });

  // Activities linked to this lead (via crm_contacts that reference this lead)
  const { data: activities = [] } = useQuery({
    queryKey: ['lead-activities', leadId],
    enabled: !!leadId && open && leadType === 'web',
    queryFn: async () => {
      if (!leadId) return [];
      // Find contacts that were converted from this lead
      const { data: contacts, error: contactError } = await supabase.from('crm_contacts').select('id').eq('lead_id', leadId);
      if (contactError) throw contactError;
      const contactIds = (contacts ?? []).map(c => c.id);
      const { data, error } = await supabase.from('crm_activities')
        .select('*')
        .or(`lead_id.eq.${leadId}${contactIds.length ? `,contact_id.in.(${contactIds.join(',')})` : ''}`)
        .order('created_at', { ascending: false })
        .limit(30);
      if (error) throw error;
      return data;
    },
  });

  // Conversion path: check if lead became a contact, then deals
  const { data: conversionPath } = useQuery({
    queryKey: ['lead-conversion-path', leadId, lead?._type === 'web' ? lead.converted_contact_id : null],
    enabled: !!leadId && open && leadType === 'web',
    queryFn: async () => {
      if (!leadId) return {contact:null,deals:[]};
      const { data: contacts } = await supabase.from('crm_contacts')
        .select('id, full_name, created_at')
        .or(`lead_id.eq.${leadId}${lead?._type === 'web' && lead.converted_contact_id ? `,id.eq.${lead.converted_contact_id}` : ''}`);
      if (!contacts?.length) return { contact: null, deals: [] };
      const { data: deals } = await supabase.from('crm_deals')
        .select('id, title, stage, sub_status, deal_value, created_at')
        .eq('contact_id', contacts[0].id)
        .order('created_at', { ascending: false });
      return { contact: contacts[0], deals: deals || [] };
    },
  });

  const handleLogActivity = async () => {
    if (!actForm.subject.trim()) { toast.error('Subject required'); return; }
    if (!leadId || leadType !== 'web') return;
    setSaving(true);
    try {
      const { error } = await supabase.from('crm_activities').insert({
        contact_id: conversionPath?.contact?.id ?? null,
        lead_id: leadId,
        due_date: actForm.due_date ? new Date(actForm.due_date).toISOString() : null,
        activity_type: actForm.activity_type as any,
        subject: actForm.subject,
        description: actForm.description || null,
        outcome: actForm.outcome || null,
      });
      if (error) throw error;
      toast.success('Activity logged');
      setActForm({ activity_type: 'call', subject: '', description: '', outcome: '', due_date: '' });
      queryClient.invalidateQueries({ queryKey: ['lead-activities', leadId] });
      queryClient.invalidateQueries({ queryKey: ['lead-activity-counts'] });
    } catch (e: any) { toast.error(e.message); } finally { setSaving(false); }
  };

  const isWeb = lead?._type === 'web';
  const context = isWeb ? (lead as any)?.context : null;
  const prospect = lead?._type === 'web' ? leadProspect(lead) : lead;
  const SrcIcon = isWeb ? (SOURCE_ICONS[(lead as any)?.source] || Globe) : Target;

  return (
    <Sheet open={open} onOpenChange={() => onClose()}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-base flex items-center gap-2">
            <User className="h-4 w-4 text-primary" />
            {prospect?.name || 'Lead Detail'}
          </SheetTitle>
        </SheetHeader>

        {lead && (
          <div className="mt-4 space-y-4">
            {/* Lead Info Cards */}
            <div className="grid grid-cols-2 gap-2">
              <Card className="p-3">
                <p className="text-[10px] text-muted-foreground uppercase">Contact</p>
                <div className="mt-1 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs"><Phone className="h-3 w-3 text-muted-foreground" /> {prospect?.phone}</div>
                  {prospect?.email && <div className="flex items-center gap-1.5 text-xs"><Mail className="h-3 w-3 text-muted-foreground" /> {prospect?.email}</div>}
                </div>
              </Card>
              <Card className="p-3">
                <p className="text-[10px] text-muted-foreground uppercase">Source</p>
                <div className="mt-1 flex items-center gap-1.5">
                  <SrcIcon className="h-3.5 w-3.5 text-primary" />
                  <span className="text-xs font-medium capitalize">{isWeb ? (lead as any).source : 'Calculator'}</span>
                </div>
                {isWeb && (
                  <Badge variant="outline" className="text-[10px] mt-1 capitalize">{(lead as any).lead_type}</Badge>
                )}
              </Card>
            </div>

            {/* Status & Date */}
            <Card className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase">Status</p>
                  {isWeb ? (
                    <Badge variant="secondary" className="capitalize mt-1">{(lead as any).status}</Badge>
                  ) : (
                    <Badge variant="secondary" className="capitalize mt-1">{(lead as any).product_type}</Badge>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-muted-foreground uppercase">Created</p>
                  <p className="text-xs mt-1">{format(new Date(lead.created_at), 'dd MMM yyyy, HH:mm')}</p>
                </div>
              </div>
            </Card>

            {/* Context / Goal */}
            {lead._type === 'web' && <MarketingLeadWorkflow lead={lead} />}
            {isWeb && context && (
              <Card className="p-3">
                <p className="text-[10px] text-muted-foreground uppercase mb-1">Context</p>
                <pre className="text-xs text-muted-foreground whitespace-pre-wrap bg-muted/50 rounded p-2">{JSON.stringify(context, null, 2)}</pre>
              </Card>
            )}
            {!isWeb && (
              <Card className="p-3">
                <p className="text-[10px] text-muted-foreground uppercase mb-1">Goal</p>
                <p className="text-sm">{(lead as any).goal_text}</p>
                {(lead as any).calculated_result && (
                  <pre className="text-xs text-muted-foreground whitespace-pre-wrap bg-muted/50 rounded p-2 mt-2">
                    {JSON.stringify((lead as any).calculated_result, null, 2)}
                  </pre>
                )}
              </Card>
            )}

            {/* Notes */}
            {isWeb && (lead as any).notes && (
              <Card className="p-3">
                <p className="text-[10px] text-muted-foreground uppercase mb-1">Notes</p>
                <p className="text-sm text-muted-foreground">{(lead as any).notes}</p>
              </Card>
            )}

            {/* Tabs */}
            <Tabs defaultValue="conversion">
              <TabsList className="w-full">
                <TabsTrigger value="conversion" className="flex-1">Conversion Path</TabsTrigger>
                <TabsTrigger value="activities" className="flex-1">Activities ({activities.length})</TabsTrigger>
              </TabsList>

              {/* Conversion Path */}
              <TabsContent value="conversion" className="mt-3 space-y-3">
                <div className="relative pl-4 border-l-2 border-muted space-y-3">
                  {/* Lead created */}
                  <div className="relative flex items-start gap-2.5 p-2.5 rounded-lg border">
                    <div className="absolute -left-[calc(1rem+5px)] top-3 h-2 w-2 rounded-full bg-blue-500" />
                    <Tag className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-medium">Lead Created</p>
                      <p className="text-[10px] text-muted-foreground">{format(new Date(lead.created_at), 'dd MMM yyyy HH:mm')}</p>
                    </div>
                  </div>

                  {/* Contact conversion */}
                  {conversionPath?.contact ? (
                    <div className="relative flex items-start gap-2.5 p-2.5 rounded-lg border bg-green-500/5">
                      <div className="absolute -left-[calc(1rem+5px)] top-3 h-2 w-2 rounded-full bg-green-500" />
                      <ArrowRight className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs font-medium">Converted to Contact</p>
                        <p className="text-[10px] text-muted-foreground">{conversionPath.contact.full_name} · {format(new Date(conversionPath.contact.created_at), 'dd MMM yyyy')}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="relative flex items-start gap-2.5 p-2.5 rounded-lg border border-dashed opacity-50">
                      <div className="absolute -left-[calc(1rem+5px)] top-3 h-2 w-2 rounded-full bg-muted-foreground" />
                      <ArrowRight className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                      <p className="text-xs text-muted-foreground">Not yet converted to contact</p>
                    </div>
                  )}

                  {/* Deals */}
                  {conversionPath?.deals.map((deal: any) => (
                    <div key={deal.id} className="relative flex items-start gap-2.5 p-2.5 rounded-lg border bg-primary/5">
                      <div className="absolute -left-[calc(1rem+5px)] top-3 h-2 w-2 rounded-full bg-primary" />
                      <TrendingUp className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <div className="flex-1">
                        <p className="text-xs font-medium">{deal.title}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <Badge variant="outline" className="text-[9px] capitalize">{deal.stage}</Badge>
                          <Badge variant="secondary" className="text-[9px] capitalize">{deal.sub_status?.replace('_', ' ')}</Badge>
                          {deal.deal_value > 0 && <span className="text-[10px] text-muted-foreground">₹{Number(deal.deal_value).toLocaleString('en-IN')}</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              {/* Activities */}
              <TabsContent value="activities" className="mt-3 space-y-3">
                {isWeb ? (
                  <>
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
                      <Textarea value={actForm.description} onChange={e => setActForm(f => ({ ...f, description: e.target.value }))} placeholder="Notes (optional)" className="text-xs min-h-[50px]" />
                      <Input aria-label="Next action due" type="datetime-local" value={actForm.due_date} onChange={e => setActForm(f => ({ ...f, due_date: e.target.value }))} />
                      <Button size="sm" onClick={handleLogActivity} disabled={saving} className="w-full h-8 text-xs">{saving ? 'Saving...' : 'Log'}</Button>
                    </Card>
                    {activities.length === 0 ? (
                      <p className="text-xs text-muted-foreground text-center py-6">No activities yet.</p>
                    ) : (
                      <div className="space-y-2">
                        {activities.map((act: any) => {
                          const Icon = ACTIVITY_ICONS[act.activity_type] || FileText;
                          return (
                            <div key={act.id} className={cn('flex items-start gap-2.5 p-2 rounded-lg border', act.is_completed && 'opacity-50')}>
                              <Icon className={cn('h-3.5 w-3.5 mt-0.5 shrink-0', ACTIVITY_COLORS[act.activity_type])} />
                              <div className="flex-1 min-w-0">
                                <span className="text-xs font-medium">{act.subject}</span>
                                {act.due_date && <p className="text-xs text-primary">Due {format(new Date(act.due_date), 'dd MMM yyyy HH:mm')}</p>}
                                {act.description && <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-2">{act.description}</p>}
                                <p className="text-[10px] text-muted-foreground mt-0.5">{format(new Date(act.created_at), 'dd MMM yyyy HH:mm')}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-xs text-muted-foreground text-center py-6">Legacy calculator enquiries are available in the shared Leads list.</p>
                )}
              </TabsContent>
            </Tabs>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
