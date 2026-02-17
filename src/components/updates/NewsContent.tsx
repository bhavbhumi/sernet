import { useState } from 'react';
import { motion } from 'framer-motion';
import { Newspaper, Calendar, ExternalLink, Filter } from 'lucide-react';

type NewsCategory = 'All' | 'Market News' | 'Corporate Actions' | 'Economy';

const newsItems = [
  {
    id: 1,
    title: 'Sensex Crosses 95,000 Mark for the First Time Amid Global Rally',
    source: 'Reuters',
    date: 'Feb 14, 2026',
    category: 'Market News' as NewsCategory,
    link: '#',
    summary: 'Indian markets hit historic highs driven by strong FII inflows and positive global cues from US Fed commentary.',
  },
  {
    id: 2,
    title: 'RBI Holds Repo Rate Steady at 6.0% in February Policy Review',
    source: 'Economic Times',
    date: 'Feb 12, 2026',
    category: 'Economy' as NewsCategory,
    link: '#',
    summary: 'The MPC voted 5-1 to maintain status quo, citing inflation concerns despite signs of moderating growth.',
  },
  {
    id: 3,
    title: 'Tata Motors Announces 1:5 Stock Split — Record Date March 15',
    source: 'BSE Filing',
    date: 'Feb 10, 2026',
    category: 'Corporate Actions' as NewsCategory,
    link: '#',
    summary: 'Tata Motors board approves sub-division of equity shares from ₹10 to ₹2 face value to improve liquidity.',
  },
  {
    id: 4,
    title: 'IT Sector Sees Strong Q3 Earnings, Guidance Upgrades Across Board',
    source: 'Moneycontrol',
    date: 'Feb 8, 2026',
    category: 'Market News' as NewsCategory,
    link: '#',
    summary: 'Top IT companies report better-than-expected Q3 results with improved deal pipelines and margin expansion.',
  },
  {
    id: 5,
    title: 'India GDP Growth Revised Upward to 7.2% for FY26',
    source: 'Bloomberg',
    date: 'Feb 6, 2026',
    category: 'Economy' as NewsCategory,
    link: '#',
    summary: 'The Central Statistics Office revises GDP growth estimate on the back of strong manufacturing and services data.',
  },
];

const categories: NewsCategory[] = ['All', 'Market News', 'Corporate Actions', 'Economy'];

const categoryColors: Record<string, string> = {
  'Market News': 'bg-blue-500/10 text-blue-600',
  'Corporate Actions': 'bg-emerald-500/10 text-emerald-600',
  'Economy': 'bg-purple-500/10 text-purple-600',
};

export const NewsContent = () => {
  const [activeCategory, setActiveCategory] = useState<NewsCategory>('All');

  const filteredItems = activeCategory === 'All'
    ? newsItems
    : newsItems.filter((item) => item.category === activeCategory);

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
            <Newspaper className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-semibold text-foreground">Market News</h2>
          </div>
          <p className="text-muted-foreground">Latest market news, corporate actions, and economic developments.</p>
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

        {/* News Items */}
        <div className="space-y-3">
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.05 * index }}
              className="flex gap-4 p-5 bg-muted/30 rounded-lg border border-border/50 hover:shadow-md hover:border-primary/20 transition-all group"
            >
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                <Newspaper className="w-5 h-5 text-blue-500" />
              </div>
              <div className="flex-1 min-w-0">
                <a href={item.link} className="text-base font-semibold text-foreground hover:text-primary transition-colors group-hover:text-primary">
                  {item.title}
                </a>
                <p className="text-sm text-muted-foreground mb-2 mt-1">{item.summary}</p>
                <div className="flex items-center gap-3 flex-wrap">
                  <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${categoryColors[item.category] || 'bg-muted text-muted-foreground'}`}>
                    {item.category}
                  </span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> {item.date}
                  </span>
                  <span className="text-xs text-muted-foreground">via {item.source}</span>
                </div>
              </div>
              <a href={item.link} className="self-center shrink-0 p-2 rounded-full hover:bg-muted transition-colors">
                <ExternalLink className="w-4 h-4 text-muted-foreground" />
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
