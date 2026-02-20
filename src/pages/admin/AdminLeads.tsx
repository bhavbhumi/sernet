import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AdminLayout } from '@/components/admin/AdminLayout';
import {
  Users, Phone, Mail, Calculator, HandshakeIcon, GitBranch,
  TrendingUp, Filter, Search, ChevronDown, Loader2
} from 'lucide-react';
import { format } from 'date-fns';

type Lead = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  source: string;
  lead_type: string;
  status: string;
  context: Record<string, unknown> | null;
  notes: string | null;
  created_at: string;
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

const STATUS_OPTIONS = ['all', 'new', 'contacted', 'qualified', 'converted', 'lost'];
const SOURCE_OPTIONS = ['all', ...Object.keys(SOURCE_LABELS)];

const STATUS_COLOR: Record<string, string> = {
  new:       'bg-blue-500/10 text-blue-600',
  contacted: 'bg-amber-500/10 text-amber-600',
  qualified: 'bg-purple-500/10 text-purple-600',
  converted: 'bg-green-500/10 text-green-600',
  lost:      'bg-rose-500/10 text-rose-600',
};

const AdminLeads = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const { data: leads = [], isLoading, refetch } = useQuery({
    queryKey: ['leads', statusFilter, sourceFilter],
    queryFn: async () => {
      let q = supabase.from('leads').select('*').order('created_at', { ascending: false });
      if (statusFilter !== 'all') q = q.eq('status', statusFilter);
      if (sourceFilter !== 'all') q = q.eq('source', sourceFilter);
      const { data, error } = await q;
      if (error) throw error;
      return data as Lead[];
    },
  });

  const filtered = leads.filter((l) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return l.name.toLowerCase().includes(s) || l.phone.includes(s) || (l.email ?? '').toLowerCase().includes(s);
  });

  const stats = {
    total: leads.length,
    new: leads.filter((l) => l.status === 'new').length,
    converted: leads.filter((l) => l.status === 'converted').length,
    calculator: leads.filter((l) => l.source === 'calculator').length,
    referral: leads.filter((l) => l.source === 'referral').length,
    tieup: leads.filter((l) => l.source === 'tieup').length,
  };

  const updateStatus = async (id: string, status: string) => {
    setUpdatingId(id);
    await supabase.from('leads').update({ status }).eq('id', id);
    await refetch();
    setUpdatingId(null);
  };

  const getContextSummary = (lead: Lead) => {
    if (!lead.context) return null;
    const ctx = lead.context;
    if (lead.source === 'calculator') {
      return ctx.goal_text as string ?? ctx.product_type as string ?? null;
    }
    if (lead.source === 'referral') {
      const ref = (ctx.referee_name as string) ?? '';
      const type = (ctx.referral_type as string) ?? '';
      return ref ? `Referring: ${ref}${type ? ` (${type})` : ''}` : null;
    }
    if (lead.source === 'tieup') {
      return (ctx.org_name as string) ?? (ctx.category as string) ?? null;
    }
    if (ctx.service) return `Service: ${ctx.service as string}`;
    return null;
  };

  return (
    <AdminLayout title="Leads">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Users className="w-6 h-6 text-primary" />
          <div>
            <h1 className="text-2xl font-bold text-foreground">Leads</h1>
            <p className="text-sm text-muted-foreground">All captured leads across the website — calculator, referrals, tieups and more</p>
          </div>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: 'Total', value: stats.total, color: 'text-foreground' },
            { label: 'New', value: stats.new, color: 'text-blue-600' },
            { label: 'Converted', value: stats.converted, color: 'text-green-600' },
            { label: 'AI Calculator', value: stats.calculator, color: 'text-primary' },
            { label: 'Referrals', value: stats.referral, color: 'text-green-600' },
            { label: 'Tie-ups', value: stats.tieup, color: 'text-amber-600' },
          ].map(({ label, value, color }) => (
            <div key={label} className="rounded-lg border border-border bg-background p-4 text-center">
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name, phone or email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="pl-9 pr-8 py-2 text-sm rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 appearance-none"
            >
              {SOURCE_OPTIONS.map((s) => (
                <option key={s} value={s}>{s === 'all' ? 'All Sources' : SOURCE_LABELS[s]?.label ?? s}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-3 pr-8 py-2 text-sm rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 appearance-none"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s === 'all' ? 'All Statuses' : s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="flex items-center justify-center h-40 text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading leads…
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 gap-2 text-muted-foreground border border-dashed border-border rounded-lg">
            <Users className="w-8 h-8 opacity-30" />
            <p className="text-sm">No leads found. They'll appear here when users submit forms.</p>
          </div>
        ) : (
          <div className="rounded-lg border border-border overflow-x-auto">
            <table className="w-full text-sm min-w-[800px]">
              <thead className="bg-muted/50 text-muted-foreground text-xs uppercase tracking-wide">
                <tr>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Contact</th>
                  <th className="px-4 py-3 text-left">Source</th>
                  <th className="px-4 py-3 text-left">Context</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((lead) => {
                  const src = SOURCE_LABELS[lead.source] ?? SOURCE_LABELS.website;
                  const SrcIcon = src.icon;
                  const contextSummary = getContextSummary(lead);
                  return (
                    <tr key={lead.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-medium text-foreground">{lead.name}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-0.5">
                          <span className="flex items-center gap-1.5 text-muted-foreground text-xs">
                            <Phone className="w-3 h-3" /> {lead.phone}
                          </span>
                          {lead.email && (
                            <span className="flex items-center gap-1.5 text-muted-foreground text-xs">
                              <Mail className="w-3 h-3" /> {lead.email}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${src.color}`}>
                          <SrcIcon className="w-3 h-3" />
                          {src.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 max-w-[220px]">
                        {contextSummary ? (
                          <p className="text-xs text-muted-foreground line-clamp-2">{contextSummary}</p>
                        ) : (
                          <span className="text-muted-foreground text-xs">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {updatingId === lead.id ? (
                            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                          ) : (
                            <select
                              value={lead.status}
                              onChange={(e) => updateStatus(lead.id, e.target.value)}
                              className={`text-xs px-2 py-1 rounded-full border-0 font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/30 ${STATUS_COLOR[lead.status] ?? 'bg-muted text-muted-foreground'}`}
                            >
                              {STATUS_OPTIONS.filter(s => s !== 'all').map((s) => (
                                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                              ))}
                            </select>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground text-xs whitespace-nowrap">
                        {format(new Date(lead.created_at), 'dd MMM yy, HH:mm')}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminLeads;
