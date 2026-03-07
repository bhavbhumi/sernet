import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, Calendar, BarChart3, FileText, Newspaper, Lightbulb } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';

interface InsightCard {
  id: string;
  type: 'article' | 'analysis' | 'report' | 'awareness';
  category: string;
  title: string;
  excerpt: string | null;
  date: string | null;
  readTime?: string | null;
  url?: string | null;
  imageUrl?: string | null;
}

const TYPE_BADGE: Record<string, { label: string; route: (id: string) => string }> = {
  article: { label: 'Article', route: (id) => `/insights/articles/${id}` },
  analysis: { label: 'Analysis', route: (id) => `/insights/analysis/${id}` },
  report: { label: 'Report', route: (id) => `/insights?tab=Reports` },
  awareness: { label: 'Awareness', route: (id) => `/insights/articles/${id}` },
};

function useLatestInsights() {
  return useQuery({
    queryKey: ['home-insights'],
    queryFn: async (): Promise<InsightCard[]> => {
      const awarenessCategories = ['Financial Literacy', 'Investor Protection', 'Scam Alerts', 'Market Basics', 'Personal Finance'];

      const [articlesRes, analysisRes, reportsRes, awarenessRes] = await Promise.all([
        supabase
          .from('articles')
          .select('id, category, title, excerpt, item_date, published_at, read_time, thumbnail_url, media_url')
          .eq('status', 'published')
          .not('category', 'in', `(${awarenessCategories.join(',')})`)
          .order('item_date', { ascending: false, nullsFirst: false })
          .limit(1),
        supabase
          .from('articles')
          .select('id, category, title, excerpt, item_date, published_at, read_time, thumbnail_url, media_url')
          .eq('status', 'published')
          .eq('content_type', 'analysis')
          .order('item_date', { ascending: false, nullsFirst: false })
          .limit(1),
        supabase
          .from('articles')
          .select('id, category, title, excerpt, item_date, published_at, read_time, thumbnail_url, media_url, file_url')
          .eq('status', 'published')
          .eq('content_type', 'report')
          .order('published_at', { ascending: false, nullsFirst: false })
          .limit(1),
        supabase
          .from('articles')
          .select('id, category, title, excerpt, item_date, published_at, read_time, thumbnail_url, media_url')
          .eq('status', 'published')
          .in('category', awarenessCategories)
          .order('item_date', { ascending: false, nullsFirst: false })
          .limit(1),
      ]);

      const cards: InsightCard[] = [];

      if (articlesRes.data?.[0]) {
        const a = articlesRes.data[0];
        cards.push({ id: a.id, type: 'article', category: a.category, title: a.title, excerpt: a.excerpt, date: a.item_date || a.published_at, readTime: a.read_time, imageUrl: a.thumbnail_url || a.media_url });
      }
      if (analysisRes.data?.[0]) {
        const a = analysisRes.data[0];
        cards.push({ id: a.id, type: 'analysis', category: a.category, title: a.title, excerpt: a.excerpt, date: a.item_date || a.published_at, readTime: a.read_time, imageUrl: a.thumbnail_url || a.media_url });
      }
      if (reportsRes.data?.[0]) {
        const r = reportsRes.data[0];
        cards.push({ id: r.id, type: 'report', category: r.category, title: r.title, excerpt: r.excerpt, date: r.published_at, imageUrl: r.thumbnail_url || r.media_url });
      }
      if (awarenessRes.data?.[0]) {
        const a = awarenessRes.data[0];
        cards.push({ id: a.id, type: 'awareness', category: a.category, title: a.title, excerpt: a.excerpt, date: a.item_date || a.published_at, readTime: a.read_time, imageUrl: a.thumbnail_url || a.media_url });
      }

      return cards;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export const InsightsSection = () => {
  const { t } = useTranslation();
  const { data: cards = [], isLoading } = useLatestInsights();

  return (
    <section className="section-padding bg-muted/30">
      <div className="container-sernet">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-end justify-between mb-8"
        >
          <div>
            <h2 className="heading-lg text-foreground">{t('insights.heading')}</h2>
          </div>
          <Link
            to="/insights"
            className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            {t('insights.viewAll')} <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-background rounded-2xl overflow-hidden border border-border/50 p-5 space-y-3">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))
          ) : (
            cards.map((card, index) => {
              const meta = TYPE_BADGE[card.type];
              const TypeIcon = card.type === 'awareness' ? Lightbulb : card.type === 'analysis' ? BarChart3 : card.type === 'report' ? FileText : Newspaper;
              return (
                <motion.article
                  key={card.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group bg-background rounded-2xl overflow-hidden border border-border/50 hover:border-primary/20 hover:shadow-lg transition-all duration-300"
                >
                  {card.imageUrl && (
                    <Link to={meta.route(card.id)}>
                      <div className="aspect-[16/9] overflow-hidden">
                        <img
                          src={card.imageUrl}
                          alt={card.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      </div>
                    </Link>
                  )}
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <TypeIcon className="w-4 h-4 text-primary" />
                      <span className="text-xs font-semibold text-primary uppercase tracking-wider">{meta.label}</span>
                      <span className="text-xs text-muted-foreground">·</span>
                      <span className="text-xs text-muted-foreground">{card.category}</span>
                    </div>
                    <Link to={meta.route(card.id)}>
                      <h3 className="text-base font-semibold text-foreground leading-snug mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {card.title}
                      </h3>
                    </Link>
                    {card.excerpt && (
                      <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">
                        {card.excerpt}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        {card.date && (
                          <span className="inline-flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" /> {format(new Date(card.date), 'MMM d, yyyy')}
                          </span>
                        )}
                        {card.readTime && (
                          <span className="inline-flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" /> {card.readTime}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.article>
              );
            })
          )}
        </div>

        <div className="sm:hidden mt-8 text-center">
          <Link
            to="/insights"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            {t('insights.viewAll')} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
};

