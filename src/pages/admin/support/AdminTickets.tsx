
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, ChevronLeft, ChevronRight, Eye, Clock, AlertTriangle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { logAudit } from '@/lib/auditLog';
import { PRODUCTS, PRIORITY_CONFIG, RISK_TAGS, matchAutomationRules } from '@/lib/supportClassification';

const db = (t: string) => supabase.from(t as any) as any;
const PAGE_SIZE = 25;

const priorityColors: Record<string, string> = {
  low: 'bg-muted text-muted-foreground',
  medium: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  high: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
  urgent: 'bg-destructive/15 text-destructive',
};

const statusColors: Record<string, string> = {
  open: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  in_progress: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  waiting_on_customer: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  resolved: 'bg-muted text-muted-foreground',
  closed: 'bg-muted text-muted-foreground',
};

const statusLabels: Record<string, string> = {
  open: 'Open', in_progress: 'In Progress', waiting_on_customer: 'Waiting', resolved: 'Resolved', closed: 'Closed',
};

const channelLabels: Record<string, string> = {
  phone: 'Phone', walk_in: 'Walk-in', website: 'Website', email: 'Email', portal: 'Portal',
};

export default function AdminTickets() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [tickets, setTickets] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [issueTypes, setIssueTypes] = useState<any[]>([]);
  const [automationRules, setAutomationRules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterProduct, setFilterProduct] = useState('all');
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({
    subject: '', description: '', priority: 'medium', channel: 'phone',
    contact_id: '', contact_name: '', contact_email: '', contact_phone: '',
    product: 'tickfunds', issue_category_id: '', issue_type_id: '',
  });
  const [saving, setSaving] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    const [{ data: t }, { data: c }, { data: cats }, { data: types }, { data: rules }] = await Promise.all([
      db('support_tickets').select('*, crm_contacts(full_name, email, phone), support_issue_categories(name), support_issue_types(issue_code, title, priority, tat_hours)').order('created_at', { ascending: false }),
      db('crm_contacts').select('id, full_name, email, phone').order('full_name'),
      db('support_issue_categories').select('id, name, slug').eq('is_active', true).order('sort_order'),
      db('support_issue_types').select('id, category_id, product, issue_code, title, priority, tat_hours, risk_tag, regulator, required_documents, auto_assign_team').eq('is_active', true).order('sort_order'),
      db('support_automation_rules').select('*').eq('is_active', true).order('sort_order'),
    ]);
    setTickets(t ?? []);
    setContacts(c ?? []);
    setCategories(cats ?? []);
    setIssueTypes(types ?? []);
    setAutomationRules(rules ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const filteredIssueTypesForForm = issueTypes.filter(t =>
    (t.product === form.product || t.product === 'all') &&
    (!form.issue_category_id || t.category_id === form.issue_category_id)
  );

  const selectedIssueType = issueTypes.find(t => t.id === form.issue_type_id);

  const handleCreate = async () => {
    setSaving(true);
    const fullText = `${form.subject} ${form.description}`;
    const autoMatch = matchAutomationRules(fullText, automationRules);

    const effectivePriority = autoMatch?.priority === 'critical' ? 'urgent' : autoMatch?.priority ?? form.priority;
    const tatHours = autoMatch?.tat_hours ?? selectedIssueType?.tat_hours ?? 48;

    const payload: any = {
      subject: form.subject, description: form.description,
      priority: effectivePriority, channel: form.channel, status: 'open',
      product: form.product,
      issue_category_id: form.issue_category_id || null,
      issue_type_id: form.issue_type_id || null,
      issue_code: selectedIssueType?.issue_code ?? null,
      risk_tag: selectedIssueType?.risk_tag ?? 'operational',
      regulator: selectedIssueType?.regulator ?? null,
      tat_hours: tatHours,
      tat_deadline: new Date(Date.now() + tatHours * 60 * 60 * 1000).toISOString(),
      documents_required: selectedIssueType?.required_documents ?? [],
      department: autoMatch?.assign_team ?? selectedIssueType?.auto_assign_team ?? 'support',
      auto_assigned: !!autoMatch,
    };
    if (form.contact_id) {
      payload.contact_id = form.contact_id;
      const c = contacts.find((x: any) => x.id === form.contact_id);
      if (c) { payload.contact_name = c.full_name; payload.contact_email = c.email; payload.contact_phone = c.phone; }
    } else {
      payload.contact_name = form.contact_name; payload.contact_email = form.contact_email; payload.contact_phone = form.contact_phone;
    }
    const { error } = await db('support_tickets').insert([payload]);
    if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); }
    else {
      logAudit({ action: 'create', entity_type: 'support_tickets', details: { subject: form.subject, product: form.product, issue_code: selectedIssueType?.issue_code } });
      toast({ title: 'Ticket created' });
      setDialogOpen(false);
      setForm({ subject: '', description: '', priority: 'medium', channel: 'phone', contact_id: '', contact_name: '', contact_email: '', contact_phone: '', product: 'tickfunds', issue_category_id: '', issue_type_id: '' });
      fetchAll();
    }
    setSaving(false);
  };

  const filtered = tickets.filter(t => {
    const match = (t.subject + ' ' + t.ticket_number + ' ' + (t.contact_name ?? '') + ' ' + (t.issue_code ?? '')).toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || t.status === filterStatus;
    const matchPri = filterPriority === 'all' || t.priority === filterPriority;
    const matchProd = filterProduct === 'all' || t.product === filterProduct;
    return match && matchStatus && matchPri && matchProd;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const statusCounts = {
    all: tickets.length,
    open: tickets.filter(t => t.status === 'open').length,
    in_progress: tickets.filter(t => t.status === 'in_progress').length,
    waiting_on_customer: tickets.filter(t => t.status === 'waiting_on_customer').length,
    resolved: tickets.filter(t => t.status === 'resolved').length,
    closed: tickets.filter(t => t.status === 'closed').length,
  };

  // TAT breach check
  const isBreached = (t: any) => t.tat_deadline && new Date(t.tat_deadline) < new Date() && !['resolved', 'closed'].includes(t.status);

  return (
    <AdminLayout
      title="Support Tickets"
      subtitle="Multi-product support management with 3-tier classification"
      actions={<Button onClick={() => setDialogOpen(true)} size="sm"><Plus className="h-4 w-4 mr-1.5" /> New Ticket</Button>}
    >
      {/* Stat chips */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-5">
        {([
          { key: 'all', label: 'Total' }, { key: 'open', label: 'Open' },
          { key: 'in_progress', label: 'In Progress' }, { key: 'waiting_on_customer', label: 'Waiting' },
          { key: 'resolved', label: 'Resolved' }, { key: 'closed', label: 'Closed' },
        ] as const).map(({ key, label }) => (
          <button key={key} onClick={() => { setFilterStatus(key); setPage(1); }}
            className={`border rounded-lg p-3 text-left transition-colors ${filterStatus === key ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'}`}>
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-2xl font-semibold text-foreground">{statusCounts[key]}</p>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-4 flex-wrap items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search tickets..." className="pl-9" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
        </div>
        <Select value={filterProduct} onValueChange={v => { setFilterProduct(v); setPage(1); }}>
          <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Products</SelectItem>
            {PRODUCTS.map(p => <SelectItem key={p.key} value={p.key}>{p.label}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filterPriority} onValueChange={v => { setFilterPriority(v); setPage(1); }}>
          <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Ticket</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Product</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Contact</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Priority</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">TAT</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Created</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground w-20">View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i}><td colSpan={8} className="px-4 py-3"><div className="h-4 bg-muted animate-pulse rounded" /></td></tr>
                ))
              ) : paginated.length === 0 ? (
                <tr><td colSpan={8} className="px-4 py-12 text-center text-muted-foreground">No tickets found.</td></tr>
              ) : paginated.map(t => {
                const breached = isBreached(t);
                const prod = PRODUCTS.find(p => p.key === t.product);
                return (
                  <tr key={t.id} className={`hover:bg-muted/20 cursor-pointer ${breached ? 'bg-red-50/50 dark:bg-red-900/5' : ''}`} onClick={() => navigate(`/admin/support/tickets/${t.id}`)}>
                    <td className="px-4 py-3">
                      <p className="font-medium text-foreground line-clamp-1">{t.subject}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-xs text-muted-foreground">{t.ticket_number}</span>
                        {t.issue_code && <span className="font-mono text-[10px] text-muted-foreground bg-muted px-1 rounded">{t.issue_code}</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {prod && <Badge variant="outline" className={`text-[10px] ${prod.bg}`}>{prod.label}</Badge>}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      <p className="line-clamp-1">{t.contact_name || t.crm_contacts?.full_name || '—'}</p>
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={priorityColors[t.priority] ?? ''} variant="secondary">{t.priority}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={statusColors[t.status] ?? ''} variant="secondary">{statusLabels[t.status] ?? t.status}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      {breached ? (
                        <span className="text-xs text-destructive flex items-center gap-1"><AlertTriangle className="h-3 w-3" /> Breached</span>
                      ) : t.tat_hours ? (
                        <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />{t.tat_hours}h</span>
                      ) : '—'}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs whitespace-nowrap">
                      {new Date(t.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0"><Eye className="h-4 w-4" /></Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex justify-end items-center gap-1.5">
          <span className="text-xs text-muted-foreground mr-2">{(page-1)*PAGE_SIZE+1}–{Math.min(page*PAGE_SIZE, filtered.length)} of {filtered.length}</span>
          <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1} className="px-2 py-1.5 text-xs rounded-md border border-border disabled:opacity-40"><ChevronLeft className="h-3.5 w-3.5 inline" /> Prev</button>
          <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page === totalPages} className="px-2 py-1.5 text-xs rounded-md border border-border disabled:opacity-40">Next <ChevronRight className="h-3.5 w-3.5 inline" /></button>
        </div>
      )}

      {/* New Ticket Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>New Ticket</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-4 mt-2">
            {/* Classification - Tier 1: Product */}
            <div className="space-y-1.5">
              <Label>Product <span className="text-destructive">*</span></Label>
              <Select value={form.product} onValueChange={v => setForm(f => ({ ...f, product: v, issue_category_id: '', issue_type_id: '' }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PRODUCTS.map(p => <SelectItem key={p.key} value={p.key}>{p.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            {/* Tier 2: Category */}
            <div className="space-y-1.5">
              <Label>Issue Category</Label>
              <Select value={form.issue_category_id || '__none'} onValueChange={v => setForm(f => ({ ...f, issue_category_id: v === '__none' ? '' : v, issue_type_id: '' }))}>
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none">— Select —</SelectItem>
                  {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            {/* Tier 3: Issue Type */}
            {form.issue_category_id && (
              <div className="col-span-2 space-y-1.5">
                <Label>Issue Type</Label>
                <Select value={form.issue_type_id || '__none'} onValueChange={v => {
                  const it = issueTypes.find(t => t.id === v);
                  setForm(f => ({
                    ...f, issue_type_id: v === '__none' ? '' : v,
                    subject: it ? it.title : f.subject,
                    priority: it ? (it.priority === 'critical' ? 'urgent' : it.priority) : f.priority,
                  }));
                }}>
                  <SelectTrigger><SelectValue placeholder="Select specific issue" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none">— Select —</SelectItem>
                    {filteredIssueTypesForForm.map(t => (
                      <SelectItem key={t.id} value={t.id}>{t.issue_code} — {t.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedIssueType && (
                  <div className="bg-muted/30 rounded-lg p-2 text-xs text-muted-foreground flex flex-wrap gap-2 mt-1">
                    <Badge className={PRIORITY_CONFIG[selectedIssueType.priority as keyof typeof PRIORITY_CONFIG]?.color ?? ''} variant="secondary">
                      {PRIORITY_CONFIG[selectedIssueType.priority as keyof typeof PRIORITY_CONFIG]?.label}
                    </Badge>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{selectedIssueType.tat_hours}h TAT</span>
                    {selectedIssueType.regulator && <Badge variant="outline" className="text-[10px]">{selectedIssueType.regulator}</Badge>}
                    {selectedIssueType.auto_assign_team && <span>→ {selectedIssueType.auto_assign_team}</span>}
                  </div>
                )}
              </div>
            )}

            <div className="col-span-2 space-y-1.5">
              <Label>Subject <span className="text-destructive">*</span></Label>
              <Input value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} placeholder="Brief description of the issue" />
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label>Description</Label>
              <Textarea rows={4} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Detailed description..." />
            </div>
            <div className="space-y-1.5">
              <Label>Priority</Label>
              <Select value={form.priority} onValueChange={v => setForm(f => ({ ...f, priority: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent (Critical)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Channel</Label>
              <Select value={form.channel} onValueChange={v => setForm(f => ({ ...f, channel: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="phone">Phone</SelectItem>
                  <SelectItem value="walk_in">Walk-in</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="website">Website</SelectItem>
                  <SelectItem value="portal">Portal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label>Link to CRM Contact</Label>
              <Select value={form.contact_id || '__none'} onValueChange={v => setForm(f => ({ ...f, contact_id: v === '__none' ? '' : v }))}>
                <SelectTrigger><SelectValue placeholder="Select contact (optional)" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none">— No CRM link —</SelectItem>
                  {contacts.map((c: any) => (
                    <SelectItem key={c.id} value={c.id}>{c.full_name}{c.phone ? ` (${c.phone})` : ''}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {!form.contact_id && (
              <>
                <div className="space-y-1.5">
                  <Label>Contact Name</Label>
                  <Input value={form.contact_name} onChange={e => setForm(f => ({ ...f, contact_name: e.target.value }))} />
                </div>
                <div className="space-y-1.5">
                  <Label>Contact Email</Label>
                  <Input type="email" value={form.contact_email} onChange={e => setForm(f => ({ ...f, contact_email: e.target.value }))} />
                </div>
                <div className="space-y-1.5">
                  <Label>Contact Phone</Label>
                  <Input value={form.contact_phone} onChange={e => setForm(f => ({ ...f, contact_phone: e.target.value }))} />
                </div>
              </>
            )}
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={saving || !form.subject.trim()}>{saving ? 'Creating...' : 'Create Ticket'}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
