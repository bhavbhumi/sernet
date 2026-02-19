import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Layout } from '@/components/layout/Layout';
import { ArrowLeft, Calendar, User, Clock, FileText, Image, Headphones, Video, Heart, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useArticleEngagement } from '@/hooks/useArticleEngagement';
import { useToast } from '@/hooks/use-toast';

const formatIcons: Record<string, React.ElementType> = {
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

export default function ArticleDetail() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();

  const { data: article, isLoading } = useQuery({
    queryKey: ['article', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('id', id!)
        .eq('status', 'published')
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const { likeCount, liked, shareCount, toggleLike, recordShare } = useArticleEngagement(id ?? '');

  const handleShare = async () => {
    const url = window.location.href;
    await recordShare();
    if (navigator.share) {
      navigator.share({ title: article?.title, url }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url);
      toast({ title: 'Link copied!', description: 'Article link copied to clipboard.' });
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container-zerodha py-16 max-w-3xl mx-auto space-y-4">
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

  if (!article) {
    return (
      <Layout>
        <div className="container-zerodha py-24 text-center">
          <h1 className="text-2xl font-semibold mb-4">Article not found</h1>
          <Link to="/z-connect" className="text-primary hover:underline flex items-center gap-1 justify-center">
            <ArrowLeft className="h-4 w-4" /> Back to Insights
          </Link>
        </div>
      </Layout>
    );
  }

  const FormatIcon = formatIcons[article.format] ?? FileText;
  const fmtColor = formatColors[article.format] ?? formatColors['Text'];
  const dateStr = article.published_at
    ? new Date(article.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    : '';

  return (
    <Layout>
      <motion.article
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="container-zerodha py-10 max-w-3xl mx-auto"
      >
        {/* Back link */}
        <Link
          to="/z-connect"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Insights
        </Link>

        {/* Badges */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <span className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
            {article.category}
          </span>
          <span className={`px-3 py-1 text-xs font-medium rounded-full flex items-center gap-1.5 ${fmtColor}`}>
            <FormatIcon className="h-3.5 w-3.5" />
            {article.format}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-foreground leading-tight mb-4">{article.title}</h1>

        {/* Meta + Engagement row */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
          <div className="flex items-center gap-5 text-sm text-muted-foreground flex-wrap">
            <span className="flex items-center gap-1.5"><User className="h-4 w-4" />{article.author}</span>
            {dateStr && <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" />{dateStr}</span>}
            {article.read_time && <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" />{article.read_time}</span>}
          </div>

          {/* Like & Share */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleLike}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border transition-colors ${
                liked
                  ? 'bg-red-50 border-red-200 text-red-500 dark:bg-red-950/30 dark:border-red-800'
                  : 'border-border text-muted-foreground hover:border-red-300 hover:text-red-500'
              }`}
            >
              <Heart className={`h-4 w-4 ${liked ? 'fill-red-500' : ''}`} />
              <span>{likeCount > 0 ? likeCount : ''} {liked ? 'Liked' : 'Like'}</span>
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border border-border text-muted-foreground hover:border-primary hover:text-primary transition-colors"
            >
              <Share2 className="h-4 w-4" />
              <span>{shareCount > 0 ? `${shareCount} ` : ''}Share</span>
            </button>
          </div>
        </div>

        {/* Thumbnail */}
        {article.thumbnail_url && (
          <div className="mb-8 rounded-xl overflow-hidden border border-border">
            <img src={article.thumbnail_url} alt={article.title} className="w-full object-cover max-h-80" />
          </div>
        )}

        {/* Media embed */}
        {article.media_url && article.format === 'Audio' && (
          <div className="mb-8 p-4 bg-muted/40 rounded-xl border border-border">
            <audio controls className="w-full" src={article.media_url}>
              Your browser does not support the audio element.
            </audio>
          </div>
        )}
        {article.media_url && article.format === 'Video' && (
          <div className="mb-8 rounded-xl overflow-hidden border border-border aspect-video">
            <video controls className="w-full h-full" src={article.media_url}>
              Your browser does not support the video element.
            </video>
          </div>
        )}
        {article.media_url && article.format === 'Image' && (
          <div className="mb-8 rounded-xl overflow-hidden border border-border">
            <img src={article.media_url} alt={article.title} className="w-full object-cover" />
          </div>
        )}

        {/* Excerpt */}
        {article.excerpt && (
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed border-l-4 border-primary/40 pl-4 italic">
            {article.excerpt}
          </p>
        )}

        {/* Body */}
        {article.body && (
          <div
            className="prose prose-neutral dark:prose-invert max-w-none text-foreground leading-relaxed"
            style={{ whiteSpace: 'pre-wrap' }}
          >
            {article.body}
          </div>
        )}

        {/* Bottom engagement bar */}
        <div className="mt-12 pt-6 border-t border-border flex items-center justify-between flex-wrap gap-3">
          <p className="text-sm text-muted-foreground">Was this article helpful?</p>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleLike}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm border transition-colors ${
                liked
                  ? 'bg-red-50 border-red-200 text-red-500 dark:bg-red-950/30 dark:border-red-800'
                  : 'border-border text-muted-foreground hover:border-red-300 hover:text-red-500'
              }`}
            >
              <Heart className={`h-4 w-4 ${liked ? 'fill-red-500' : ''}`} />
              <span>{likeCount > 0 ? `${likeCount} ` : ''}Like{likeCount !== 1 ? 's' : ''}</span>
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm border border-border text-muted-foreground hover:border-primary hover:text-primary transition-colors"
            >
              <Share2 className="h-4 w-4" />
              <span>{shareCount > 0 ? `${shareCount} ` : ''}Share{shareCount !== 1 ? 's' : ''}</span>
            </button>
          </div>
        </div>
      </motion.article>
    </Layout>
  );
}
