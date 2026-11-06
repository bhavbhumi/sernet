import { Link } from '@/lib/router-compat';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, Calendar, BookOpen, PlayCircle, Headphones } from 'lucide-react';
import { postPath, mediaGroupOf, type MediaGroup } from '@/lib/insightsTaxonomy';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';

interface InsightCard {
  id: string; content_type: string; post_type: string | null; category: string; sub_category: string | null;
  title: string; excerpt: string | null; date: string | null; readTime?: string | null; imageUrl?: string | null; media_kind: string | null;
}

const FORMAT_ICON: Record<MediaGroup, typeof BookOpen> = { Read: BookOpen, Watch: PlayCircle, Listen: Headphones };

// Latest posts using the current posting structure: one per Type (newest first), Editor's Picks preferred.
function useLatestInsights() {
  return useQuery({
    queryKey: ['home-insights-v2'],
    queryFn: async (): Promise<InsightCard[]> => {
      const { data, error } = await supabase
        .from('articles')
        .select('id, content_type, post_type, category, sub_category, title, excerpt, item_date, published_at, read_time, thumbnail_url, media_url, media_kind, is_featured')
        .eq('status', 'published')
        .not('post_type', 'is', null)
        .order('published_at', { ascending: false, nullsFirst: false })
        .limit(60);
      if (error) throw error;
      const rows = [...(data ?? [])].sort((x, y) => Number(!!y.is_featured) - Number(!!x.is_featured));
      const seen = new Set<string>();
      const cards: InsightCard[] = [];
      for (const a of rows) {
        if (cards.length === 3) break;
        if (seen.has(a.post_type!)) continue;
        seen.add(a.post_type!);
        cards.push({ id: a.id, content_type: a.content_type, post_type: a.post_type, category: a.category, sub_category: a.sub_category,
          title: a.title, excerpt: a.excerpt, date: a.item_date || a.published_at, readTime: a.read_time,
          imageUrl: a.thumbnail_url || (a.media_url && /\.(jpe?g|png|gif|webp)(\?|$)/i.test(a.media_url) ? a.media_url : null), media_kind: a.media_kind });
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
              <div key={i} className="surface-elevated bg-background rounded-md overflow-hidden border border-border/50 p-5 space-y-3">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))
          ) : (
            cards.map((card, index) => {
              const href = postPath(card);
              const grp = mediaGroupOf(card.media_kind);
              const TypeIcon = FORMAT_ICON[grp];
              return (
                <motion.article
                  key={card.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="interaction-card group bg-background rounded-md overflow-hidden border border-border/50 hover:border-primary/20 transition-all duration-300"
                >
                  {card.imageUrl && (
                    <Link to={href}>
                      <div className="aspect-[16/9] overflow-hidden">
                        <img
                          src={card.imageUrl}
                          alt={card.title}
                          className="w-full h-full object-contain bg-muted/30 group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      </div>
                    </Link>
                  )}
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <TypeIcon className="w-4 h-4 text-primary" />
                      <span className="text-xs font-semibold text-primary uppercase tracking-wider">{card.post_type}</span>
                      <span className="text-xs text-muted-foreground">·</span>
                      <span className="text-xs text-muted-foreground truncate">{card.sub_category || card.category}</span>
                    </div>
                    <Link to={href}>
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

