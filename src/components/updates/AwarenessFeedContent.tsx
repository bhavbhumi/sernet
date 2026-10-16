import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  GraduationCap, Calendar, ExternalLink, Filter, Loader2, Rss, AlertCircle, Play,
} from 'lucide-react';
import { useQueries, useQuery } from '@tanstack/react-query';
import { getSourceLogoUrl } from '@/lib/sourceLogos';
import { supabase } from '@/integrations/supabase/client';
import { format, isValid } from 'date-fns';

// ─── Types ───────────────────────────────────────────────────────────────────

interface DbFeed {
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

interface AwarenessItem {
  title: string;
  link: string;
  summary: string;
  pubDate: string;
  guid: string;
  categories: string[];
  source: string;
  feedUrl: string | null;
  feedCategory: string;
}

// ─── Source Logo ─────────────────────────────────────────────────────────────

function SourceLogo({ feedUrl, source }: { feedUrl: string | null; source: string }) {
  const [failed, setFailed] = useState(false);
  const logoUrl = getSourceLogoUrl(feedUrl);

  if (!logoUrl || failed) {
    return (
      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
        <GraduationCap className="w-5 h-5 text-primary" />
      </div>
    );
  }

  return (
    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0 overflow-hidden border border-border/50">
      <img
        src={logoUrl}
        alt={source}
        className="w-8 h-8 object-contain"
        onError={() => setFailed(true)}
      />
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export const AwarenessFeedContent = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const { data: dbFeeds = [], isLoading } = useQuery({
    queryKey: ['awareness_feeds_public'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('feeds')
        .select('*')
        .eq('status', 'published')
        .eq('feed_type', 'awareness')
        .order('published_at', { ascending: false });
      if (error) throw error;
      return data as DbFeed[];
    },
  });

  const rssFeeds = dbFeeds.filter((f) => f.is_rss && f.rss_feed_url);

  const feedQueries = useQueries({
    queries: rssFeeds.map((feed) => ({
      queryKey: ['rss_feed', feed.id],
      staleTime: 5 * 60 * 1000,
      retry: 1,
      queryFn: async (): Promise<AwarenessItem[]> => {
        const { data, error } = await supabase.functions.invoke('rss-fetch', {
          body: { feedUrl: feed.rss_feed_url, limit: 30 },
        });
        if (error) throw new Error(error.message);
        if (!data?.success) throw new Error(data?.error ?? 'Feed error');
        return (data.items as Array<Omit<AwarenessItem, 'source' | 'feedUrl' | 'feedCategory'>>).map((item) => ({
          ...item,
          // Fall back to the feed's own category when items carry no tags (e.g. NCFE videos)
          categories:
            Array.isArray(item.categories) && item.categories.length > 0
              ? item.categories
              : feed.category
                ? [feed.category]
                : [],
          source: feed.source,
          feedUrl: feed.rss_feed_url,
          feedCategory: feed.category,
        }));
      },
    })),
  });

  const feedsLoading = feedQueries.some((q) => q.isLoading);
  const failedFeeds = feedQueries.filter((q) => q.isError);

  const allItems = useMemo(
    () =>
      feedQueries
        .flatMap((q) => q.data ?? [])
        .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()),
    [feedQueries],
  );

  // Category chips come from the feeds' own per-item categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    allItems.forEach((i) => i.categories.forEach((c) => set.add(c)));
    return ['All', ...Array.from(set).sort()];
  }, [allItems]);

  const filteredItems =
    activeCategory === 'All'
      ? allItems
      : allItems.filter((i) => i.categories.includes(activeCategory));

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
            <GraduationCap className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-semibold text-foreground">Financial Awareness</h2>
          </div>
          <p className="text-muted-foreground">
            Financial literacy articles and educational content from the National Centre for Financial Education (NCFE) and other sources.
          </p>
        </motion.div>

        {/* Category filter — derived from the feeds' own categories */}
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
            <span>Loading awareness content…</span>
          </div>
        )}

        {/* Feed errors */}
        {!feedsLoading &&
          failedFeeds.map((q, i) => (
            <div
              key={i}
              className="flex gap-3 items-start py-4 px-5 bg-destructive/5 border border-destructive/20 rounded-lg text-sm mb-3"
            >
              <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-foreground">{rssFeeds[i]?.source} — Feed unavailable</p>
                <p className="text-muted-foreground mt-0.5">
                  {q.error instanceof Error ? q.error.message : 'Feed error'}
                </p>
              </div>
            </div>
          ))}

        {/* Empty state */}
        {!isLoading && !feedsLoading && allItems.length === 0 && failedFeeds.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            <GraduationCap className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No awareness content available yet.</p>
            <p className="text-sm mt-1">Check back soon for financial literacy updates.</p>
          </div>
        )}

        {/* Items */}
        {!feedsLoading && filteredItems.length > 0 && (
          <div className="space-y-3">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.guid || item.link}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: Math.min(0.04 * index, 0.6) }}
                className="flex gap-4 p-5 bg-muted/30 rounded-lg border border-border/50 hover:shadow-md hover:border-primary/20 transition-all group"
              >
                <SourceLogo feedUrl={item.feedUrl} source={item.source} />
                <div className="flex-1 min-w-0">
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base font-semibold text-foreground hover:text-primary transition-colors group-hover:text-primary"
                  >
                    {item.title}
                  </a>
                  {item.summary && (
                    <p className="text-sm text-muted-foreground mb-2 mt-1 line-clamp-2">{item.summary}</p>
                  )}
                  <div className="flex items-center gap-3 flex-wrap mt-1">
                    {item.feedCategory === 'Videos' && (
                      <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-primary/10 text-primary flex items-center gap-1">
                        <Play className="h-3 w-3" /> Video
                      </span>
                    )}
                    {item.categories.map((cat) => (
                      <span
                        key={cat}
                        className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-emerald-500/10 text-emerald-600"
                      >
                        {cat}
                      </span>
                    ))}
                    {item.pubDate && isValid(new Date(item.pubDate)) && (
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(item.pubDate), 'MMM d, yyyy')}
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground">via {item.source}</span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Rss className="h-3 w-3" /> RSS
                    </span>
                  </div>
                </div>
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="self-center shrink-0 p-2 rounded-full hover:bg-muted transition-colors"
                  aria-label="Open article"
                >
                  <ExternalLink className="w-4 h-4 text-muted-foreground" />
                </a>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
