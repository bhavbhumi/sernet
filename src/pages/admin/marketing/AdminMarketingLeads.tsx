import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { subDays, format } from 'date-fns';
import { Link } from '@/lib/router-compat';
import { AdminGuard } from '@/components/admin/AdminGuard';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { readAllMISRows } from '@/lib/misRefresh';
import { attributionLabel } from '@/lib/leadAttribution';
import { ADMIN_ROUTES } from '@/lib/adminRoutes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type LeadRow = {
  id: string; name: string; source: string; lead_type: string; status: string;
  assigned_to: string | null; created_at: string; context: unknown;
};

const RANGES = [
  { value: '7', label: 'Last 7 days' },
  { value: '30', label: 'Last 30 days' },
  { value: '90', label: 'Last 90 days' },
  { value: 'all', label: 'All time' },
];

const FORM_LABELS: Record<string, string> = {
  open_account: 'Open Account', 'ask-us': 'Ask Us', 'schedule-call': 'Schedule a Call',
  calculator: 'Calculators', referral: 'Referral', tieup: 'Tie-up', website: 'Website',
};

function tally(rows: LeadRow[], key: (r: LeadRow) => string) {
  const map = new Map<string, { total: number; unassigned: number; converted: number }>();
  for (const r of rows) {
    const k = key(r);
    const e = map.get(k) ?? { total: 0, unassigned: 0, converted: 0 };
    e.total += 1;
    if (!r.assigned_to) e.unassigned += 1;
    if (r.status === 'converted') e.converted += 1;
    map.set(k, e);
  }
  return [...map.entries()].sort((a, b) => b[1].total - a[1].total);
}

function BreakdownTable({ title, rows }: { title: string; rows: ReturnType<typeof tally> }) {
  return (
    <Card>
      <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">{title}</CardTitle></CardHeader>
      <CardContent>
        {rows.length === 0 ? <p className="text-sm text-muted-foreground">No leads in this period.</p> : (
          <table className="w-full text-sm">
            <thead><tr className="text-left text-xs text-muted-foreground border-b border-border">
              <th className="py-2 font-medium">{title.replace(/^By /, '').replace(/^\w/, c => c.toUpperCase())}</th><th className="py-2 font-medium text-right">Leads</th>
              <th className="py-2 font-medium text-right">Unassigned</th><th className="py-2 font-medium text-right">Converted</th>
            </tr></thead>
            <tbody className="divide-y divide-border">
              {rows.map(([k, v]) => (
                <tr key={k}><td className="py-2 text-foreground">{k}</td><td className="py-2 text-right">{v.total}</td>
                  <td className="py-2 text-right">{v.unassigned}</td><td className="py-2 text-right">{v.converted}</td></tr>
              ))}
            </tbody>
          </table>
        )}
      </CardContent>
    </Card>
  );
}

async function exactCount(q: PromiseLike<{ count: number | null; error: { message: string } | null }>) {
  const { count, error } = await q;
  if (error) throw new Error(error.message);
  return count ?? 0;
}

type DraftRow = { id: string; title: string; thumbnail_url: string | null; post_type: string | null; excerpt: string | null; item_date: string | null };

/** Things waiting on someone — every count opens the list where it is handled. */
function ActionNeeded() {
  const { data, error, isLoading } = useQuery({
    queryKey: ['marketing-action-needed'],
    queryFn: async () => {
      const t = (n: string) => supabase.from(n as any) as any;
      const head = { count: 'exact', head: true } as const;
      const [drafts, review, approved, subs, campaigns, lowRatings, pendingReviews] = await Promise.all([
        readAllMISRows<DraftRow>((from, to) => t('articles').select('id,title,thumbnail_url,post_type,excerpt,item_date').eq('status', 'draft').order('item_date', { ascending: false, nullsFirst: false }).range(from, to)),
        exactCount(t('newsletters').select('id', head).eq('status', 'in_review')),
        exactCount(t('newsletters').select('id', head).eq('status', 'approved')),
        exactCount(t('newsletter_subscribers').select('id', head).eq('status', 'active')),
        exactCount(t('campaigns').select('id', head).eq('status', 'active')),
        exactCount(t('ticket_feedback').select('id', head).eq('follow_up_status', 'pending')),
        exactCount(t('reviews').select('id', head).eq('status', 'pending')),
      ]);
      return { drafts, review, approved, subs, campaigns, lowRatings, pendingReviews };
    },
  });
  if (error) return <p className="text-sm text-destructive mb-6">Could not load action items: {(error as Error).message}</p>;
  const missing = (d: DraftRow) => [!d.thumbnail_url && 'cover', !d.post_type && 'type', !(d.excerpt ?? '').trim() && 'summary', !d.item_date && 'date'].filter(Boolean) as string[];
  const incomplete = (data?.drafts ?? []).filter(d => missing(d).length);
  const tiles: [string, number | undefined, string][] = [
    ['Drafts not ready', incomplete.length, ADMIN_ROUTES.marketing.content.posts],
    ['Drafts ready to publish', data ? data.drafts.length - incomplete.length : undefined, ADMIN_ROUTES.marketing.content.posts],
    ['Newsletters needing review', data?.review, ADMIN_ROUTES.marketing.engagement.composer],
    ['Newsletters approved, not sent', data?.approved, ADMIN_ROUTES.marketing.engagement.composer],
    ['Active subscribers', data?.subs, ADMIN_ROUTES.marketing.engagement.newsletter],
    ['Active campaigns', data?.campaigns, ADMIN_ROUTES.marketing.campaigns.tracker],
    ['Low ratings to follow up', data?.lowRatings, ADMIN_ROUTES.marketing.engagement.ticketFeedback],
    ['Reviews awaiting approval', data?.pendingReviews, ADMIN_ROUTES.marketing.engagement.reviews],
  ];
  return (
    <div className="mb-8">
      <h2 className="text-sm font-semibold text-foreground mb-3">Action needed</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {tiles.map(([label, value, href]) => (
          <Link key={label} to={href} className="block"><Card className="hover:border-primary/50 transition-colors"><CardContent className="p-4">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-2xl font-semibold text-foreground">{isLoading ? '…' : value}</p>
          </CardContent></Card></Link>
        ))}
      </div>
      {incomplete.length > 0 && (
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Drafts missing something before publishing</CardTitle></CardHeader>
          <CardContent><ul className="divide-y divide-border">
            {incomplete.slice(0, 15).map(d => (
              <li key={d.id} className="py-2 flex flex-wrap items-center gap-2 text-sm">
                <span className="text-foreground">{d.title}</span>
                <span className="ml-auto flex gap-1">{missing(d).map(m => <Badge key={m} variant="outline">No {m}</Badge>)}</span>
              </li>
            ))}
          </ul>{incomplete.length > 15 && <p className="text-xs text-muted-foreground mt-2">+{incomplete.length - 15} more in Posts.</p>}</CardContent></Card>
      )}
    </div>
  );
}

function LeadsOverviewContent() {
  const [range, setRange] = useState('30');
  const { data: leads = [], error, isLoading } = useQuery({
    queryKey: ['marketing-leads-overview', range],
    queryFn: () => readAllMISRows<LeadRow>((from, to) => {
      let q = supabase.from('leads').select('id,name,source,lead_type,status,assigned_to,created_at,context')
        .order('created_at', { ascending: false }).range(from, to);
      if (range !== 'all') q = q.gte('created_at', subDays(new Date(), Number(range)).toISOString());
      return q as unknown as PromiseLike<{ data: LeadRow[] | null; error: { message: string } | null }>;
    }),
  });

  const stats = useMemo(() => ({
    total: leads.length,
    fresh: leads.filter(l => l.status === 'new').length,
    unassigned: leads.filter(l => !l.assigned_to && l.status !== 'converted').length,
    converted: leads.filter(l => l.status === 'converted').length,
    attributed: leads.filter(l => attributionLabel(l.context).channel !== 'direct / unknown').length,
  }), [leads]);

  const byChannel = useMemo(() => tally(leads, l => attributionLabel(l.context).channel), [leads]);
  const byCampaign = useMemo(() => tally(leads.filter(l => attributionLabel(l.context).campaign), l => attributionLabel(l.context).campaign!), [leads]);
  const byForm = useMemo(() => tally(leads, l => FORM_LABELS[l.source] ?? l.source), [leads]);
  const waiting = leads.filter(l => !l.assigned_to && l.status !== 'converted').slice(0, 10);

  return (
    <AdminLayout title="Marketing Overview" subtitle="What needs attention, where enquiries come from and whether Sales has picked them up">
      <ActionNeeded />
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <Select value={range} onValueChange={setRange}>
          <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
          <SelectContent>{RANGES.map(r => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}</SelectContent>
        </Select>
        <Button asChild variant="outline" size="sm" className="ml-auto"><Link to={ADMIN_ROUTES.sales.leads}>Open Sales leads</Link></Button>
      </div>

      {error ? (
        <p className="text-sm text-destructive">Could not load leads: {(error as Error).message}</p>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
            {[
              ['Total leads', stats.total], ['New', stats.fresh], ['Awaiting owner', stats.unassigned],
              ['Converted', stats.converted], ['With known source', stats.attributed],
            ].map(([label, value]) => (
              <Card key={label as string}><CardContent className="p-4">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-2xl font-semibold text-foreground">{isLoading ? '…' : value}</p>
              </CardContent></Card>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-4 mb-6">
            <BreakdownTable title="By channel" rows={byChannel} />
            <BreakdownTable title="By campaign" rows={byCampaign} />
            <BreakdownTable title="By website form" rows={byForm} />
          </div>

          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Waiting for an owner (latest 10)</CardTitle></CardHeader>
            <CardContent>
              {waiting.length === 0 ? <p className="text-sm text-muted-foreground">Every open lead has an owner.</p> : (
                <ul className="divide-y divide-border">
                  {waiting.map(l => (
                    <li key={l.id} className="py-2 flex flex-wrap items-center gap-2 text-sm">
                      <span className="font-medium text-foreground">{l.name}</span>
                      <Badge variant="outline">{FORM_LABELS[l.source] ?? l.source}</Badge>
                      <span className="text-xs text-muted-foreground">{attributionLabel(l.context).channel}</span>
                      <span className="text-xs text-muted-foreground ml-auto">{format(new Date(l.created_at), 'dd MMM yyyy')}</span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
          <p className="text-xs text-muted-foreground mt-4">Source tracking began on 9 November 2026; earlier leads show as direct / unknown. Converted means Sales converted the enquiry into a contact — not an opened or funded account.</p>
        </>
      )}
    </AdminLayout>
  );
}

export default function AdminMarketingLeads() {
  return <AdminGuard><LeadsOverviewContent /></AdminGuard>;
}
