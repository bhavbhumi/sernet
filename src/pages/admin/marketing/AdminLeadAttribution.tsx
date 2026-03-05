import { AdminGuard } from '@/components/admin/AdminGuard';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, CartesianGrid } from 'recharts';
import { useState, useMemo } from 'react';
import { format, subDays, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { TrendingUp, Users, Target, Zap } from 'lucide-react';

const COLORS = ['hsl(var(--primary))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))', '#94a3b8'];

const DATE_RANGES = [
  { label: 'Last 7 days', value: '7d' },
  { label: 'Last 30 days', value: '30d' },
  { label: 'This month', value: 'month' },
  { label: 'Last 3 months', value: '3m' },
  { label: 'All time', value: 'all' },
];

function getDateFilter(range: string) {
  const now = new Date();
  switch (range) {
    case '7d': return subDays(now, 7).toISOString();
    case '30d': return subDays(now, 30).toISOString();
    case 'month': return startOfMonth(now).toISOString();
    case '3m': return subMonths(now, 3).toISOString();
    default: return '2000-01-01T00:00:00Z';
  }
}

export default function AdminLeadAttribution() {
  const [range, setRange] = useState('30d');

  const { data: leads = [] } = useQuery({
    queryKey: ['lead-attribution', range],
    queryFn: async () => {
      const since = getDateFilter(range);
      const { data } = await supabase
        .from('leads')
        .select('id, source, lead_type, status, created_at')
        .gte('created_at', since)
        .order('created_at', { ascending: false });
      return data || [];
    },
  });

  const bySource = useMemo(() => {
    const map: Record<string, number> = {};
    leads.forEach(l => { map[l.source] = (map[l.source] || 0) + 1; });
    return Object.entries(map)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [leads]);

  const byType = useMemo(() => {
    const map: Record<string, number> = {};
    leads.forEach(l => { map[l.lead_type] = (map[l.lead_type] || 0) + 1; });
    return Object.entries(map)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [leads]);

  const byStatus = useMemo(() => {
    const map: Record<string, number> = {};
    leads.forEach(l => { map[l.status] = (map[l.status] || 0) + 1; });
    return Object.entries(map)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [leads]);

  const byDay = useMemo(() => {
    const map: Record<string, number> = {};
    leads.forEach(l => {
      const day = format(new Date(l.created_at), 'dd MMM');
      map[day] = (map[day] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  }, [leads]);

  const converted = leads.filter(l => l.status === 'converted').length;
  const conversionRate = leads.length > 0 ? ((converted / leads.length) * 100).toFixed(1) : '0';

  return (
    <AdminGuard>
      <AdminLayout title="Lead Attribution" subtitle="Understand which sources and campaigns drive your leads">
        <div className="space-y-6">
        <div className="flex items-end justify-end">
          <Select value={range} onValueChange={setRange}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              {DATE_RANGES.map(r => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1"><Users className="h-3.5 w-3.5" /> Total Leads</div>
              <p className="text-2xl font-bold text-foreground">{leads.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1"><Target className="h-3.5 w-3.5" /> Converted</div>
              <p className="text-2xl font-bold text-foreground">{converted}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1"><TrendingUp className="h-3.5 w-3.5" /> Conversion Rate</div>
              <p className="text-2xl font-bold text-foreground">{conversionRate}%</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1"><Zap className="h-3.5 w-3.5" /> Top Source</div>
              <p className="text-2xl font-bold text-foreground capitalize">{bySource[0]?.name || '—'}</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Lead Trend */}
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">Lead Volume Over Time</CardTitle></CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={byDay}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} className="fill-muted-foreground" />
                  <YAxis tick={{ fontSize: 10 }} className="fill-muted-foreground" allowDecimals={false} />
                  <Tooltip contentStyle={{ background: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
                  <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* By Source Pie */}
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">By Source</CardTitle></CardHeader>
            <CardContent className="h-64 flex items-center gap-4">
              <ResponsiveContainer width="50%" height="100%">
                <PieChart>
                  <Pie data={bySource} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} innerRadius={40}>
                    {bySource.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1.5 text-xs">
                {bySource.map((s, i) => (
                  <div key={s.name} className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                    <span className="capitalize text-foreground">{s.name}</span>
                    <span className="text-muted-foreground ml-auto">{s.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* By Type */}
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">By Lead Type</CardTitle></CardHeader>
            <CardContent className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={byType} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis type="number" tick={{ fontSize: 10 }} className="fill-muted-foreground" allowDecimals={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} className="fill-muted-foreground" width={80} />
                  <Tooltip contentStyle={{ background: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
                  <Bar dataKey="value" fill="hsl(var(--chart-2))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* By Status */}
          <Card>
            <CardHeader className="pb-2"><CardTitle className="text-sm">By Status</CardTitle></CardHeader>
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-2">
                {byStatus.map(s => (
                  <Badge key={s.name} variant="outline" className="text-sm py-1.5 px-3 capitalize">
                    {s.name} <span className="ml-1.5 font-bold text-foreground">{s.value}</span>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        </div>
      </AdminLayout>
    </AdminGuard>
  );
}
