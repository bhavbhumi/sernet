import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { AdminGuard } from '@/components/admin/AdminGuard';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { readAllMISRows } from '@/lib/misRefresh';
import { attributionLabel } from '@/lib/leadAttribution';
import { ADMIN_ROUTES } from '@/lib/adminRoutes';
import { Link } from '@/lib/router-compat';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

type Row = { id: string; name: string; phone: string; email: string | null; status: string; assigned_to: string | null; created_at: string; context: Record<string, unknown> | null };

function Content() {
  const { data = [], error, isLoading } = useQuery({
    queryKey: ['calculator-enquiries'],
    queryFn: () => readAllMISRows<Row>((from, to) => supabase.from('leads')
      .select('id,name,phone,email,status,assigned_to,created_at,context')
      .eq('source', 'calculator').order('created_at', { ascending: false }).range(from, to) as unknown as PromiseLike<{ data: Row[] | null; error: { message: string } | null }>),
  });

  const byCalc = new Map<string, number>();
  data.forEach(r => { const k = String(r.context?.calculator ?? 'unknown'); byCalc.set(k, (byCalc.get(k) ?? 0) + 1); });

  return (
    <AdminLayout title="Calculators" subtitle="Proposal requests from the public calculators. Each request is also a Sales lead.">
      <div className="flex flex-wrap gap-2 mb-4 items-center">
        {[...byCalc.entries()].map(([k, v]) => <Badge key={k} variant="outline">{k}: {v}</Badge>)}
        <Button asChild size="sm" variant="outline" className="ml-auto"><a href="/calculators" target="_blank" rel="noopener noreferrer">Open public calculators</a></Button>
        <Button asChild size="sm" variant="outline"><Link to={ADMIN_ROUTES.sales.leads}>Open Sales leads</Link></Button>
      </div>
      {error ? <p className="text-sm text-destructive">Could not load enquiries: {(error as Error).message}</p> : (
        <div className="bg-card border border-border rounded-xl overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border bg-muted/30 text-left text-muted-foreground">
              <th className="px-4 py-3 font-medium">Name</th><th className="px-4 py-3 font-medium">Calculator</th>
              <th className="px-4 py-3 font-medium">Result</th><th className="px-4 py-3 font-medium">Source</th>
              <th className="px-4 py-3 font-medium">Owner</th><th className="px-4 py-3 font-medium">Date</th>
            </tr></thead>
            <tbody className="divide-y divide-border">
              {isLoading ? <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">Loading…</td></tr>
                : data.length === 0 ? <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">No calculator proposal requests yet.</td></tr>
                : data.map(r => (
                  <tr key={r.id}>
                    <td className="px-4 py-3"><p className="font-medium text-foreground">{r.name}</p><p className="text-xs text-muted-foreground">{r.phone}{r.email ? ` · ${r.email}` : ''}</p></td>
                    <td className="px-4 py-3">{String(r.context?.calculator ?? '—')}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground max-w-xs">{String(r.context?.primary_result ?? r.context?.result_summary ?? '—')}</td>
                    <td className="px-4 py-3 text-xs">{attributionLabel(r.context).channel}</td>
                    <td className="px-4 py-3">{r.assigned_to ? <Badge variant="secondary">Assigned</Badge> : <Badge variant="outline">Awaiting owner</Badge>}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{format(new Date(r.created_at), 'dd MMM yyyy')}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}

export default function AdminCalculatorEnquiries() {
  return <AdminGuard><Content /></AdminGuard>;
}
