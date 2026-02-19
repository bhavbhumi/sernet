import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AlertCircle, Calendar, ExternalLink, Filter, Rss, Loader2, ArrowRight,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format, parseISO, isValid } from 'date-fns';
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

interface RssFeedItem {
  title: string;
  link: string;
  summary: string;
  pubDate: string;
  guid: string;
  source: string;
  category: string;
  dbId: string;
}

// ─── RSS feed block ───────────────────────────────────────────────────────────

function RssFeedBlock({ dbItem, index }: { dbItem: DbCircularItem; index: number }) {
  const { data: feedItems = [], isLoading, isError, error } = useQuery<RssFeedItem[], Error>({
    queryKey: ['rss_feed_circular', dbItem.id],
    enabled: !!dbItem.is_rss && !!dbItem.rss_feed_url,
    staleTime: 5 * 60 * 1000,
    retry: 1,
    queryFn: async (): Promise<RssFeedItem[]> => {
      const { data, error } = await supabase.functions.invoke('rss-fetch', {
        body: { feedUrl: dbItem.rss_feed_url, limit: 20 },
      });
      if (error) throw new Error(error.message);
      if (!data?.success) throw new Error(data?.error ?? 'Feed error');
      return (data.items as RssFeedItem[]).map((item) => ({
        ...item,
        source: dbItem.source,
        category: dbItem.category,
        dbId: dbItem.id,
      }));
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 py-4 px-5 text-muted-foreground text-sm">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading feed from {dbItem.source}…
      </div>
    );
  }

  if (isError || feedItems.length === 0) {
    const errorMsg = isError && error?.message ? error.message : `No items found in feed from ${dbItem.source}.`;
    return (
      <div className="flex gap-3 items-start py-4 px-5 bg-destructive/5 border border-destructive/20 rounded-lg text-sm">
        <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
        <div>
          <p className="font-medium text-foreground">{dbItem.source} — Feed unavailable</p>
          <p className="text-muted-foreground mt-0.5">{errorMsg}</p>
          {dbItem.rss_feed_url && (
            <p className="text-muted-foreground mt-1 text-xs break-all">URL: {dbItem.rss_feed_url}</p>
          )}
        </div>
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
          <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
            <Rss className="w-5 h-5 text-red-500" />
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
              <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-red-500/10 text-red-600">
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
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="self-center shrink-0 p-2 rounded-full hover:bg-muted transition-colors"
            aria-label="Open circular"
          >
            <ExternalLink className="w-4 h-4 text-muted-foreground" />
          </a>
        </motion.div>
      ))}
    </>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export const CircularsContent = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const { data: dbItems = [], isLoading } = useQuery({
    queryKey: ['circulars_public'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('circulars')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false });
      if (error) throw error;
      return data as DbCircularItem[];
    },
  });

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
        {isLoading && (
          <div className="flex items-center justify-center py-20 text-muted-foreground gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Loading circulars…</span>
          </div>
        )}

        {/* Empty */}
        {!isLoading && filteredDbItems.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            <AlertCircle className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No circulars available yet.</p>
            <p className="text-sm mt-1">Check back soon for the latest regulatory updates.</p>
          </div>
        )}

        {/* Items */}
        {!isLoading && filteredDbItems.length > 0 && (
          <div className="space-y-3">
            {filteredDbItems.map((item, index) =>
              item.is_rss ? (
                /* RSS → expand individual feed items */
                <RssFeedBlock key={item.id} dbItem={item} index={index} />
              ) : (
                /* Standalone → internal detail page */
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.05 * index }}
                  className="flex gap-4 p-5 bg-muted/30 rounded-lg border border-border/50 hover:shadow-md hover:border-primary/20 transition-all group"
                >
                  <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/updates/circulars/${item.id}`}
                      className="text-base font-semibold text-foreground hover:text-primary transition-colors group-hover:text-primary"
                    >
                      {item.title}
                    </Link>
                    {item.summary && (
                      <p className="text-sm text-muted-foreground mb-2 mt-1 line-clamp-2">{item.summary}</p>
                    )}
                    <div className="flex items-center gap-3 flex-wrap mt-1">
                      <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-red-500/10 text-red-600">
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
                    to={`/updates/circulars/${item.id}`}
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
