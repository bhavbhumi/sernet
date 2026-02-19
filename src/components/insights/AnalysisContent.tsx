import { motion } from 'framer-motion';
import { TrendingUp, BarChart3, PieChart, ArrowRight, Calendar, User, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const iconMap: Record<string, React.ElementType> = {
  TrendingUp,
  BarChart3,
  PieChart,
};

export const AnalysisContent = () => {
  const { data: analyses = [], isLoading } = useQuery({
    queryKey: ['analyses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('analyses')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <section className="section-padding">
      <div className="container-zerodha">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-10"
        >
          <h2 className="text-2xl font-semibold text-foreground mb-2">Market Analysis</h2>
          <p className="text-muted-foreground">In-depth technical, fundamental, and macro analysis from our research team.</p>
        </motion.div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20 text-muted-foreground gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Loading analysis…</span>
          </div>
        ) : analyses.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <BarChart3 className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p className="text-lg font-medium">No analysis published yet</p>
            <p className="text-sm mt-1">Check back soon for market insights from our research team.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {analyses.map((item, index) => {
              const Icon = iconMap[item.icon_name ?? 'TrendingUp'] ?? TrendingUp;
              const dateStr = item.published_at
                ? new Date(item.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                : '';
              return (
                <motion.article
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.08 * index }}
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
                  <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">{item.title}</h3>
                  {item.excerpt && (
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3 flex-1">{item.excerpt}</p>
                  )}
                  <div className="flex items-center justify-between text-xs text-muted-foreground mt-auto pt-4 border-t border-border/40">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <span>{item.author}</span>
                    </div>
                    {dateStr && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{dateStr}</span>
                      </div>
                    )}
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
