import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Newspaper, Calendar, ExternalLink, Filter, Loader2, Rss, ArrowRight, AlertCircle,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format, parseISO, isValid } from 'date-fns';
import { Link } from 'react-router-dom';

// ─── Types ───────────────────────────────────────────────────────────────────

interface DbNewsItem {
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

interface RssFeedItem {
  title: string;
  link: string;
  summary: string;
  pubDate: string;
  guid: string;
  // injected from parent DB record
  source: string;
  category: string;
  dbId: string;
}

// ─── Single RSS feed loader ───────────────────────────────────────────────────

function useRssFeedItems(dbItem: DbNewsItem) {
  return useQuery({
    queryKey: ['rss_feed', dbItem.id],
    enabled: !!dbItem.is_rss && !!dbItem.rss_feed_url,
    staleTime: 5 * 60 * 1000, // cache 5 min
    queryFn: async (): Promise<RssFeedItem[]> => {
      const { data, error } = await supabase.functions.invoke('rss-fetch', {
        body: { feedUrl: dbItem.rss_feed_url, limit: 20 },
      });
      if (error) throw error;
      if (!data?.success) throw new Error(data?.error ?? 'Feed error');
      return (data.items as RssFeedItem[]).map((item) => ({
        ...item,
        source: dbItem.source,
        category: dbItem.category,
        dbId: dbItem.id,
      }));
    },
  });
}

// ─── RSS feed expander ────────────────────────────────────────────────────────

function RssFeedBlock({ dbItem, index }: { dbItem: DbNewsItem; index: number }) {
  const { data: feedItems = [], isLoading, isError } = useRssFeedItems(dbItem);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 py-4 px-5 text-muted-foreground text-sm">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading feed from {dbItem.source}…
      </div>
    );
  }

  if (isError || feedItems.length === 0) {
    return (
      <div className="flex items-center gap-2 py-4 px-5 text-muted-foreground text-sm">
        <AlertCircle className="h-4 w-4 opacity-50" />
        Could not load feed from {dbItem.source}.
      </div>
    );
  }

  return (
    <>
      {feedItems.map((item, i) => (
        <motion.div
          key={item.guid || item.link}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.04 * (index + i) }}
          className="flex gap-4 p-5 bg-muted/30 rounded-lg border border-border/50 hover:shadow-md hover:border-primary/20 transition-all group"
        >
          <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
            <Rss className="w-5 h-5 text-blue-500" />
          </div>
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
              <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-blue-500/10 text-blue-600">
                {item.category}
              </span>
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
          {/* External link → source article */}
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
    </>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export const NewsContent = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const { data: dbItems = [], isLoading } = useQuery({
    queryKey: ['news_items_public'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('news_items')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false });
      if (error) throw error;
      return data as DbNewsItem[];
    },
  });

  // Collect unique categories from DB records (used for filter)
  const categorySet = new Set(dbItems.map((i) => i.category));
  const categories = ['All', ...Array.from(categorySet)];

  const filteredDbItems = activeCategory === 'All'
    ? dbItems
    : dbItems.filter((i) => i.category === activeCategory);

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
            <Newspaper className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-semibold text-foreground">Market News</h2>
          </div>
          <p className="text-muted-foreground">Latest market news, corporate actions, and economic developments.</p>
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

        {/* Loading DB records */}
        {isLoading && (
          <div className="flex items-center justify-center py-20 text-muted-foreground gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Loading news…</span>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && filteredDbItems.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            <Newspaper className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No news items available yet.</p>
            <p className="text-sm mt-1">Check back soon for the latest updates.</p>
          </div>
        )}

        {/* Items */}
        {!isLoading && filteredDbItems.length > 0 && (
          <div className="space-y-3">
            {filteredDbItems.map((item, index) =>
              item.is_rss ? (
                /* RSS feed → expand into individual feed articles */
                <RssFeedBlock key={item.id} dbItem={item} index={index} />
              ) : (
                /* Standalone article → internal detail page */
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.05 * index }}
                  className="flex gap-4 p-5 bg-muted/30 rounded-lg border border-border/50 hover:shadow-md hover:border-primary/20 transition-all group"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                    <Newspaper className="w-5 h-5 text-blue-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/updates/news/${item.id}`}
                      className="text-base font-semibold text-foreground hover:text-primary transition-colors group-hover:text-primary"
                    >
                      {item.title}
                    </Link>
                    {item.summary && (
                      <p className="text-sm text-muted-foreground mb-2 mt-1 line-clamp-2">{item.summary}</p>
                    )}
                    <div className="flex items-center gap-3 flex-wrap mt-1">
                      <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-blue-500/10 text-blue-600">
                        {item.category}
                      </span>
                      {item.published_at && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {format(parseISO(item.published_at), 'MMM d, yyyy')}
                        </span>
                      )}
                      <span className="text-xs text-muted-foreground">via {item.source}</span>
                    </div>
                  </div>
                  <Link
                    to={`/updates/news/${item.id}`}
                    className="self-center shrink-0 p-2 rounded-full hover:bg-muted transition-colors"
                    aria-label="Read more"
                  >
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  </Link>
                </motion.div>
              )
            )}
          </div>
        )}
      </div>
    </section>
  );
};
