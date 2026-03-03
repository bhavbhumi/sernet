
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Send, Lock, User, Clock, Shield, AlertTriangle, FileText, Layers } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { logAudit } from '@/lib/auditLog';
import { Switch } from '@/components/ui/switch';
import { PRODUCTS, PRIORITY_CONFIG, RISK_TAGS, REGULATORS } from '@/lib/supportClassification';

const db = (t: string) => supabase.from(t as any) as any;

const statusLabels: Record<string, string> = {
  open: 'Open', in_progress: 'In Progress', waiting_on_customer: 'Waiting on Customer', resolved: 'Resolved', closed: 'Closed',
};

const priorityColors: Record<string, string> = {
  low: 'bg-muted text-muted-foreground',
  medium: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  high: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
  urgent: 'bg-destructive/15 text-destructive',
};

function TatCountdown({ deadline }: { deadline: string | null }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const i = setInterval(() => setNow(Date.now()), 60_000); return () => clearInterval(i); }, []);
  if (!deadline) return <span className="text-xs text-muted-foreground">No TAT set</span>;
  const ms = new Date(deadline).getTime() - now;
  const breached = ms <= 0;
  const hrs = Math.abs(Math.floor(ms / 3_600_000));
  const mins = Math.abs(Math.floor((ms % 3_600_000) / 60_000));
  return (
    <div className={`flex items-center gap-1.5 text-sm font-medium ${breached ? 'text-destructive' : ms < 7_200_000 ? 'text-orange-600 dark:text-orange-400' : 'text-green-600 dark:text-green-400'}`}>
      <Clock className="h-3.5 w-3.5" />
      {breached ? `Breached ${hrs}h ${mins}m ago` : `${hrs}h ${mins}m remaining`}
    </div>
  );
}

export default function AdminTicketDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [ticket, setTicket] = useState<any>(null);
  const [replies, setReplies] = useState<any[]>([]);
  const [cannedResponses, setCannedResponses] = useState<any[]>([]);
  const [escalationLog, setEscalationLog] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState('');
  const [isInternal, setIsInternal] = useState(false);
  const [sending, setSending] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    const [{ data: t }, { data: r }, { data: cr }, { data: esc }] = await Promise.all([
      db('support_tickets').select('*, crm_contacts(full_name, email, phone), support_issue_categories(name, slug), support_issue_types(title, issue_code, priority, tat_hours, risk_tag, regulator, required_documents)').eq('id', id).single(),
      db('ticket_replies').select('*').eq('ticket_id', id).order('created_at', { ascending: true }),
      db('canned_responses').select('id, title, shortcode, body').eq('is_active', true).order('title'),
      db('ticket_escalation_log').select('*').eq('ticket_id', id).order('created_at', { ascending: true }),
    ]);
    setTicket(t);
    setReplies(r ?? []);
    setCannedResponses(cr ?? []);
    setEscalationLog(esc ?? []);
    setLoading(false);
  };

  useEffect(() => { if (id) fetchAll(); }, [id]);

  const updateTicket = async (updates: any) => {
    const { error } = await db('support_tickets').update(updates).eq('id', id);
    if (error) toast({ title: 'Error', description: error.message, variant: 'destructive' });
    else {
      logAudit({ action: 'update', entity_type: 'support_tickets', entity_id: id, details: updates });
      toast({ title: 'Ticket updated' });
      fetchAll();
    }
  };

  const handleReply = async () => {
    if (!replyText.trim()) return;
    setSending(true);
    const { data: { user } } = await supabase.auth.getUser();
    const payload = {
      ticket_id: id,
      body: replyText,
      is_internal: isInternal,
      reply_by_user_id: user?.id,
      reply_by_name: user?.email?.split('@')[0] ?? 'Admin',
      reply_by_email: user?.email,
    };
    const { error } = await db('ticket_replies').insert([payload]);
    if (error) toast({ title: 'Error', description: error.message, variant: 'destructive' });
    else {
      if (!ticket.first_response_at && !isInternal) {
        await db('support_tickets').update({ first_response_at: new Date().toISOString() }).eq('id', id);
      }
      logAudit({ action: 'reply', entity_type: 'support_tickets', entity_id: id, details: { is_internal: isInternal } });
      setReplyText('');
      setIsInternal(false);
      fetchAll();
    }
    setSending(false);
  };

  const insertCanned = (body: string) => {
    setReplyText(prev => prev + (prev ? '\n\n' : '') + body);
    const cr = cannedResponses.find(c => c.body === body);
    if (cr) db('canned_responses').update({ usage_count: (cr.usage_count || 0) + 1 }).eq('id', cr.id);
  };

  if (loading) return <AdminLayout title="Loading..." subtitle=""><div className="animate-pulse h-32 bg-muted rounded-xl" /></AdminLayout>;
  if (!ticket) return <AdminLayout title="Not Found" subtitle=""><p>Ticket not found.</p></AdminLayout>;

  const product = PRODUCTS.find(p => p.key === ticket.product);
  const issueType = ticket.support_issue_types;
  const issueCat = ticket.support_issue_categories;
  const riskCfg = ticket.risk_tag ? RISK_TAGS[ticket.risk_tag as keyof typeof RISK_TAGS] : null;
  const regCfg = ticket.regulator ? REGULATORS[ticket.regulator as keyof typeof REGULATORS] : null;

  return (
    <AdminLayout
      title={ticket.ticket_number}
      subtitle={ticket.subject}
      actions={<Button variant="outline" size="sm" onClick={() => navigate('/admin/support/tickets')}><ArrowLeft className="h-4 w-4 mr-1.5" /> Back</Button>}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main — conversation */}
        <div className="lg:col-span-2 space-y-4">
          {/* Description */}
          {ticket.description && (
            <div className="bg-card border border-border rounded-xl p-4">
              <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1"><User className="h-3 w-3" /> {ticket.contact_name || 'Customer'} — Original request</p>
              <p className="text-sm text-foreground whitespace-pre-wrap">{ticket.description}</p>
            </div>
          )}

          {/* Replies */}
          {replies.map(r => (
            <div key={r.id} className={`border rounded-xl p-4 ${r.is_internal ? 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/10 dark:border-yellow-800' : r.reply_by_user_id ? 'bg-primary/5 border-primary/20' : 'bg-card border-border'}`}>
              <div className="flex items-center gap-2 mb-1">
                {r.is_internal && <Lock className="h-3 w-3 text-yellow-600" />}
                <p className="text-xs font-medium text-foreground">{r.reply_by_name || 'Customer'}</p>
                <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />{new Date(r.created_at).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                {r.is_internal && <Badge variant="outline" className="text-[10px] h-4">Internal</Badge>}
              </div>
              <p className="text-sm text-foreground whitespace-pre-wrap">{r.body}</p>
            </div>
          ))}

          {/* Reply composer */}
          <div className="bg-card border border-border rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Reply</Label>
              <div className="flex items-center gap-2">
                <Label htmlFor="internal-toggle" className="text-xs text-muted-foreground">Internal note</Label>
                <Switch id="internal-toggle" checked={isInternal} onCheckedChange={setIsInternal} />
              </div>
            </div>
            {cannedResponses.length > 0 && (
              <Select onValueChange={v => { const cr = cannedResponses.find(c => c.id === v); if (cr) insertCanned(cr.body); }}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Insert canned response..." /></SelectTrigger>
                <SelectContent>
                  {cannedResponses.map(cr => (
                    <SelectItem key={cr.id} value={cr.id}>#{cr.shortcode} — {cr.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <Textarea rows={4} placeholder={isInternal ? 'Add internal note (not visible to customer)...' : 'Type your reply...'} value={replyText} onChange={e => setReplyText(e.target.value)} />
            <div className="flex justify-end">
              <Button onClick={handleReply} disabled={sending || !replyText.trim()} size="sm">
                <Send className="h-4 w-4 mr-1.5" />{sending ? 'Sending...' : isInternal ? 'Add Note' : 'Send Reply'}
              </Button>
            </div>
          </div>
        </div>

        {/* Sidebar — details + classification */}
        <div className="space-y-4">
          {/* Classification card */}
          {(product || issueType) && (
            <div className="bg-card border border-border rounded-xl p-4 space-y-3">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5"><Layers className="h-4 w-4" /> Classification</h3>
              {product && (
                <div>
                  <Label className="text-xs text-muted-foreground">Product</Label>
                  <p className={`text-sm font-medium ${product.color}`}>{product.label}</p>
                </div>
              )}
              {issueCat && (
                <div>
                  <Label className="text-xs text-muted-foreground">Category</Label>
                  <p className="text-sm text-foreground">{issueCat.name}</p>
                </div>
              )}
              {issueType && (
                <div>
                  <Label className="text-xs text-muted-foreground">Issue Type</Label>
                  <p className="text-sm text-foreground">{issueType.title}</p>
                  <p className="font-mono text-[10px] text-muted-foreground mt-0.5">{issueType.issue_code}</p>
                </div>
              )}
              <div className="flex items-center gap-1.5 flex-wrap">
                {riskCfg && <Badge variant="outline" className={`text-[10px] ${riskCfg.color}`}>{riskCfg.label} Risk</Badge>}
                {regCfg && <Badge variant="outline" className={`text-[10px] ${regCfg.color}`}><Shield className="h-2.5 w-2.5 mr-0.5" />{regCfg.label}</Badge>}
              </div>
              {(ticket.documents_required ?? []).length > 0 && (
                <div className="flex items-start gap-1.5 text-xs text-muted-foreground">
                  <FileText className="h-3 w-3 shrink-0 mt-0.5" />
                  <span>Docs: {ticket.documents_required.join(', ')}</span>
                </div>
              )}
            </div>
          )}

          {/* TAT card */}
          <div className="bg-card border border-border rounded-xl p-4 space-y-3">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5"><Clock className="h-4 w-4" /> SLA / TAT</h3>
            <TatCountdown deadline={ticket.tat_deadline} />
            {ticket.tat_hours && (
              <p className="text-xs text-muted-foreground">TAT: {ticket.tat_hours} hours</p>
            )}
            {ticket.auto_assigned && (
              <Badge variant="secondary" className="text-[10px]">Auto-assigned to {ticket.department}</Badge>
            )}
          </div>

          {/* Ticket details */}
          <div className="bg-card border border-border rounded-xl p-4 space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Ticket Details</h3>
            <div className="space-y-3">
              <div>
                <Label className="text-xs text-muted-foreground">Status</Label>
                <Select value={ticket.status} onValueChange={v => updateTicket({ status: v, ...(v === 'resolved' ? { resolved_at: new Date().toISOString() } : {}), ...(v === 'closed' ? { closed_at: new Date().toISOString() } : {}) })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(statusLabels).map(([k, v]) => (
                      <SelectItem key={k} value={k}>{v}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Priority</Label>
                <Select value={ticket.priority} onValueChange={v => updateTicket({ priority: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Channel</Label>
                <p className="text-sm text-foreground capitalize">{ticket.channel?.replace('_', ' ')}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Created</Label>
                <p className="text-sm text-foreground">{new Date(ticket.created_at).toLocaleString('en-IN')}</p>
              </div>
              {ticket.first_response_at && (
                <div>
                  <Label className="text-xs text-muted-foreground">First Response</Label>
                  <p className="text-sm text-foreground">{new Date(ticket.first_response_at).toLocaleString('en-IN')}</p>
                </div>
              )}
            </div>
          </div>

          {/* Escalation trail */}
          {escalationLog.length > 0 && (
            <div className="bg-card border border-border rounded-xl p-4 space-y-3">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5"><AlertTriangle className="h-4 w-4" /> Escalation Trail</h3>
              <div className="space-y-2">
                {escalationLog.map((e: any) => (
                  <div key={e.id} className="text-xs border-l-2 border-orange-400 pl-3 py-1">
                    <p className="font-medium text-foreground">L{e.from_level} → L{e.to_level}</p>
                    {e.reason && <p className="text-muted-foreground">{e.reason}</p>}
                    <p className="text-muted-foreground">{new Date(e.created_at).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Contact info */}
          <div className="bg-card border border-border rounded-xl p-4 space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Contact</h3>
            <p className="text-sm text-foreground">{ticket.contact_name || ticket.crm_contacts?.full_name || '—'}</p>
            {(ticket.contact_email || ticket.crm_contacts?.email) && (
              <p className="text-xs text-muted-foreground">{ticket.contact_email || ticket.crm_contacts?.email}</p>
            )}
            {(ticket.contact_phone || ticket.crm_contacts?.phone) && (
              <p className="text-xs text-muted-foreground">{ticket.contact_phone || ticket.crm_contacts?.phone}</p>
            )}
            {ticket.contact_id && (
              <Button variant="link" size="sm" className="h-auto p-0 text-xs" onClick={() => navigate('/admin/sales/crm/contacts')}>
                View in CRM →
              </Button>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
