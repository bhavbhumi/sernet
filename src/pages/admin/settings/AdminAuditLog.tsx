import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, ChevronLeft, ChevronRight, Shield } from 'lucide-react';
import { format } from 'date-fns';

interface AuditEntry {
  id: string;
  created_at: string;
  user_email: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  details: Record<string, unknown>;
  ip_address: string | null;
  user_agent: string | null;
  source: string;
}

const PAGE_SIZE = 30;

const actionColors: Record<string, string> = {
  create: 'bg-green-500/10 text-green-700 dark:text-green-400',
  update: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
  delete: 'bg-destructive/10 text-destructive',
  publish: 'bg-primary/10 text-primary',
  unpublish: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400',
  import: 'bg-purple-500/10 text-purple-700 dark:text-purple-400',
  login: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
  logout: 'bg-muted text-muted-foreground',
  settings_change: 'bg-orange-500/10 text-orange-700 dark:text-orange-400',
  status_change: 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-400',
};

export default function AdminAuditLog() {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterAction, setFilterAction] = useState('all');
  const [filterEntity, setFilterEntity] = useState('all');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchLogs = async () => {
    setLoading(true);
    let query = (supabase.from('audit_logs') as any)
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (filterAction !== 'all') query = query.eq('action', filterAction);
    if (filterEntity !== 'all') query = query.eq('entity_type', filterEntity);
    if (search) query = query.or(`user_email.ilike.%${search}%,entity_type.ilike.%${search}%,action.ilike.%${search}%`);

    query = query.range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);

    const { data, count } = await query;
    setEntries(data ?? []);
    setTotal(count ?? 0);
    setLoading(false);
  };

  useEffect(() => { fetchLogs(); }, [page, filterAction, filterEntity, search]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  // Collect unique actions and entity types from current data
  const uniqueActions = ['all', ...new Set(entries.map(e => e.action))];
  const uniqueEntities = ['all', ...new Set(entries.map(e => e.entity_type))];

  const formatDetails = (details: Record<string, unknown>) => {
    if (!details || Object.keys(details).length === 0) return null;
    return Object.entries(details)
      .filter(([, v]) => v !== null && v !== undefined)
      .map(([k, v]) => `${k}: ${typeof v === 'object' ? JSON.stringify(v) : String(v)}`)
      .join(' · ');
  };

  return (
    <AdminLayout
      title="Audit Log"
      subtitle="Complete trail of all admin actions for internal security"
      actions={<Badge variant="outline" className="gap-1.5"><Shield className="h-3.5 w-3.5" /> Super Admin Only</Badge>}
    >
      {/* Filters */}
      <div className="flex gap-3 mb-4 flex-wrap items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by email, entity, action..." className="pl-9" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
        </div>
        <Select value={filterAction} onValueChange={v => { setFilterAction(v); setPage(1); }}>
          <SelectTrigger className="w-36"><SelectValue placeholder="Action" /></SelectTrigger>
          <SelectContent>
            {uniqueActions.map(a => <SelectItem key={a} value={a}>{a === 'all' ? 'All Actions' : a}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={filterEntity} onValueChange={v => { setFilterEntity(v); setPage(1); }}>
          <SelectTrigger className="w-44"><SelectValue placeholder="Entity" /></SelectTrigger>
          <SelectContent>
            {uniqueEntities.map(e => <SelectItem key={e} value={e}>{e === 'all' ? 'All Entities' : e}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Stats */}
      <div className="text-xs text-muted-foreground mb-3">{total} log entries</div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground w-40">Timestamp</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">User</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground w-28">Action</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground w-32">Entity</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Details</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground w-20">Source</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i}><td colSpan={6} className="px-4 py-3"><div className="h-4 bg-muted animate-pulse rounded" /></td></tr>
                ))
              ) : entries.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">No audit entries found.</td></tr>
              ) : entries.map(entry => (
                <tr key={entry.id} className="hover:bg-muted/20">
                  <td className="px-4 py-2.5 text-xs text-muted-foreground whitespace-nowrap">
                    {format(new Date(entry.created_at), 'dd MMM yyyy, HH:mm:ss')}
                  </td>
                  <td className="px-4 py-2.5 text-foreground text-xs">
                    {entry.user_email || <span className="text-muted-foreground italic">system</span>}
                  </td>
                  <td className="px-4 py-2.5">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${actionColors[entry.action] || 'bg-muted text-muted-foreground'}`}>
                      {entry.action}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-xs text-muted-foreground">{entry.entity_type}</td>
                  <td className="px-4 py-2.5 text-xs text-muted-foreground max-w-xs truncate" title={formatDetails(entry.details) || ''}>
                    {formatDetails(entry.details) || '—'}
                  </td>
                  <td className="px-4 py-2.5">
                    <Badge variant="secondary" className="text-[10px]">{entry.source}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-end gap-1.5 mt-4">
          <span className="text-xs text-muted-foreground mr-2">
            {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, total)} of {total}
          </span>
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            className="flex items-center gap-0.5 px-2 py-1.5 text-xs rounded-md border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
            <ChevronLeft className="h-3.5 w-3.5" /> Prev
          </button>
          <span className="text-xs text-muted-foreground">Page {page} of {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            className="flex items-center gap-0.5 px-2 py-1.5 text-xs rounded-md border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
            Next <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </AdminLayout>
  );
}
