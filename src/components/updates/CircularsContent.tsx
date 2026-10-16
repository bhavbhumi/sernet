import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  AlertCircle, Calendar, ExternalLink, Filter, Rss, Loader2, ArrowRight,
} from 'lucide-react';
import { useQueries, useQuery } from '@tanstack/react-query';
import { getSourceLogoUrl } from '@/lib/sourceLogos';
import { supabase } from '@/integrations/supabase/client';
import { format, isValid } from 'date-fns';
import { Link } from 'react-router-dom';

// ─── Types ───────────────────────────────────────────────────────────────────

interface DbCircularItem {
  id: string;
  title: string;
  source: string;
  category: string;
  link: string | null;
  summary: string | null;
  is_rss: boolean | null;
  rss_feed_url: string | null;
  published_at: string | null;
}

interface CircularCard {
  key: string;
  title: string;
  link: string | null;
  summary: string;
  date: string; // ISO or feed date string
  source: string;
  category: string;
  feedUrl: string | null;
  internalId: string | null; // set for standalone circulars → internal detail page
}

// ─── Source Logo ──────────────────────────────────────────────────────────────

function SourceLogo({ feedUrl, source }: { feedUrl: string | null; source: string }) {
  const [failed, setFailed] = useState(false);
  const logoUrl = getSourceLogoUrl(feedUrl);

  if (!logoUrl || failed) {
    return (
      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
        <Rss className="w-5 h-5 text-primary" />
      </div>
    );
  }

  return (
    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0 overflow-hidden border border-border/50">
      <img
        src={logoUrl}
        alt={source}
        className="w-6 h-6 object-contain"
        onError={() => setFailed(true)}
      />
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export const CircularsContent = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const { data: dbItems = [], isLoading } = useQuery({
    queryKey: ['circulars_public'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('feeds')
        .select('*')
        .eq('status', 'published')
        .eq('feed_type', 'circular')
        .order('published_at', { ascending: false });
      if (error) throw error;
      return data as DbCircularItem[];
    },
  });

  const rssFeeds = dbItems.filter((i) => i.is_rss && i.rss_feed_url);
  const standaloneItems = dbItems.filter((i) => !i.is_rss);

  const feedQueries = useQueries({
    queries: rssFeeds.map((feed) => ({
      queryKey: ['rss_feed_circular', feed.id],
      staleTime: 5 * 60 * 1000,
      retry: 1,
      queryFn: async (): Promise<CircularCard[]> => {
        const { data, error } = await supabase.functions.invoke('rss-fetch', {
          body: { feedUrl: feed.rss_feed_url, limit: 20 },
        });
        if (error) throw new Error(error.message);
        if (!data?.success) throw new Error(data?.error ?? 'Feed error');
        return (data.items as Array<{ title: string; link: string; summary: string; pubDate: string; guid: string }>).map(
          (item) => ({
            key: item.guid || item.link,
            title: item.title,
            link: item.link,
            summary: item.summary,
            date: item.pubDate,
            source: feed.source,
            category: feed.category,
            feedUrl: feed.rss_feed_url,
            internalId: null,
          }),
        );
      },
    })),
  });

  const feedsLoading = feedQueries.some((q) => q.isLoading);
  const failedFeeds = feedQueries
    .map((q, i) => ({ q, feed: rssFeeds[i] }))
    .filter(({ q }) => q.isError);

  // Merge RSS items + standalone circulars, sorted globally newest-first
  const allItems = useMemo(() => {
    const rssItems = feedQueries.flatMap((q) => q.data ?? []);
    const standalone: CircularCard[] = standaloneItems.map((i) => ({
      key: i.id,
      title: i.title,
      link: i.link,
      summary: i.summary ?? '',
      date: i.published_at ?? '',
      source: i.source,
      category: i.category,
      feedUrl: null,
      internalId: i.id,
    }));
    return [...rssItems, ...standalone].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feedQueries, standaloneItems.length]);

  const categories = useMemo(() => {
    const set = new Set(dbItems.map((i) => i.category));
    return ['All', ...Array.from(set)];
  }, [dbItems]);

  const filteredItems =
    activeCategory === 'All'
      ? allItems
      : allItems.filter((i) => i.category === activeCategory);

  return (
    <section className="section-padding">
      <div className="container-zerodha">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-semibold text-foreground">Regulatory Circulars</h2>
          </div>
          <p className="text-muted-foreground">SEBI circulars, exchange notices, and policy updates from regulatory bodies.</p>
        </motion.div>

        {/* Category filter */}
        {categories.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="flex items-center gap-2 mb-8 overflow-x-auto pb-2"
            style={{ scrollbarWidth: 'none' }}
          >
            <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 text-sm rounded-full whitespace-nowrap transition-colors ${
                  activeCategory === cat
                    ? 'bg-primary text-primary-foreground font-medium'
                    : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                {cat}
              </button>
            ))}
          </motion.div>
        )}

        {/* Loading */}
        {(isLoading || feedsLoading) && (
          <div className="flex items-center justify-center py-20 text-muted-foreground gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Loading circulars…</span>
          </div>
        )}

        {/* Feed errors */}
        {!feedsLoading &&
          failedFeeds.map(({ q, feed }) => (
            <div
              key={feed.id}
              className="flex gap-3 items-start py-4 px-5 bg-destructive/5 border border-destructive/20 rounded-lg text-sm mb-3"
            >
              <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-foreground">{feed.source} — Feed unavailable</p>
                <p className="text-muted-foreground mt-0.5">
                  {q.error instanceof Error ? q.error.message : 'Feed error'}
                </p>
              </div>
            </div>
          ))}

        {/* Empty state */}
        {!isLoading && !feedsLoading && allItems.length === 0 && failedFeeds.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            <AlertCircle className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No circulars available yet.</p>
            <p className="text-sm mt-1">Check back soon for the latest regulatory updates.</p>
          </div>
        )}

        {/* Items — globally sorted newest-first across all feeds */}
        {!feedsLoading && filteredItems.length > 0 && (
          <div className="space-y-3">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: Math.min(0.04 * index, 0.6) }}
                className="flex gap-4 p-5 bg-muted/30 rounded-lg border border-border/50 hover:shadow-md hover:border-primary/20 transition-all group"
              >
                {item.internalId ? (
                  <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  </div>
                ) : (
                  <SourceLogo feedUrl={item.feedUrl} source={item.source} />
                )}
                <div className="flex-1 min-w-0">
                  {item.internalId ? (
                    <Link
                      to={`/updates/circulars/${item.internalId}`}
                      className="text-base font-semibold text-foreground hover:text-primary transition-colors group-hover:text-primary"
                    >
                      {item.title}
                    </Link>
                  ) : (
                    <a
                      href={item.link ?? '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-base font-semibold text-foreground hover:text-primary transition-colors group-hover:text-primary"
                    >
                      {item.title}
                    </a>
                  )}
                  {item.summary && (
                    <p className="text-sm text-muted-foreground mb-2 mt-1 line-clamp-2">{item.summary}</p>
                  )}
                  <div className="flex items-center gap-3 flex-wrap mt-1">
                    <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-red-500/10 text-red-600">
                      {item.category}
                    </span>
                    {item.date && isValid(new Date(item.date)) && (
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(item.date), 'MMM d, yyyy')}
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground">via {item.source}</span>
                    {!item.internalId && (
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Rss className="h-3 w-3" /> RSS
                      </span>
                    )}
                  </div>
                </div>
                {item.internalId ? (
                  <Link
                    to={`/updates/circulars/${item.internalId}`}
                    className="self-center shrink-0 p-2 rounded-full hover:bg-muted transition-colors"
                    aria-label="Read more"
                  >
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  </Link>
                ) : (
                  <a
                    href={item.link ?? '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="self-center shrink-0 p-2 rounded-full hover:bg-muted transition-colors"
                    aria-label="Open circular"
                  >
                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                  </a>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* RSS Subscribe Banner */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="mt-10 p-6 rounded-xl bg-primary/5 border border-primary/20 flex flex-col md:flex-row items-center gap-4"
        >
          <Rss className="w-10 h-10 text-primary shrink-0" />
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-lg font-semibold text-foreground mb-1">Subscribe to Circular Alerts</h3>
            <p className="text-sm text-muted-foreground">Get real-time notifications for SEBI circulars, exchange notices, and policy updates.</p>
          </div>
          <button className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shrink-0">
            <Rss className="h-4 w-4" /> Subscribe
          </button>
        </motion.div>
      </div>
    </section>
  );
};
