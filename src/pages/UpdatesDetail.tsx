import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Layout } from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ExternalLink,
  Calendar,
  Rss,
  Newspaper,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

type UpdatesMode = 'news' | 'circulars';

interface UpdateItem {
  id: string;
  title: string;
  source: string;
  category: string;
  link: string | null;
  summary: string | null;
  is_rss: boolean | null;
  rss_feed_url: string | null;
  published_at: string | null;
  status: string;
}

export default function UpdatesDetail() {
  const { id, mode } = useParams<{ id: string; mode: string }>();
  const navigate = useNavigate();
  const isNews = mode === 'news';

  const { data: item, isLoading, isError } = useQuery({
    queryKey: ['updates_detail', mode, id],
    queryFn: async () => {
      const table = isNews ? 'news_items' : 'circulars';
      const { data, error } = await supabase
        .from(table as 'news_items' | 'circulars')
        .select('*')
        .eq('id', id!)
        .eq('status', 'published')
        .single();
      if (error) throw error;
      return data as UpdateItem;
    },
    enabled: !!id && !!mode,
  });

  const backPath = '/updates';
  const backLabel = isNews ? 'Market News' : 'Regulatory Circulars';
  const Icon = isNews ? Newspaper : AlertCircle;
  const iconColor = isNews ? 'text-blue-500' : 'text-red-500';
  const iconBg = isNews ? 'bg-blue-500/10' : 'bg-red-500/10';
  const badgeColor = isNews
    ? 'bg-blue-500/10 text-blue-600'
    : 'bg-red-500/10 text-red-600';

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh] gap-2 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Loading...</span>
        </div>
      </Layout>
    );
  }

  if (isError || !item) {
    return (
      <Layout>
        <div className="container-zerodha py-20 text-center">
          <Icon className="h-12 w-12 mx-auto mb-4 opacity-30 text-muted-foreground" />
          <h2 className="text-xl font-semibold mb-2">Item not found</h2>
          <p className="text-muted-foreground mb-6">This item may have been removed or is not published.</p>
          <Button variant="outline" asChild>
            <Link to={backPath}><ArrowLeft className="h-4 w-4 mr-2" /> Back to Updates</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container-zerodha py-10 max-w-3xl">
        {/* Back */}
        <motion.div
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-muted-foreground hover:text-foreground -ml-2"
            onClick={() => navigate(backPath)}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to {backLabel}
          </Button>
        </motion.div>

        <motion.article
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Icon + category */}
          <div className="flex items-center gap-3 mb-5">
            <div className={`w-10 h-10 rounded-full ${iconBg} flex items-center justify-center shrink-0`}>
              {item.is_rss
                ? <Rss className={`w-5 h-5 ${iconColor}`} />
                : <Icon className={`w-5 h-5 ${iconColor}`} />
              }
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${badgeColor}`}>
                {item.category}
              </span>
              {item.is_rss && (
                <Badge variant="outline" className="text-xs gap-1">
                  <Rss className="h-3 w-3" /> RSS Feed
                </Badge>
              )}
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-bold text-foreground leading-snug mb-4">
            {item.title}
          </h1>

          {/* Meta */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-8 flex-wrap">
            {item.published_at && (
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {format(new Date(item.published_at), 'MMMM d, yyyy')}
              </span>
            )}
            <span>via <strong className="text-foreground">{item.source}</strong></span>
          </div>

          {/* Divider */}
          <div className="border-t border-border mb-8" />

          {/* Summary / body */}
          {item.summary ? (
            <div className="prose prose-sm max-w-none text-foreground leading-relaxed">
              <p className="text-base text-muted-foreground leading-relaxed">{item.summary}</p>
            </div>
          ) : (
            <p className="text-muted-foreground italic">No summary available for this item.</p>
          )}

          {/* RSS feed URL info */}
          {item.is_rss && item.rss_feed_url && (
            <div className="mt-6 p-4 rounded-lg bg-muted/40 border border-border">
              <p className="text-xs text-muted-foreground mb-1 font-medium uppercase tracking-wide">RSS Feed URL</p>
              <a
                href={item.rss_feed_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline break-all"
              >
                {item.rss_feed_url}
              </a>
            </div>
          )}

          {/* Read More CTA */}
          {item.link && (
            <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row gap-3">
              <Button asChild size="lg" className="gap-2">
                <a href={item.link} target="_blank" rel="noopener noreferrer">
                  Read Full {isNews ? 'Article' : 'Circular'}
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to={backPath}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to {backLabel}
                </Link>
              </Button>
            </div>
          )}

          {!item.link && (
            <div className="mt-10 pt-6 border-t border-border">
              <Button variant="outline" size="lg" asChild>
                <Link to={backPath}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to {backLabel}
                </Link>
              </Button>
            </div>
          )}
        </motion.article>
      </div>
    </Layout>
  );
}
