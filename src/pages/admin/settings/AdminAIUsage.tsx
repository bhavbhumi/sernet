import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Sparkles, FileText, BarChart3, Zap, Clock, TrendingUp, TrendingDown, Minus, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const sentimentConfig = {
  bullish: { label: 'Bullish', icon: TrendingUp, className: 'text-emerald-600 bg-emerald-500/10' },
  bearish: { label: 'Bearish', icon: TrendingDown, className: 'text-red-600 bg-red-500/10' },
  neutral: { label: 'Neutral', icon: Minus, className: 'text-muted-foreground bg-muted' },
};

export default function AdminAIUsage() {
  const { toast } = useToast();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data: summaries, isLoading, refetch } = useQuery({
    queryKey: ['admin-ai-summaries'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('content_summaries')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: contentMap } = useQuery({
    queryKey: ['admin-ai-content-map'],
    queryFn: async () => {
      const [{ data: arts }, { data: analyses }] = await Promise.all([
        supabase.from('articles').select('id, title, category'),
        supabase.from('analyses').select('id, title, category'),
      ]);
      const map: Record<string, { title: string; category: string }> = {};
      arts?.forEach(a => { map[a.id] = { title: a.title, category: a.category }; });
      analyses?.forEach(a => { map[a.id] = { title: a.title, category: a.category }; });
      return map;
    },
  });

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    const { error } = await supabase.from('content_summaries').delete().eq('id', id);
    if (error) {
      toast({ title: 'Delete failed', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Summary deleted', description: 'Next "AI Summary" click will regenerate it.' });
      refetch();
    }
    setDeletingId(null);
  };

  const total = summaries?.length ?? 0;
  const articleCount = summaries?.filter(s => s.content_type === 'article').length ?? 0;
  const analysisCount = summaries?.filter(s => s.content_type === 'analysis').length ?? 0;
  const bullishCount = summaries?.filter(s => s.sentiment === 'bullish').length ?? 0;
  const bearishCount = summaries?.filter(s => s.sentiment === 'bearish').length ?? 0;

  return (
    <AdminLayout
      title="AI Usage Monitor"
      subtitle="Each entry = one AI credit ever spent. All subsequent views are served from cache for free."
    >
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="col-span-2 lg:col-span-1 rounded-xl border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground mb-1">Total AI Calls</p>
            <p className="text-3xl font-bold text-foreground">{total}</p>
            <p className="text-xs text-muted-foreground mt-1">summaries cached</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-1.5 mb-1">
              <FileText className="h-3.5 w-3.5 text-primary" />
              <p className="text-xs text-muted-foreground">Articles</p>
            </div>
            <p className="text-2xl font-bold text-foreground">{articleCount}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-1.5 mb-1">
              <BarChart3 className="h-3.5 w-3.5 text-primary" />
              <p className="text-xs text-muted-foreground">Analyses</p>
            </div>
            <p className="text-2xl font-bold text-foreground">{analysisCount}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-1.5 mb-1">
              <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
              <p className="text-xs text-muted-foreground">Bullish</p>
            </div>
            <p className="text-2xl font-bold text-foreground">{bullishCount}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-1.5 mb-1">
              <TrendingDown className="h-3.5 w-3.5 text-destructive" />
              <p className="text-xs text-muted-foreground">Bearish</p>
            </div>
            <p className="text-2xl font-bold text-foreground">{bearishCount}</p>
          </div>
        </div>

        {/* Credits info */}
        <div className="flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/[0.03] px-4 py-3">
          <Zap className="h-4 w-4 text-primary mt-0.5 shrink-0" />
          <p className="text-sm text-foreground">
            <span className="font-semibold">How credits work: </span>
            The first user to click "AI Summary" on any article spends one credit. Every subsequent view — by any user — is free and instant from cache.
            Delete a row below to force a fresh AI regeneration on next click.
          </p>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-border overflow-hidden">
          <div className="px-4 py-3 border-b border-border bg-muted/30 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" /> Cached Summaries
            </h2>
            <span className="text-xs text-muted-foreground">{total} total</span>
          </div>

          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground text-sm">Loading…</div>
          ) : !summaries?.length ? (
            <div className="p-8 text-center text-muted-foreground text-sm">
              No summaries yet. Open any article and click "AI Summary" to generate the first one.
            </div>
          ) : (
            <div className="divide-y divide-border">
              {summaries.map((s) => {
                const meta = contentMap?.[s.content_id];
                const sConf = sentimentConfig[s.sentiment as keyof typeof sentimentConfig] ?? sentimentConfig.neutral;
                const SIcon = sConf.icon;

                return (
                  <div key={s.id} className="px-4 py-3 flex items-start gap-4 hover:bg-muted/20 transition-colors">
                    {/* Type badge */}
                    <span className={`mt-0.5 shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium ${
                      s.content_type === 'article' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                    }`}>
                      {s.content_type === 'article' ? <FileText className="h-2.5 w-2.5" /> : <BarChart3 className="h-2.5 w-2.5" />}
                      {s.content_type}
                    </span>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {meta?.title ?? `ID: ${s.content_id.slice(0, 8)}…`}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{s.tldr}</p>
                      <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                        <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium ${sConf.className}`}>
                          <SIcon className="h-2.5 w-2.5" />
                          {sConf.label}
                        </span>
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <Clock className="h-2.5 w-2.5" /> {s.read_time}
                        </span>
                        {meta?.category && (
                          <span className="text-[10px] text-muted-foreground">{meta.category}</span>
                        )}
                      </div>
                    </div>

                    {/* Date + delete */}
                    <div className="shrink-0 text-right flex flex-col items-end gap-2">
                      <p className="text-[10px] text-muted-foreground">
                        {format(new Date(s.created_at), 'dd MMM yy, HH:mm')}
                      </p>
                      <button
                        onClick={() => handleDelete(s.id)}
                        disabled={deletingId === s.id}
                        className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors disabled:opacity-40"
                        title="Delete to force regeneration"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
