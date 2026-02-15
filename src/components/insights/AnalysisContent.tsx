import { motion } from 'framer-motion';
import { TrendingUp, BarChart3, PieChart, ArrowRight, Calendar, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const analyses = [
  {
    id: 1,
    title: 'Nifty 50 Weekly Technical Analysis — Key Support & Resistance Levels',
    excerpt: 'A detailed look at Nifty 50 chart patterns, moving averages, and what traders should watch for in the upcoming week.',
    author: 'Research Desk',
    date: 'Feb 12, 2026',
    category: 'Technical',
    icon: TrendingUp,
  },
  {
    id: 2,
    title: 'Sectoral Rotation: Where Smart Money Is Moving in Q1 2026',
    excerpt: 'FII and DII flow analysis across sectors reveals interesting shifts towards defensive plays amid global uncertainty.',
    author: 'Strategy Team',
    date: 'Feb 10, 2026',
    category: 'Sectoral',
    icon: PieChart,
  },
  {
    id: 3,
    title: 'Mid-Cap vs Large-Cap: Risk-Adjusted Returns Comparison',
    excerpt: 'Our quantitative analysis of the last 5 years shows that mid-caps offer superior returns with manageable risk.',
    author: 'Quant Desk',
    date: 'Feb 8, 2026',
    category: 'Quantitative',
    icon: BarChart3,
  },
  {
    id: 4,
    title: 'Global Macro Impact on Indian Equities — US Fed, China & Oil',
    excerpt: 'Understanding how international macroeconomic events are shaping domestic market sentiment and portfolio strategy.',
    author: 'Research Desk',
    date: 'Feb 5, 2026',
    category: 'Macro',
    icon: TrendingUp,
  },
  {
    id: 5,
    title: 'Earnings Season Preview: Top 10 Stocks to Watch',
    excerpt: 'Ahead of Q3 results, we highlight companies with strong earnings visibility and potential for positive surprises.',
    author: 'Strategy Team',
    date: 'Feb 3, 2026',
    category: 'Fundamental',
    icon: BarChart3,
  },
  {
    id: 6,
    title: 'Options Strategy: Iron Condor Setup for Range-Bound Markets',
    excerpt: 'A step-by-step guide to deploying iron condors when volatility is low and markets are trading sideways.',
    author: 'Derivatives Desk',
    date: 'Jan 30, 2026',
    category: 'Derivatives',
    icon: PieChart,
  },
];

export const AnalysisContent = () => {
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {analyses.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.08 * index }}
                className="bg-muted/30 rounded-lg p-6 hover:shadow-lg transition-shadow border border-border/50"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
                    {item.category}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{item.excerpt}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    <span>{item.author}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{item.date}</span>
                  </div>
                </div>
                <Link to="#" className="flex items-center gap-1 text-primary text-sm font-medium hover:underline">
                  Read analysis <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
