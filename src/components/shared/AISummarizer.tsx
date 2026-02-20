import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, TrendingUp, TrendingDown, Minus, ChevronDown, ChevronUp, Loader2, Zap } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Summary {
  tldr: string;
  keyPoints: string[];
  sentiment: 'bullish' | 'bearish' | 'neutral';
  readTime: string;
}

interface AISummarizerProps {
  contentId: string;
  title: string;
  body: string;
  contentType?: 'article' | 'analysis';
}

const sentimentConfig = {
  bullish: {
    label: 'Bullish',
    icon: TrendingUp,
    className: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400',
  },
  bearish: {
    label: 'Bearish',
    icon: TrendingDown,
    className: 'bg-red-500/10 text-red-600 border-red-500/20 dark:text-red-400',
  },
  neutral: {
    label: 'Neutral',
    icon: Minus,
    className: 'bg-muted text-muted-foreground border-border',
  },
};

export function AISummarizer({ contentId, title, body, contentType = 'article' }: AISummarizerProps) {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [isCached, setIsCached] = useState(false);
  const [loading, setLoading] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const { toast } = useToast();

  const handleSummarize = async () => {
    if (summary) {
      // Already summarized — just toggle collapse
      setCollapsed((c) => !c);
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('summarize-content', {
        body: { contentId, title, body, contentType },
      });

      if (error) throw error;

      if (data?.error) {
        toast({ title: 'Summarizer error', description: data.error, variant: 'destructive' });
        return;
      }

      setSummary(data.summary);
      setIsCached(data.cached === true);
      setCollapsed(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Could not generate summary';
      toast({ title: 'Summarizer error', description: msg, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const sentiment = summary ? sentimentConfig[summary.sentiment] ?? sentimentConfig.neutral : null;
  const SentimentIcon = sentiment?.icon ?? Minus;

  return (
    <div className="mb-8">
      {/* Trigger button — always visible */}
      <button
        onClick={handleSummarize}
        disabled={loading}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all duration-200 ${
          summary
            ? 'border-primary/40 text-primary bg-primary/5 hover:bg-primary/10'
            : 'border-border text-muted-foreground hover:border-primary hover:text-primary hover:bg-primary/5'
        } disabled:opacity-60 disabled:cursor-not-allowed`}
      >
        {loading ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <Sparkles className="h-3.5 w-3.5" />
        )}
        {loading
          ? 'Generating summary…'
          : summary
          ? collapsed
            ? 'Show AI Summary'
            : 'Hide AI Summary'
          : 'AI Summary'}
        {summary && !loading && (
          collapsed ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronUp className="h-3.5 w-3.5" />
        )}
      </button>

      {/* Summary card */}
      <AnimatePresence>
        {summary && !collapsed && (
          <motion.div
            key="summary-card"
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <div className="mt-3 rounded-xl border border-primary/20 bg-primary/[0.03] dark:bg-primary/[0.05] p-5 space-y-4">
              {/* Header row */}
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold text-foreground">AI Summary</span>
                  <span className="text-xs text-muted-foreground">· {summary.readTime}</span>
                  {isCached && (
                    <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                      <Zap className="h-2.5 w-2.5" /> cached
                    </span>
                  )}
                </div>
                {sentiment && (
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${sentiment.className}`}
                  >
                    <SentimentIcon className="h-3 w-3" />
                    {sentiment.label}
                  </span>
                )}
              </div>

              {/* TL;DR */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">TL;DR</p>
                <p className="text-sm text-foreground leading-relaxed">{summary.tldr}</p>
              </div>

              {/* Key points */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Key Takeaways</p>
                <ul className="space-y-1.5">
                  {summary.keyPoints.map((point, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-foreground/85">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Disclaimer */}
              <p className="text-[11px] text-muted-foreground/70 pt-1 border-t border-border/50">
                AI-generated summary — for reference only. Read the full {contentType} for complete details.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
