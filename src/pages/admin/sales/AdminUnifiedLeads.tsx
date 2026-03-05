import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminGuard } from '@/components/admin/AdminGuard';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import {
  Users, Phone, Mail, Calculator, HandshakeIcon, GitBranch, TrendingUp,
  Search, Loader2, ArrowRight, Target
} from 'lucide-react';
import { format } from 'date-fns';

// ---- Types ----
type WebLead = {
  id: string; name: string; phone: string; email: string | null;
  source: string; lead_type: string; status: string;
  context: Record<string, unknown> | null; notes: string | null; created_at: string;
};

type CalcLead = {
  id: string; name: string; phone: string; email: string | null;
  goal_text: string; product_type: string;
  calculated_result: Record<string, number> | null; created_at: string;
};

const SOURCE_LABELS: Record<string, { label: string; color: string; icon: React.ComponentType<{ className?: string }> }> = {
  calculator:   { label: 'AI Calculator',  color: 'bg-primary/10 text-primary',          icon: Calculator },
  referral:     { label: 'Referral',        color: 'bg-green-500/10 text-green-600',       icon: GitBranch },
  tieup:        { label: 'Tie-up',          color: 'bg-amber-500/10 text-amber-600',       icon: HandshakeIcon },
  service:      { label: 'Service Inquiry', color: 'bg-purple-500/10 text-purple-600',     icon: TrendingUp },
  contact:      { label: 'Contact Form',    color: 'bg-sky-500/10 text-sky-600',           icon: Mail },
  open_account: { label: 'Open Account',    color: 'bg-rose-500/10 text-rose-600',         icon: Users },
  website:      { label: 'Website',         color: 'bg-muted text-muted-foreground',       icon: Users },
};

const STATUS_OPTIONS = ['new', 'contacted', 'qualified', 'converted', 'lost'];
const STATUS_COLOR: Record<string, string> = {
  new: 'bg-blue-500/10 text-blue-600', contacted: 'bg-amber-500/10 text-amber-600',
  qualified: 'bg-purple-500/10 text-purple-600', converted: 'bg-green-500/10 text-green-600',
  lost: 'bg-rose-500/10 text-rose-600',
};

const productBadge: Record<string, string> = {
  sip: 'bg-primary/10 text-primary', lumpsum: 'bg-green-500/10 text-green-600',
  brokerage: 'bg-amber-500/10 text-amber-600', margin: 'bg-purple-500/10 text-purple-600',
  insurance: 'bg-red-500/10 text-red-600', goal: 'bg-cyan-500/10 text-cyan-600',
};

// ---- Convert to Contact Dialog ----
function ConvertToContactDialog({ lead, open, onClose }: {
  lead: { id?: string; name: string; phone: string; email: string | null; context?: string };
  open: boolean;
  onClose: (converted?: boolean) => void;
}) {
  const [pan, setPan] = useState('');
  const [relationship, setRelationship] = useState('client');
  const [city, setCity] = useState('');
  const [saving, setSaving] = useState(false);

  const handleConvert = async () => {
    setSaving(true);
    try {
      // Create contact with lead attribution
      const { error: cErr } = await supabase.from('crm_contacts').insert({
        full_name: lead.name,
        phone: lead.phone,
        email: lead.email || null,
        pan: pan || null,
        city: city || null,
        relationship_type: relationship as any,
        source: 'lead_conversion',
        lead_id: lead.id || null,
      });
      if (cErr) throw cErr;

      // Mark lead as converted
      if (lead.id) {
        await supabase.from('leads').update({ status: 'converted' }).eq('id', lead.id);
      }

      toast.success('Lead converted to contact — you can now add deals from Contacts');
      onClose(true);
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle className="flex items-center gap-2"><ArrowRight className="h-4 w-4 text-primary" /> Convert to Contact</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">Creates a CRM contact from this lead. You can add deals later from the Contacts page.</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Name</Label>
              <Input value={lead.name} disabled className="bg-muted/50" />
            </div>
            <div>
              <Label>Phone</Label>
              <Input value={lead.phone} disabled className="bg-muted/50" />
            </div>
          </div>
          {lead.email && (
            <div>
              <Label>Email</Label>
              <Input value={lead.email} disabled className="bg-muted/50" />
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Relationship</Label>
              <Select value={relationship} onValueChange={setRelationship}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="client">Client</SelectItem>
                  <SelectItem value="partner">Partner</SelectItem>
                  <SelectItem value="principal">Principal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>PAN (optional)</Label>
              <Input value={pan} onChange={e => setPan(e.target.value.toUpperCase())} placeholder="ABCDE1234F" maxLength={10} />
            </div>
          </div>
          <div>
            <Label>City (optional)</Label>
            <Input value={city} onChange={e => setCity(e.target.value)} placeholder="e.g. Mumbai" />
          </div>
          {lead.context && <p className="text-xs text-muted-foreground bg-muted/50 rounded p-2">Context: {lead.context}</p>}
          <Button onClick={handleConvert} disabled={saving} className="w-full">{saving ? 'Converting...' : 'Convert to Contact'}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ---- Main Component ----
export default function AdminUnifiedLeads() {
  const queryClient = useQueryClient();
  const [tab, setTab] = useState('all');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [convertLead, setConvertLead] = useState<{ id?: string; name: string; phone: string; email: string | null; context?: string } | null>(null);

  // Fetch website leads
  const { data: webLeads = [], isLoading: webLoading } = useQuery({
    queryKey: ['leads', statusFilter],
    queryFn: async () => {
      let q = supabase.from('leads').select('*').order('created_at', { ascending: false });
      if (statusFilter !== 'all') q = q.eq('status', statusFilter);
      const { data, error } = await q;
      if (error) throw error;
      return data as WebLead[];
    },
  });

  // Fetch calculator leads
  const { data: calcLeads = [], isLoading: calcLoading } = useQuery({
    queryKey: ['calculator-leads'],
    queryFn: async () => {
      const { data, error } = await supabase.from('calculator_leads').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data as CalcLead[];
    },
  });

  const isLoading = webLoading || calcLoading;

  const filterBySearch = (name: string, phone: string, email: string | null) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return name.toLowerCase().includes(s) || phone.includes(s) || (email ?? '').toLowerCase().includes(s);
  };

  const filteredWeb = webLeads.filter(l => filterBySearch(l.name, l.phone, l.email));
  const filteredCalc = calcLeads.filter(l => filterBySearch(l.name, l.phone, l.email));

  const stats = {
    total: webLeads.length + calcLeads.length,
    webNew: webLeads.filter(l => l.status === 'new').length,
    converted: webLeads.filter(l => l.status === 'converted').length,
    calculator: calcLeads.length,
  };

  const updateStatus = async (id: string, status: string) => {
    setUpdatingId(id);
    await supabase.from('leads').update({ status }).eq('id', id);
    await queryClient.invalidateQueries({ queryKey: ['leads'] });
    setUpdatingId(null);
  };

  const getContextSummary = (lead: WebLead) => {
    if (!lead.context) return null;
    const ctx = lead.context;
    if (lead.source === 'calculator') return ctx.goal_text as string ?? ctx.product_type as string ?? null;
    if (lead.source === 'referral') {
      const ref = (ctx.referee_name as string) ?? '';
      return ref ? `Referring: ${ref}` : null;
    }
    if (lead.source === 'tieup') return (ctx.org_name as string) ?? null;
    if (ctx.service) return `Service: ${ctx.service as string}`;
    return null;
  };

  const formatCalcResult = (result: Record<string, number> | null) => {
    if (!result) return '—';
    const fv = result.futureValue ?? result.requiredMonthly;
    if (!fv) return '—';
    if (fv >= 10000000) return `₹${(fv / 10000000).toFixed(2)} Cr`;
    if (fv >= 100000) return `₹${(fv / 100000).toFixed(2)} L`;
    return `₹${fv.toLocaleString('en-IN')}`;
  };

  const handleConvertClose = (converted?: boolean) => {
    setConvertLead(null);
    if (converted) {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['crm-deals'] });
    }
  };

  return (
    <AdminGuard>
      <AdminLayout title="Leads" subtitle="All captured leads — website forms, calculators, referrals & more">
        <div className="space-y-4">
          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Total Leads', value: stats.total, color: 'text-foreground' },
              { label: 'New', value: stats.webNew, color: 'text-blue-600' },
              { label: 'Converted', value: stats.converted, color: 'text-green-600' },
              { label: 'Calculator', value: stats.calculator, color: 'text-primary' },
            ].map(({ label, value, color }) => (
              <div key={label} className="rounded-lg border border-border bg-background p-3 text-center">
                <p className={`text-xl font-bold ${color}`}>{value}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            <div className="relative flex-1 min-w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search name, phone, email…" value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
            </div>
            {tab === 'all' && (
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]"><SelectValue placeholder="All Statuses" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {STATUS_OPTIONS.map(s => <SelectItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>)}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Tabs */}
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList>
              <TabsTrigger value="all">
                All Sources <Badge variant="secondary" className="ml-1.5 text-[10px]">{webLeads.length}</Badge>
              </TabsTrigger>
              <TabsTrigger value="calculator">
                <Calculator className="h-3.5 w-3.5 mr-1" /> Calculator <Badge variant="secondary" className="ml-1.5 text-[10px]">{calcLeads.length}</Badge>
              </TabsTrigger>
            </TabsList>

            {/* ALL SOURCES TAB */}
            <TabsContent value="all" className="mt-3">
              {isLoading ? (
                <div className="flex items-center justify-center h-40 text-muted-foreground"><Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading…</div>
              ) : filteredWeb.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 gap-2 text-muted-foreground border border-dashed border-border rounded-lg">
                  <Users className="w-8 h-8 opacity-30" /><p className="text-sm">No leads found.</p>
                </div>
              ) : (
                <div className="rounded-lg border border-border overflow-x-auto">
                  <table className="w-full text-sm min-w-[900px]">
                    <thead className="bg-muted/50 text-muted-foreground text-xs uppercase tracking-wide">
                      <tr>
                        <th className="px-4 py-3 text-left">Name</th>
                        <th className="px-4 py-3 text-left">Contact</th>
                        <th className="px-4 py-3 text-left">Source</th>
                        <th className="px-4 py-3 text-left">Context</th>
                        <th className="px-4 py-3 text-left">Status</th>
                        <th className="px-4 py-3 text-left">Date</th>
                        <th className="px-4 py-3 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filteredWeb.map(lead => {
                        const src = SOURCE_LABELS[lead.source] ?? SOURCE_LABELS.website;
                        const SrcIcon = src.icon;
                        return (
                          <tr key={lead.id} className="hover:bg-muted/30 transition-colors">
                            <td className="px-4 py-3 font-medium text-foreground">{lead.name}</td>
                            <td className="px-4 py-3">
                              <div className="flex flex-col gap-0.5">
                                <span className="flex items-center gap-1.5 text-muted-foreground text-xs"><Phone className="w-3 h-3" /> {lead.phone}</span>
                                {lead.email && <span className="flex items-center gap-1.5 text-muted-foreground text-xs"><Mail className="w-3 h-3" /> {lead.email}</span>}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${src.color}`}>
                                <SrcIcon className="w-3 h-3" />{src.label}
                              </span>
                            </td>
                            <td className="px-4 py-3 max-w-[200px]">
                              {getContextSummary(lead) ? <p className="text-xs text-muted-foreground line-clamp-2">{getContextSummary(lead)}</p> : <span className="text-muted-foreground text-xs">—</span>}
                            </td>
                            <td className="px-4 py-3">
                              {updatingId === lead.id ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                                <select value={lead.status} onChange={e => updateStatus(lead.id, e.target.value)}
                                  className={`text-xs px-2 py-1 rounded-full border-0 font-medium cursor-pointer focus:outline-none ${STATUS_COLOR[lead.status] ?? 'bg-muted text-muted-foreground'}`}>
                                  {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                                </select>
                              )}
                            </td>
                            <td className="px-4 py-3 text-muted-foreground text-xs whitespace-nowrap">{format(new Date(lead.created_at), 'dd MMM yy, HH:mm')}</td>
                            <td className="px-4 py-3">
                              {lead.status !== 'converted' && (
                                <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => setConvertLead({
                                  name: lead.name, phone: lead.phone, email: lead.email,
                                  context: getContextSummary(lead) ?? undefined,
                                })}>
                                  <ArrowRight className="h-3 w-3 mr-1" /> Convert
                                </Button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </TabsContent>

            {/* CALCULATOR TAB */}
            <TabsContent value="calculator" className="mt-3">
              {calcLoading ? (
                <div className="flex items-center justify-center h-40 text-muted-foreground"><Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading…</div>
              ) : filteredCalc.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 gap-2 text-muted-foreground border border-dashed border-border rounded-lg">
                  <Target className="w-8 h-8 opacity-30" /><p className="text-sm">No calculator leads yet.</p>
                </div>
              ) : (
                <div className="rounded-lg border border-border overflow-x-auto">
                  <table className="w-full text-sm min-w-[800px]">
                    <thead className="bg-muted/50 text-muted-foreground text-xs uppercase tracking-wide">
                      <tr>
                        <th className="px-4 py-3 text-left">Name</th>
                        <th className="px-4 py-3 text-left">Contact</th>
                        <th className="px-4 py-3 text-left">Goal</th>
                        <th className="px-4 py-3 text-left">Product</th>
                        <th className="px-4 py-3 text-left">AI Result</th>
                        <th className="px-4 py-3 text-left">Date</th>
                        <th className="px-4 py-3 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filteredCalc.map(lead => (
                        <tr key={lead.id} className="hover:bg-muted/30 transition-colors">
                          <td className="px-4 py-3 font-medium text-foreground">{lead.name}</td>
                          <td className="px-4 py-3">
                            <div className="flex flex-col gap-0.5">
                              <span className="flex items-center gap-1.5 text-muted-foreground text-xs"><Phone className="w-3 h-3" /> {lead.phone}</span>
                              {lead.email && <span className="flex items-center gap-1.5 text-muted-foreground text-xs"><Mail className="w-3 h-3" /> {lead.email}</span>}
                            </div>
                          </td>
                          <td className="px-4 py-3 max-w-[200px]"><p className="text-xs text-foreground line-clamp-2">{lead.goal_text}</p></td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium capitalize ${productBadge[lead.product_type] ?? 'bg-muted text-muted-foreground'}`}>
                              <TrendingUp className="w-3 h-3" />{lead.product_type}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-medium text-primary text-xs">{formatCalcResult(lead.calculated_result)}</td>
                          <td className="px-4 py-3 text-muted-foreground text-xs whitespace-nowrap">{format(new Date(lead.created_at), 'dd MMM yy, HH:mm')}</td>
                          <td className="px-4 py-3">
                            <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => setConvertLead({
                              name: lead.name, phone: lead.phone, email: lead.email,
                              context: `${lead.product_type}: ${lead.goal_text}`,
                            })}>
                              <ArrowRight className="h-3 w-3 mr-1" /> Convert
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {convertLead && <ConvertToContactDialog lead={convertLead} open={!!convertLead} onClose={handleConvertClose} />}
      </AdminLayout>
    </AdminGuard>
  );
}
