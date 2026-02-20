import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Image, Headphones, Video, ArrowRight, Calendar, User, Filter, Loader2, Heart, Share2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useArticleEngagement } from '@/hooks/useArticleEngagement';
import { useToast } from '@/hooks/use-toast';

type ArticleFormat = 'All' | 'Text' | 'Image' | 'Audio' | 'Video';

const formatIcons: Record<string, typeof FileText> = {
  Text: FileText,
  Image: Image,
  Audio: Headphones,
  Video: Video,
};

const formatColors: Record<string, string> = {
  Text: 'bg-blue-500/10 text-blue-600',
  Image: 'bg-emerald-500/10 text-emerald-600',
  Audio: 'bg-purple-500/10 text-purple-600',
  Video: 'bg-red-500/10 text-red-600',
};

const formats: ArticleFormat[] = ['All', 'Text', 'Image', 'Audio', 'Video'];

const CATEGORY_FILTERS = ['All', 'IPO Basket', 'Investment', 'Trading', 'Fundamentals', 'Markets'] as const;
type CategoryFilter = (typeof CATEGORY_FILTERS)[number];

const PAGE_SIZE = 12;

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

function ArticleCard({ article, index }: { article: any; index: number }) {
  const { toast } = useToast();
  const { likeCount, liked, shareCount, toggleLike, recordShare } = useArticleEngagement(article.id);

  const handleShare = async () => {
    const url = `${window.location.origin}/z-connect/articles/${article.id}`;
    const isNew = await recordShare();
    navigator.clipboard.writeText(url);
    toast({
      title: '🔗 Link copied!',
      description: isNew
        ? 'Share count recorded. Paste it anywhere!'
        : 'Link copied to clipboard. Paste it anywhere to share.',
    });
  };

  const FormatIcon = formatIcons[article.format] ?? FileText;
  const fmtColor = formatColors[article.format] ?? formatColors['Text'];
  const dateStr = article.item_date
    ? new Date(article.item_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : article.published_at
    ? new Date(article.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : '';

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(0.06 * index, 0.4) }}
      className="bg-muted/30 rounded-lg p-6 hover:shadow-lg transition-shadow border border-border/50 flex flex-col"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${fmtColor}`}>
          <FormatIcon className="w-5 h-5" />
        </div>
        <div className="flex gap-2 flex-wrap">
          <span className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
            {article.category}
          </span>
          <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${fmtColor}`}>
            {article.format}
          </span>
        </div>
      </div>

      <Link to={`/z-connect/articles/${article.id}`}>
        <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2 hover:text-primary transition-colors">{article.title}</h3>
      </Link>
      <p className="text-sm text-muted-foreground mb-4 line-clamp-3 flex-1">{article.excerpt}</p>

      <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
        <div className="flex items-center gap-1">
          <User className="h-3 w-3" />
          <span>{article.author}</span>
        </div>
        <div className="flex items-center gap-3">
          {article.read_time && <span>{article.read_time}</span>}
          {dateStr && (
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {dateStr}
            </span>
          )}
        </div>
      </div>

      {/* Footer: Read more + engagement */}
      <div className="flex items-center justify-between pt-3 border-t border-border/40">
        <Link to={`/z-connect/articles/${article.id}`} className="flex items-center gap-1 text-primary text-sm font-medium hover:underline">
          {article.format === 'Audio' ? 'Listen now' : article.format === 'Video' ? 'Watch now' : 'Read more'}
          <ArrowRight className="h-4 w-4" />
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

export const ArticlesContent = () => {
  const [activeFormat, setActiveFormat] = useState<ArticleFormat>('All');
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('All');
  const [page, setPage] = useState(1);

  const { data: articles = [], isLoading } = useQuery({
    queryKey: ['articles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('status', 'published')
        .order('item_date', { ascending: false, nullsFirst: false });
      if (error) throw error;
      return data;
    },
  });

  const filteredArticles = articles.filter((a) => {
    const matchFormat = activeFormat === 'All' || a.format === activeFormat;
    const matchCategory = activeCategory === 'All' || a.category === activeCategory;
    return matchFormat && matchCategory;
  });

  const totalPages = Math.ceil(filteredArticles.length / PAGE_SIZE);
  const paginated = filteredArticles.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleFormat = (fmt: ArticleFormat) => {
    setActiveFormat(fmt);
    setPage(1);
  };

  const handleCategory = (cat: CategoryFilter) => {
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
            <FileText className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-semibold text-foreground">Articles</h2>
          </div>
          <p className="text-muted-foreground">Explore insights in text, image, audio, and video formats — learn the way that suits you best.</p>
        </motion.div>

        {/* Format Filter */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="flex items-center gap-2 mb-3 overflow-x-auto pb-1"
          style={{ scrollbarWidth: 'none' }}
        >
          <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
          {formats.map((fmt) => {
            const Icon = fmt !== 'All' ? formatIcons[fmt] : null;
            return (
              <button
                key={fmt}
                onClick={() => handleFormat(fmt)}
                className={`px-4 py-2 text-sm rounded-full whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  activeFormat === fmt
                    ? 'bg-primary text-primary-foreground font-medium'
                    : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                {Icon && <Icon className="h-3.5 w-3.5" />}
                {fmt}
              </button>
            );
          })}
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="flex items-center gap-2 mb-8 overflow-x-auto pb-2"
          style={{ scrollbarWidth: 'none' }}
        >
          <span className="w-4 shrink-0" />
          {CATEGORY_FILTERS.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategory(cat)}
              className={`px-3 py-1.5 text-xs rounded-full whitespace-nowrap transition-colors font-medium border ${
                activeCategory === cat
                  ? 'bg-primary/10 text-primary border-primary/30'
                  : 'border-border text-muted-foreground hover:text-foreground hover:border-border/80 bg-transparent'
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
        {!isLoading && filteredArticles.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>No articles found for the selected filters.</p>
          </div>
        )}

        {/* Results count */}
        {!isLoading && filteredArticles.length > 0 && (
          <p className="text-xs text-muted-foreground mb-4">
            Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filteredArticles.length)} of {filteredArticles.length}
          </p>
        )}

        {/* Articles Grid */}
        {!isLoading && paginated.length > 0 && (
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeFormat}-${activeCategory}-${page}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {paginated.map((article, index) => (
                <ArticleCard key={article.id} article={article} index={index} />
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
