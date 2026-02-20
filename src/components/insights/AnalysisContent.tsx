import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, BarChart3, PieChart, ArrowRight, Calendar, User, Filter, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const iconMap: Record<string, React.ElementType> = {
  TrendingUp,
  BarChart3,
  PieChart,
};

const categories = ['All', 'Weekly Update', 'Technical', 'Fundamental', 'Macro', 'Sectoral', 'Quantitative', 'Derivatives'];

function AnalysisCard({ item, index }: { item: any; index: number }) {
  const Icon = iconMap[item.icon_name ?? 'TrendingUp'] ?? TrendingUp;
  const dateStr = item.item_date
    ? new Date(item.item_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : item.published_at
    ? new Date(item.published_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : '';

  return (
    <motion.article
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

      <Link to={`/z-connect/analysis/${item.id}`}>
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

      <div className="pt-3 border-t border-border/40">
        <Link
          to={`/z-connect/analysis/${item.id}`}
          className="flex items-center gap-1 text-primary text-sm font-medium hover:underline"
        >
          Read more <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </motion.article>
  );
}

export const AnalysisContent = () => {
  const [activeCategory, setActiveCategory] = useState('All');

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
          <p className="text-muted-foreground">In-depth technical, fundamental, and macro analysis from our research team.</p>
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

        {/* Grid */}
        {!isLoading && filtered.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((item, index) => (
              <AnalysisCard key={item.id} item={item} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
