import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  RefreshCw, AlertTriangle, AlertCircle, CheckCircle2, Info,
  Database, Server, Globe, Zap, Users, ShieldCheck,
  Newspaper, Headphones, TrendingUp, Clock
} from 'lucide-react';

interface HealthData {
  timestamp: string;
  health_score: number;
  status: 'healthy' | 'warning' | 'critical';
  issues: Array<{ severity: 'critical' | 'warning' | 'info'; area: string; message: string }>;
  summary: {
    content: { total: number; drafts: number; published: number; missing_thumbnails: number; expired_bulletins: number };
    support: { total_tickets: number; open: number; breached: number; kb_articles: number };
    sales: { total_deals: number; open_deals: number; stale_deals: number; leads: number; calculator_leads: number; contacts: number };
    workflows: { total_rules: number; active_rules: number; recent_executions: number; recent_errors: number };
    users: { staff: number; portal: number; pending_partners: number };
    database: { total_tables: number; table_counts: Record<string, number> };
    scheduled_tasks: Array<{ name: string; schedule: string; active: boolean }>;
  };
}

const severityIcon = {
  critical: <AlertCircle className="h-4 w-4 text-destructive" />,
  warning: <AlertTriangle className="h-4 w-4 text-yellow-500" />,
  info: <Info className="h-4 w-4 text-blue-500" />,
};

const severityBadge = {
  critical: 'destructive' as const,
  warning: 'outline' as const,
  info: 'secondary' as const,
};

function StatRow({ label, value, sub }: { label: string; value: number | string; sub?: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className="text-right">
        <span className="text-sm font-semibold text-foreground">{value}</span>
        {sub && <span className="text-xs text-muted-foreground ml-1">({sub})</span>}
      </div>
    </div>
  );
}

export default function AdminHealth() {
  const [data, setData] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<string>('');

  const fetchHealth = async () => {
    setLoading(true);
    try {
      const { data: result, error } = await supabase.functions.invoke('health-check');
      if (error) throw error;
      setData(result as HealthData);
      setLastRefresh(new Date().toLocaleTimeString());
    } catch (err) {
      console.error('Health check failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHealth(); }, []);

  const scoreColor = !data ? 'text-muted-foreground'
    : data.health_score >= 80 ? 'text-emerald-500'
    : data.health_score >= 60 ? 'text-yellow-500'
    : 'text-destructive';

  const statusIcon = !data ? null
    : data.status === 'healthy' ? <CheckCircle2 className="h-8 w-8 text-emerald-500" />
    : data.status === 'warning' ? <AlertTriangle className="h-8 w-8 text-yellow-500" />
    : <AlertCircle className="h-8 w-8 text-destructive" />;

  return (
    <AdminLayout title="System Health" subtitle="End-to-end project diagnostics">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          {statusIcon}
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-4xl font-bold ${scoreColor}`}>
                {loading ? '—' : data?.health_score}
              </span>
              <span className="text-sm text-muted-foreground">/100</span>
            </div>
            <p className="text-xs text-muted-foreground">
              {lastRefresh ? `Last checked: ${lastRefresh}` : 'Loading...'}
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={fetchHealth} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Health bar */}
      {data && (
        <Progress value={data.health_score} className="h-2 mb-6" />
      )}

      {/* Issues */}
      {data && data.issues.length > 0 && (
        <Card className="p-4 mb-6">
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" /> Active Issues ({data.issues.length})
          </h3>
          <div className="space-y-2">
            {data.issues.map((issue, i) => (
              <div key={i} className="flex items-start gap-3 py-2 border-b border-border last:border-0">
                {severityIcon[issue.severity]}
                <div className="flex-1">
                  <p className="text-sm">{issue.message}</p>
                </div>
                <Badge variant={severityBadge[issue.severity]} className="text-[10px]">
                  {issue.area}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Detail tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview" className="text-xs"><Globe className="h-3 w-3 mr-1" />Overview</TabsTrigger>
          <TabsTrigger value="content" className="text-xs"><Newspaper className="h-3 w-3 mr-1" />Content</TabsTrigger>
          <TabsTrigger value="sales" className="text-xs"><TrendingUp className="h-3 w-3 mr-1" />Sales</TabsTrigger>
          <TabsTrigger value="support" className="text-xs"><Headphones className="h-3 w-3 mr-1" />Support</TabsTrigger>
          <TabsTrigger value="backend" className="text-xs"><Server className="h-3 w-3 mr-1" />Backend</TabsTrigger>
          <TabsTrigger value="database" className="text-xs"><Database className="h-3 w-3 mr-1" />Database</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          {data && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Newspaper className="h-4 w-4 text-blue-500" />
                  <h4 className="text-sm font-semibold">Content</h4>
                </div>
                <p className="text-2xl font-bold">{data.summary.content.total}</p>
                <p className="text-xs text-muted-foreground">{data.summary.content.published} published · {data.summary.content.drafts} drafts</p>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="h-4 w-4 text-emerald-500" />
                  <h4 className="text-sm font-semibold">Sales</h4>
                </div>
                <p className="text-2xl font-bold">{data.summary.sales.total_deals}</p>
                <p className="text-xs text-muted-foreground">{data.summary.sales.open_deals} open · {data.summary.sales.leads} leads</p>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Headphones className="h-4 w-4 text-cyan-500" />
                  <h4 className="text-sm font-semibold">Support</h4>
                </div>
                <p className="text-2xl font-bold">{data.summary.support.total_tickets}</p>
                <p className="text-xs text-muted-foreground">{data.summary.support.open} open · {data.summary.support.breached} breached</p>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="h-4 w-4 text-violet-500" />
                  <h4 className="text-sm font-semibold">Users</h4>
                </div>
                <p className="text-2xl font-bold">{data.summary.users.staff + data.summary.users.portal}</p>
                <p className="text-xs text-muted-foreground">{data.summary.users.staff} staff · {data.summary.users.portal} portal</p>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="content">
          <Card className="p-4">
            {data && (
              <>
                <StatRow label="Total content items" value={data.summary.content.total} />
                <StatRow label="Published articles" value={data.summary.content.published} />
                <StatRow label="Draft articles" value={data.summary.content.drafts} />
                <StatRow label="Missing thumbnails" value={data.summary.content.missing_thumbnails} />
                <StatRow label="Expired bulletins (still published)" value={data.summary.content.expired_bulletins} />
              </>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="sales">
          <Card className="p-4">
            {data && (
              <>
                <StatRow label="Total deals" value={data.summary.sales.total_deals} />
                <StatRow label="Open deals" value={data.summary.sales.open_deals} />
                <StatRow label="Stale deals (30+ days)" value={data.summary.sales.stale_deals} />
                <StatRow label="Website leads" value={data.summary.sales.leads} />
                <StatRow label="Calculator leads" value={data.summary.sales.calculator_leads} />
                <StatRow label="CRM contacts" value={data.summary.sales.contacts} />
              </>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="support">
          <Card className="p-4">
            {data && (
              <>
                <StatRow label="Total tickets" value={data.summary.support.total_tickets} />
                <StatRow label="Open tickets" value={data.summary.support.open} />
                <StatRow label="TAT breached" value={data.summary.support.breached} />
                <StatRow label="Knowledge base articles" value={data.summary.support.kb_articles} />
              </>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="backend">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="h-4 w-4 text-amber-500" />
                <h4 className="text-sm font-semibold">Workflow Engine</h4>
              </div>
              {data && (
                <>
                  <StatRow label="Active rules" value={data.summary.workflows.active_rules} sub={`of ${data.summary.workflows.total_rules}`} />
                  <StatRow label="Executions (7d)" value={data.summary.workflows.recent_executions} />
                  <StatRow label="Errors (7d)" value={data.summary.workflows.recent_errors} />
                </>
              )}
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="h-4 w-4 text-blue-500" />
                <h4 className="text-sm font-semibold">Scheduled Tasks</h4>
              </div>
              {data && data.summary.scheduled_tasks.map((task, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <span className="text-sm">{task.name}</span>
                  <div className="flex items-center gap-2">
                    <code className="text-xs bg-muted px-2 py-0.5 rounded">{task.schedule}</code>
                    <Badge variant={task.active ? 'default' : 'secondary'} className="text-[10px]">
                      {task.active ? 'Active' : 'Paused'}
                    </Badge>
                  </div>
                </div>
              ))}
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                <h4 className="text-sm font-semibold">Auth & Portal</h4>
              </div>
              {data && (
                <>
                  <StatRow label="Staff users" value={data.summary.users.staff} />
                  <StatRow label="Portal users" value={data.summary.users.portal} />
                  <StatRow label="Partners pending approval" value={data.summary.users.pending_partners} />
                </>
              )}
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="database">
          <Card className="p-4">
            <h4 className="text-sm font-semibold mb-3">Table Row Counts ({data?.summary.database.total_tables} tables)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6">
              {data && Object.entries(data.summary.database.table_counts)
                .sort(([, a], [, b]) => b - a)
                .map(([table, count]) => (
                  <StatRow key={table} label={table.replace(/_/g, ' ')} value={count} />
                ))
              }
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
}
