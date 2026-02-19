
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { FileText, Newspaper, AlertCircle, Vote, Star, Briefcase, BarChart3, BookOpen, Bell, Users, ClipboardList } from 'lucide-react';

interface StatCard {
  label: string;
  count: number | null;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  subtitle?: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const [
        articles, analyses, reports, bulletins, news, circulars,
        polls, surveys, reviews, jobs, applications, press
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
      });
      setLoading(false);
    };

    fetchStats();
  }, []);

  const cards: StatCard[] = [
    { label: 'Articles', count: stats.articles, href: '/admin/content/articles', icon: FileText, color: 'text-blue-600 bg-blue-500/10' },
    { label: 'Analysis', count: stats.analyses, href: '/admin/content/analysis', icon: BarChart3, color: 'text-indigo-600 bg-indigo-500/10' },
    { label: 'Reports', count: stats.reports, href: '/admin/content/reports', icon: BookOpen, color: 'text-emerald-600 bg-emerald-500/10' },
    { label: 'Bulletin', count: stats.bulletins, href: '/admin/content/bulletin', icon: Bell, color: 'text-amber-600 bg-amber-500/10' },
    { label: 'News Items', count: stats.news, href: '/admin/updates/news', icon: Newspaper, color: 'text-cyan-600 bg-cyan-500/10' },
    { label: 'Circulars', count: stats.circulars, href: '/admin/updates/circulars', icon: AlertCircle, color: 'text-red-600 bg-red-500/10' },
    { label: 'Polls', count: stats.polls, href: '/admin/engagement/polls', icon: Vote, color: 'text-violet-600 bg-violet-500/10' },
    { label: 'Surveys', count: stats.surveys, href: '/admin/engagement/surveys', icon: ClipboardList, color: 'text-pink-600 bg-pink-500/10' },
    { label: 'Pending Reviews', count: stats.pendingReviews, href: '/admin/engagement/reviews', icon: Star, color: 'text-yellow-600 bg-yellow-500/10', subtitle: 'Awaiting approval' },
    { label: 'Job Openings', count: stats.jobs, href: '/admin/careers/openings', icon: Briefcase, color: 'text-teal-600 bg-teal-500/10' },
    { label: 'New Applications', count: stats.newApplications, href: '/admin/careers/applications', icon: Users, color: 'text-orange-600 bg-orange-500/10', subtitle: 'Unreviewed' },
    { label: 'Press Items', count: stats.press, href: '/admin/press', icon: FileText, color: 'text-slate-600 bg-slate-500/10' },
  ];

  return (
    <AdminLayout
      title="Dashboard"
      subtitle="Welcome to the SERNET CMS — manage all your content from here"
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card) => (
          <Link
            key={card.label}
            to={card.href}
            className="bg-card border border-border rounded-xl p-4 hover:border-primary/30 hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${card.color}`}>
                <card.icon className="h-4.5 w-4.5" />
              </div>
              <span className="text-xs text-muted-foreground">{card.label}</span>
            </div>
            <div className="text-2xl font-bold text-foreground">
              {loading ? <div className="h-7 w-12 bg-muted animate-pulse rounded" /> : card.count}
            </div>
            {card.subtitle && <p className="text-xs text-muted-foreground mt-0.5">{card.subtitle}</p>}
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-sm font-semibold text-foreground mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'New Article', href: '/admin/content/articles?action=new', icon: FileText },
            { label: 'Add News', href: '/admin/updates/news?action=new', icon: Newspaper },
            { label: 'Create Poll', href: '/admin/engagement/polls?action=new', icon: Vote },
            { label: 'Post Job', href: '/admin/careers/openings?action=new', icon: Briefcase },
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
