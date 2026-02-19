import { useState } from 'react';
import { motion } from 'framer-motion';
import { Newspaper, Calendar, ExternalLink, Filter, Loader2, Rss, ArrowRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';

interface NewsItem {
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

export const NewsContent = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['news_items_public'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('news_items')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false });
      if (error) throw error;
      return data as NewsItem[];
    },
  });

  // Build dynamic category list from actual data
  const categorySet = new Set(items.map(i => i.category));
  const categories = ['All', ...Array.from(categorySet)];

  const filteredItems = activeCategory === 'All'
    ? items
    : items.filter(item => item.category === activeCategory);

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

        {/* Category Filter */}
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
            <span>Loading news...</span>
          </div>
        )}

        {/* Empty */}
        {!isLoading && filteredItems.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            <Newspaper className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No news items available yet.</p>
            <p className="text-sm mt-1">Check back soon for the latest updates.</p>
          </div>
        )}

        {/* News Items */}
        {!isLoading && filteredItems.length > 0 && (
          <div className="space-y-3">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.05 * index }}
                className="flex gap-4 p-5 bg-muted/30 rounded-lg border border-border/50 hover:shadow-md hover:border-primary/20 transition-all group"
              >
                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                  {item.is_rss
                    ? <Rss className="w-5 h-5 text-blue-500" />
                    : <Newspaper className="w-5 h-5 text-blue-500" />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  {/* Title always routes to internal detail page */}
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
                        {format(new Date(item.published_at), 'MMM d, yyyy')}
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground">via {item.source}</span>
                    {item.is_rss && (
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Rss className="h-3 w-3" /> RSS
                      </span>
                    )}
                  </div>
                </div>
                {/* Arrow → detail page */}
                <Link
                  to={`/updates/news/${item.id}`}
                  className="self-center shrink-0 p-2 rounded-full hover:bg-muted transition-colors"
                  aria-label="Read more"
                >
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
