
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { ADMIN_ROUTES } from '@/lib/adminRoutes';
import {
  FileText, Newspaper, AlertCircle, Vote, Star, Briefcase, BarChart3,
  BookOpen, Bell, Users, ClipboardList, UserCheck, Megaphone, TrendingUp,
  Building2, Gavel, Calculator, Ticket, Headphones, AlertTriangle,
  Activity, CheckCircle2, RefreshCw
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useHealthCheck } from '@/hooks/useHealthCheck';

const R = ADMIN_ROUTES;

interface StatCard {
  label: string;
  count: number | null;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  subtitle?: string;
}

interface DepartmentKPIs {
  department: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  cards: StatCard[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const { data: healthData } = useHealthCheck();

  useEffect(() => {
    const fetchStats = async () => {
      const db = (t: string) => supabase.from(t as any) as any;
      const [
        articles, analyses, reports, bulletins, news, circulars,
        polls, surveys, reviews, jobs, applications, press,
        leads, calcLeads, tickets, openTickets, breachedTickets
      ] = await Promise.all([
        supabase.from('articles').select('id', { count: 'exact', head: true }),
        supabase.from('analyses').select('id', { count: 'exact', head: true }),
        supabase.from('reports').select('id', { count: 'exact', head: true }),
        supabase.from('bulletins').select('id', { count: 'exact', head: true }),
        supabase.from('news_items').select('id', { count: 'exact', head: true }),
        supabase.from('circulars').select('id', { count: 'exact', head: true }),
        supabase.from('polls').select('id', { count: 'exact', head: true }),
        supabase.from('surveys').select('id', { count: 'exact', head: true }),
        supabase.from('reviews').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('job_openings').select('id', { count: 'exact', head: true }),
        supabase.from('job_applications').select('id', { count: 'exact', head: true }).eq('status', 'new'),
        supabase.from('press_items').select('id', { count: 'exact', head: true }),
        supabase.from('leads').select('id', { count: 'exact', head: true }),
        supabase.from('calculator_leads').select('id', { count: 'exact', head: true }),
        db('support_tickets').select('id', { count: 'exact', head: true }),
        db('support_tickets').select('id', { count: 'exact', head: true }).eq('status', 'open'),
        db('support_tickets').select('id', { count: 'exact', head: true }).in('status', ['open', 'in_progress']).lt('tat_deadline', new Date().toISOString()),
      ]);

      setStats({
        articles: articles.count ?? 0,
        analyses: analyses.count ?? 0,
        reports: reports.count ?? 0,
        bulletins: bulletins.count ?? 0,
        news: news.count ?? 0,
        circulars: circulars.count ?? 0,
        polls: polls.count ?? 0,
        surveys: surveys.count ?? 0,
        pendingReviews: reviews.count ?? 0,
        jobs: jobs.count ?? 0,
        newApplications: applications.count ?? 0,
        press: press.count ?? 0,
        leads: leads.count ?? 0,
        calcLeads: calcLeads.count ?? 0,
        tickets: tickets.count ?? 0,
        openTickets: openTickets.count ?? 0,
        breachedTickets: breachedTickets.count ?? 0,
      });
      setLoading(false);
    };

    fetchStats();
  }, []);

  const departments: DepartmentKPIs[] = [
    {
      department: 'Marketing',
      icon: Megaphone,
      color: 'text-blue-600',
      bgColor: 'bg-blue-500/10',
      cards: [
        { label: 'Articles', count: stats.articles, href: R.marketing.content.articles, icon: FileText, color: 'text-blue-600 bg-blue-500/10' },
        { label: 'Analysis', count: stats.analyses, href: R.marketing.content.analysis, icon: BarChart3, color: 'text-indigo-600 bg-indigo-500/10' },
        { label: 'Reports', count: stats.reports, href: R.marketing.content.reports, icon: BookOpen, color: 'text-emerald-600 bg-emerald-500/10' },
        { label: 'Bulletin', count: stats.bulletins, href: R.marketing.content.bulletin, icon: Bell, color: 'text-amber-600 bg-amber-500/10' },
        { label: 'News', count: stats.news, href: R.marketing.updates.news, icon: Newspaper, color: 'text-cyan-600 bg-cyan-500/10' },
        { label: 'Circulars', count: stats.circulars, href: R.marketing.updates.circulars, icon: AlertCircle, color: 'text-red-600 bg-red-500/10' },
        { label: 'Polls', count: stats.polls, href: R.marketing.engagement.polls, icon: Vote, color: 'text-violet-600 bg-violet-500/10' },
        { label: 'Reviews', count: stats.pendingReviews, href: R.marketing.engagement.reviews, icon: Star, color: 'text-yellow-600 bg-yellow-500/10', subtitle: 'Pending' },
        { label: 'Press', count: stats.press, href: R.marketing.press, icon: FileText, color: 'text-slate-600 bg-slate-500/10' },
      ],
    },
    {
      department: 'Sales',
      icon: TrendingUp,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-500/10',
      cards: [
        { label: 'Leads', count: stats.leads, href: R.sales.leads, icon: UserCheck, color: 'text-emerald-600 bg-emerald-500/10' },
        { label: 'Calculator Leads', count: stats.calcLeads, href: R.sales.calculatorLeads, icon: Calculator, color: 'text-teal-600 bg-teal-500/10' },
      ],
    },
    {
      department: 'Support',
      icon: Headphones,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-500/10',
      cards: [
        { label: 'Total Tickets', count: stats.tickets, href: R.support.tickets, icon: Ticket, color: 'text-cyan-600 bg-cyan-500/10' },
        { label: 'Open', count: stats.openTickets, href: R.support.tickets, icon: Ticket, color: 'text-green-600 bg-green-500/10' },
        { label: 'TAT Breached', count: stats.breachedTickets, href: R.support.tickets, icon: AlertTriangle, color: 'text-red-600 bg-red-500/10', subtitle: 'Needs attention' },
      ],
    },
    {
      department: 'HR',
      icon: Building2,
      color: 'text-orange-600',
      bgColor: 'bg-orange-500/10',
      cards: [
        { label: 'Job Openings', count: stats.jobs, href: R.hr.careers.openings, icon: Briefcase, color: 'text-teal-600 bg-teal-500/10' },
        { label: 'New Applications', count: stats.newApplications, href: R.hr.careers.applications, icon: Users, color: 'text-orange-600 bg-orange-500/10', subtitle: 'Unreviewed' },
      ],
    },
  ];

  return (
    <AdminLayout
      title="Master Dashboard"
      subtitle="Cross-department KPIs — SERNET Operations Hub"
    >
      {/* System Health Summary */}
      {healthData && (
        <Link
          to="/admin/settings/health"
          className="mb-6 flex items-center gap-4 bg-card border border-border rounded-xl p-4 hover:border-primary/30 hover:shadow-md transition-all"
        >
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
            healthData.status === 'healthy' ? 'bg-emerald-500/10' :
            healthData.status === 'warning' ? 'bg-yellow-500/10' : 'bg-destructive/10'
          }`}>
            {healthData.status === 'healthy'
              ? <CheckCircle2 className="h-6 w-6 text-emerald-500" />
              : healthData.status === 'warning'
              ? <AlertTriangle className="h-6 w-6 text-yellow-500" />
              : <AlertCircle className="h-6 w-6 text-destructive" />
            }
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold">System Health</span>
              <Badge variant={healthData.status === 'healthy' ? 'default' : healthData.status === 'warning' ? 'outline' : 'destructive'} className="text-[10px]">
                {healthData.health_score}/100
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {healthData.issues.length === 0
                ? 'All systems operational'
                : `${healthData.issues.filter(i => i.severity === 'critical').length} critical · ${healthData.issues.filter(i => i.severity === 'warning').length} warnings · ${healthData.issues.filter(i => i.severity === 'info').length} info`
              }
            </p>
          </div>
          <Activity className="h-5 w-5 text-muted-foreground" />
        </Link>
      )}
      {/* Department KPI Sections */}
      <div className="space-y-6 mb-8">
        {departments.map((dept) => (
          <div key={dept.department}>
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${dept.bgColor}`}>
                <dept.icon className={`h-4 w-4 ${dept.color}`} />
              </div>
              <h2 className="text-sm font-semibold text-foreground">{dept.department}</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {dept.cards.map((card) => (
                <Link
                  key={card.label}
                  to={card.href}
                  className="bg-card border border-border rounded-xl p-3.5 hover:border-primary/30 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${card.color}`}>
                      <card.icon className="h-4 w-4" />
                    </div>
                    <span className="text-xs text-muted-foreground">{card.label}</span>
                  </div>
                  <div className="text-xl font-bold text-foreground">
                    {loading ? <div className="h-6 w-10 bg-muted animate-pulse rounded" /> : card.count}
                  </div>
                  {card.subtitle && <p className="text-[11px] text-muted-foreground mt-0.5">{card.subtitle}</p>}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-sm font-semibold text-foreground mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'New Article', href: `${R.marketing.content.articles}?action=new`, icon: FileText },
            { label: 'Add News', href: `${R.marketing.updates.news}?action=new`, icon: Newspaper },
            { label: 'Create Poll', href: `${R.marketing.engagement.polls}?action=new`, icon: Vote },
            { label: 'Post Job', href: `${R.hr.careers.openings}?action=new`, icon: Briefcase },
          ].map((action) => (
            <Link
              key={action.label}
              to={action.href}
              className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              <action.icon className="h-4 w-4" />
              {action.label}
            </Link>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
