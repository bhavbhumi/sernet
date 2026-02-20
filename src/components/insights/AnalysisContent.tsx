import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, BarChart3, PieChart, ArrowRight, Calendar, User, Filter, Loader2, Heart, Share2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useArticleEngagement } from '@/hooks/useArticleEngagement';
import { useToast } from '@/hooks/use-toast';

const iconMap: Record<string, React.ElementType> = {
  TrendingUp,
  BarChart3,
  PieChart,
};

const categories = ['All', 'Market Wrap', 'Market Outlook', 'Macro'];

const PAGE_SIZE = 12;

function AnalysisCard({ item, index }: { item: any; index: number }) {
  const { toast } = useToast();
  const { likeCount, liked, shareCount, toggleLike, recordShare } = useArticleEngagement(item.id);
  const Icon = iconMap[item.icon_name ?? 'TrendingUp'] ?? TrendingUp;

  const dateStr = item.item_date
    ? new Date(item.item_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : item.published_at
    ? new Date(item.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : '';

  const handleShare = async () => {
    const url = `${window.location.origin}/insights/analysis/${item.id}`;
    const isNew = await recordShare();
    navigator.clipboard.writeText(url);
    toast({
      title: '🔗 Link copied!',
      description: isNew ? 'Share count recorded. Paste it anywhere!' : 'Link copied to clipboard.',
    });
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(0.06 * index, 0.4) }}
      className="bg-muted/30 rounded-lg p-6 hover:shadow-lg transition-shadow border border-border/50 flex flex-col"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <span className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
          {item.category}
        </span>
      </div>

      <Link to={`/insights/analysis/${item.id}`}>
        <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2 hover:text-primary transition-colors">
          {item.title}
        </h3>
      </Link>
      {item.excerpt && (
        <p className="text-sm text-muted-foreground mb-4 line-clamp-3 flex-1">{item.excerpt}</p>
      )}

      <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
        <div className="flex items-center gap-1">
          <User className="h-3 w-3" />
          <span>{item.author}</span>
        </div>
        {dateStr && (
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {dateStr}
          </span>
        )}
      </div>

      {/* Footer: Read more + engagement */}
      <div className="flex items-center justify-between pt-3 border-t border-border/40">
        <Link
          to={`/insights/analysis/${item.id}`}
          className="flex items-center gap-1 text-primary text-sm font-medium hover:underline"
        >
          Read more <ArrowRight className="h-4 w-4" />
        </Link>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleLike}
            className={`flex items-center gap-1 text-xs transition-colors ${liked ? 'text-red-500' : 'text-muted-foreground hover:text-red-500'}`}
            aria-label="Like"
          >
            <Heart className={`h-4 w-4 ${liked ? 'fill-red-500' : ''}`} />
            {likeCount > 0 && <span>{likeCount}</span>}
          </button>
          <button
            onClick={handleShare}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
            aria-label="Share"
          >
            <Share2 className="h-4 w-4" />
            {shareCount > 0 && <span>{shareCount}</span>}
          </button>
        </div>
      </div>
    </motion.article>
  );
}

function Pagination({
  page,
  totalPages,
  onPage,
}: {
  page: number;
  totalPages: number;
  onPage: (p: number) => void;
}) {
  if (totalPages <= 1) return null;

  const pages: (number | '…')[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || Math.abs(i - page) <= 1) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== '…') {
      pages.push('…');
    }
  }

  return (
    <div className="flex items-center justify-center gap-1.5 mt-12 flex-wrap">
      <button
        onClick={() => onPage(page - 1)}
        disabled={page === 1}
        className="flex items-center gap-1 px-3 py-2 text-sm rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-primary/50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft className="h-4 w-4" /> Prev
      </button>

      {pages.map((p, i) =>
        p === '…' ? (
          <span key={`ellipsis-${i}`} className="px-2 py-2 text-sm text-muted-foreground">…</span>
        ) : (
          <button
            key={p}
            onClick={() => onPage(p as number)}
            className={`min-w-[36px] h-9 px-2 text-sm rounded-lg border transition-colors font-medium ${
              page === p
                ? 'bg-primary text-primary-foreground border-primary'
                : 'border-border text-muted-foreground hover:text-foreground hover:border-primary/50'
            }`}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => onPage(page + 1)}
        disabled={page === totalPages}
        className="flex items-center gap-1 px-3 py-2 text-sm rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-primary/50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        Next <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}

export const AnalysisContent = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [page, setPage] = useState(1);

  const { data: analyses = [], isLoading } = useQuery({
    queryKey: ['analyses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('analyses')
        .select('*')
        .eq('status', 'published')
        .order('item_date', { ascending: false, nullsFirst: false });
      if (error) throw error;
      return data;
    },
  });

  const filtered = activeCategory === 'All'
    ? analyses
    : analyses.filter((a) => a.category === activeCategory);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleCategory = (cat: string) => {
    setActiveCategory(cat);
    setPage(1);
  };

  const handlePage = (p: number) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
            <BarChart3 className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-semibold text-foreground">Market Analysis</h2>
          </div>
          <p className="text-muted-foreground">
            In-depth technical, fundamental, and macro analysis from our research team.
          </p>
        </motion.div>

        {/* Category Filter */}
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
              onClick={() => handleCategory(cat)}
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

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        )}

        {/* Empty state */}
        {!isLoading && filtered.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            <BarChart3 className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p className="text-lg font-medium">No analysis published yet</p>
            <p className="text-sm mt-1">Check back soon for market insights from our research team.</p>
          </div>
        )}

        {/* Results count */}
        {!isLoading && filtered.length > 0 && (
          <p className="text-xs text-muted-foreground mb-4">
            Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
          </p>
        )}

        {/* Grid */}
        {!isLoading && paginated.length > 0 && (
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeCategory}-${page}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {paginated.map((item, index) => (
                <AnalysisCard key={item.id} item={item} index={index} />
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {/* Pagination */}
        <Pagination page={page} totalPages={totalPages} onPage={handlePage} />
      </div>
    </section>
  );
};
