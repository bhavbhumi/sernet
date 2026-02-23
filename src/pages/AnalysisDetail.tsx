import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Layout } from '@/components/layout/Layout';
import { ArrowLeft, Calendar, User, TrendingUp, BarChart3, PieChart, List, Heart, Share2 } from 'lucide-react';
import { AISummarizer } from '@/components/shared/AISummarizer';
import { motion } from 'framer-motion';
import { ArticleBodyRenderer, extractToc, TocEntry } from '@/components/shared/ArticleBodyRenderer';
import { useArticleEngagement } from '@/hooks/useArticleEngagement';
import { useToast } from '@/hooks/use-toast';

const iconMap: Record<string, React.ElementType> = {
  TrendingUp,
  BarChart3,
  PieChart,
};

function TableOfContents({ toc, activeSlug }: { toc: TocEntry[]; activeSlug: string }) {
  const activeRef = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [activeSlug]);

  if (toc.length < 2) return null;

  return (
    <motion.aside
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
    >
      <div className="sticky top-24 bg-muted/40 border border-border/60 rounded-xl p-4 w-64 max-h-[calc(100vh-8rem)] overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
        <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-foreground">
          <List className="h-4 w-4 text-primary" />
          Topic Index
        </div>
        <nav className="space-y-0.5">
          {toc.map((entry) => {
            const isActive = activeSlug === entry.slug;
            return (
              <a
                key={entry.slug}
                ref={isActive ? activeRef : undefined}
                href={`#${entry.slug}`}
                className={`block text-xs leading-snug py-1.5 transition-colors rounded px-2 ${
                  entry.level === 1 ? 'font-semibold' : entry.level === 2 ? 'pl-3' : 'pl-5 text-muted-foreground'
                } ${
                  isActive
                    ? 'text-primary bg-primary/10 font-medium border-l-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                {entry.text}
              </a>
            );
          })}
        </nav>
      </div>
    </motion.aside>
  );
}

export default function AnalysisDetail() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [activeSlug, setActiveSlug] = useState('');

  const { data: analysis, isLoading } = useQuery({
    queryKey: ['analysis', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('analyses')
        .select('*')
        .eq('id', id!)
        .eq('status', 'published')
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const { likeCount, liked, shareCount, alreadyShared, toggleLike, recordShare } = useArticleEngagement(id ?? '');

  const toc: TocEntry[] = analysis?.body ? extractToc(analysis.body) : [];

  useEffect(() => {
    if (!toc.length) return;
    const headingEls = toc.map(({ slug }) => document.getElementById(slug)).filter(Boolean) as HTMLElement[];
    if (!headingEls.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) setActiveSlug(visible[0].target.id);
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0 }
    );
    headingEls.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [toc.length, analysis?.body]);

  const handleShare = async () => {
    const url = window.location.href;
    const isNew = await recordShare();
    navigator.clipboard.writeText(url);
    toast({
      title: '🔗 Link copied!',
      description: isNew
        ? 'Share count recorded. Paste it anywhere to share!'
        : 'Link copied to clipboard. Paste it anywhere to share.',
    });
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container-zerodha py-16 max-w-5xl mx-auto space-y-4">
          <div className="h-6 w-32 bg-muted animate-pulse rounded" />
          <div className="h-10 w-3/4 bg-muted animate-pulse rounded" />
          <div className="h-4 w-1/2 bg-muted animate-pulse rounded" />
          <div className="space-y-2 mt-8">
            {Array(8).fill(0).map((_, i) => <div key={i} className="h-4 bg-muted animate-pulse rounded" />)}
          </div>
        </div>
      </Layout>
    );
  }

  if (!analysis) {
    return (
      <Layout>
        <div className="container-zerodha py-24 text-center">
          <h1 className="text-2xl font-semibold mb-4">Analysis not found</h1>
          <Link to="/insights" className="text-primary hover:underline flex items-center gap-1 justify-center">
            <ArrowLeft className="h-4 w-4" /> Back to Insights
          </Link>
        </div>
      </Layout>
    );
  }

  const Icon = iconMap[analysis.icon_name ?? 'TrendingUp'] ?? TrendingUp;
  const dateStr = (analysis.item_date || analysis.published_at)
    ? new Date(analysis.item_date || analysis.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    : '';

  const LikeButton = ({ size = 'sm' }: { size?: 'sm' | 'md' }) => (
    <button
      onClick={toggleLike}
      className={`flex items-center gap-1.5 rounded-full text-sm border transition-colors ${
        size === 'md' ? 'px-4 py-2' : 'px-3 py-1.5'
      } ${
        liked
          ? 'bg-red-50 border-red-200 text-red-500 dark:bg-red-950/30 dark:border-red-800'
          : 'border-border text-muted-foreground hover:border-red-300 hover:text-red-500'
      }`}
    >
      <Heart className={`h-4 w-4 ${liked ? 'fill-red-500' : ''}`} />
      <span>{likeCount > 0 ? `${likeCount} ` : ''}{liked ? 'Liked' : 'Like'}</span>
    </button>
  );

  const ShareButton = ({ size = 'sm' }: { size?: 'sm' | 'md' }) => (
    <button
      onClick={handleShare}
      className={`flex items-center gap-1.5 rounded-full text-sm border transition-colors ${
        size === 'md' ? 'px-4 py-2' : 'px-3 py-1.5'
      } ${
        alreadyShared
          ? 'border-primary/40 text-primary bg-primary/5'
          : 'border-border text-muted-foreground hover:border-primary hover:text-primary'
      }`}
      title={alreadyShared ? 'Copy link again' : 'Copy & share link'}
    >
      <Share2 className="h-4 w-4" />
      <span>{shareCount > 0 ? `${shareCount} ` : ''}Share</span>
    </button>
  );

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="container-zerodha py-10 max-w-6xl mx-auto"
      >
        {/* Back link */}
        <Link
          to="/insights"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Insights
        </Link>

        {/* Two-column layout */}
        <div className="flex gap-8 items-start">
          {/* LEFT: TOC sidebar */}
          {toc.length >= 2 && (
            <div className="shrink-0 hidden lg:block sticky top-24 self-start">
              {/* Media at top of sidebar */}
              {analysis.media_url && /\.(jpg|jpeg|png|gif|webp|svg)(\?|$)/i.test(analysis.media_url) && (
                <div className="w-64 mb-4">
                  <div className="rounded-xl overflow-hidden border border-border mb-3">
                    <img src={analysis.media_url} alt={analysis.title} className="w-full object-cover" />
                  </div>
                </div>
              )}
              <TableOfContents toc={toc} activeSlug={activeSlug} />
            </div>
          )}

          {/* MAIN: Analysis content */}
          <article className="flex-1 min-w-0">
            {/* Badges */}
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <span className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
                {analysis.category}
              </span>
              <span className="px-3 py-1 text-xs font-medium bg-muted text-muted-foreground rounded-full flex items-center gap-1.5">
                <Icon className="h-3.5 w-3.5" />
                Analysis
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-foreground leading-tight mb-4">{analysis.title}</h1>

            {/* Meta + Engagement row */}
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
              <div className="flex items-center gap-5 text-sm text-muted-foreground flex-wrap">
                <span className="flex items-center gap-1.5"><User className="h-4 w-4" />{analysis.author}</span>
                {dateStr && <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" />{dateStr}</span>}
              </div>
              <div className="flex items-center gap-3">
                <LikeButton />
                <ShareButton />
              </div>
            </div>

            {/* Mobile TOC */}
            {toc.length >= 2 && (
              <div className="lg:hidden mb-8">
                <div className="bg-muted/40 border border-border/60 rounded-xl p-4 mb-6">
                  <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-foreground">
                    <List className="h-4 w-4 text-primary" />
                    Topic Index
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {toc.filter(e => e.level <= 2).map((entry) => (
                      <a
                        key={entry.slug}
                        href={`#${entry.slug}`}
                        className="text-xs px-3 py-1.5 rounded-full bg-background border border-border text-muted-foreground hover:text-primary hover:border-primary transition-colors"
                      >
                        {entry.text}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Media image — inline when no TOC sidebar */}
            {toc.length < 2 && analysis.media_url && /\.(jpg|jpeg|png|gif|webp|svg)(\?|$)/i.test(analysis.media_url) && (
              <div className="mb-8 rounded-xl overflow-hidden border border-border">
                <img src={analysis.media_url} alt={analysis.title} className="w-full object-cover max-h-80" />
              </div>
            )}

            {/* Media image — mobile when TOC exists (sidebar hidden on mobile) */}
            {toc.length >= 2 && analysis.media_url && /\.(jpg|jpeg|png|gif|webp|svg)(\?|$)/i.test(analysis.media_url) && (
              <div className="lg:hidden mb-8 rounded-xl overflow-hidden border border-border">
                <img src={analysis.media_url} alt={analysis.title} className="w-full object-cover max-h-64" />
              </div>
            )}

            {/* Excerpt */}
            {analysis.excerpt && (
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed border-l-4 border-primary/40 pl-4 italic">
                {analysis.excerpt}
              </p>
            )}

            {/* AI Summarizer */}
            {analysis.body && (
              <AISummarizer
                contentId={analysis.id}
                title={analysis.title}
                body={analysis.body}
                contentType="analysis"
              />
            )}

            {/* Body */}
            {analysis.body && (
              <div className="text-foreground leading-relaxed">
                <ArticleBodyRenderer body={analysis.body} />
              </div>
            )}

            {/* Bottom engagement bar */}
            <div className="mt-12 pt-6 border-t border-border flex items-center justify-between flex-wrap gap-3">
              <p className="text-sm text-muted-foreground">Was this analysis helpful?</p>
              <div className="flex items-center gap-3">
                <LikeButton size="md" />
                <ShareButton size="md" />
              </div>
            </div>

            <div className="mt-6">
              <Link
                to="/insights"
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4" /> Back to Insights
              </Link>
            </div>
          </article>
        </div>
      </motion.div>
    </Layout>
  );
}
