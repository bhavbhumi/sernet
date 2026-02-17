import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Calendar, ExternalLink, Filter, Rss } from 'lucide-react';

type CircularCategory = 'All' | 'SEBI Circulars' | 'Exchange Notices' | 'Policy Updates';

const circularItems = [
  {
    id: 1,
    title: 'SEBI Enhances Cybersecurity Framework for Stock Exchanges and Depositories',
    source: 'SEBI',
    date: 'Feb 14, 2026',
    category: 'SEBI Circulars' as CircularCategory,
    link: '#',
    summary: 'New guidelines mandate enhanced cybersecurity measures including SOC operations, incident response plans, and regular audits.',
  },
  {
    id: 2,
    title: 'NSE Circular: Revised Lot Sizes for F&O Contracts Effective March 2026',
    source: 'NSE',
    date: 'Feb 13, 2026',
    category: 'Exchange Notices' as CircularCategory,
    link: '#',
    summary: 'NSE has revised lot sizes for 45 F&O stocks to align with the SEBI mandate of ₹5-10 lakh contract value.',
  },
  {
    id: 3,
    title: 'SEBI Circular: T+0 Settlement for Top 500 Stocks from April 2026',
    source: 'SEBI',
    date: 'Feb 11, 2026',
    category: 'SEBI Circulars' as CircularCategory,
    link: '#',
    summary: 'SEBI extends optional T+0 settlement to top 500 stocks by market cap, marking a significant infrastructure upgrade.',
  },
  {
    id: 4,
    title: 'New KYC Rules: Aadhaar-Based E-KYC Mandatory for All Demat Accounts',
    source: 'CDSL',
    date: 'Feb 9, 2026',
    category: 'Policy Updates' as CircularCategory,
    link: '#',
    summary: 'All existing and new demat accounts must complete Aadhaar e-KYC verification by June 30, 2026.',
  },
  {
    id: 5,
    title: 'BSE Notice: Change in Trading Hours for Currency Derivatives',
    source: 'BSE',
    date: 'Feb 8, 2026',
    category: 'Exchange Notices' as CircularCategory,
    link: '#',
    summary: 'Currency derivatives trading hours extended to 7:30 PM IST to align with global forex market timings.',
  },
];

const categories: CircularCategory[] = ['All', 'SEBI Circulars', 'Exchange Notices', 'Policy Updates'];

const categoryColors: Record<string, string> = {
  'SEBI Circulars': 'bg-red-500/10 text-red-600',
  'Exchange Notices': 'bg-amber-500/10 text-amber-600',
  'Policy Updates': 'bg-purple-500/10 text-purple-600',
};

export const CircularsContent = () => {
  const [activeCategory, setActiveCategory] = useState<CircularCategory>('All');

  const filteredItems = activeCategory === 'All'
    ? circularItems
    : circularItems.filter((item) => item.category === activeCategory);

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
            <AlertCircle className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-semibold text-foreground">Regulatory Circulars</h2>
          </div>
          <p className="text-muted-foreground">SEBI circulars, exchange notices, and policy updates from regulatory bodies.</p>
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

        {/* Circular Items */}
        <div className="space-y-3">
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.05 * index }}
              className="flex gap-4 p-5 bg-muted/30 rounded-lg border border-border/50 hover:shadow-md hover:border-primary/20 transition-all group"
            >
              <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5 text-red-500" />
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

        {/* RSS Subscribe Banner */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="mt-10 p-6 rounded-xl bg-primary/5 border border-primary/20 flex flex-col md:flex-row items-center gap-4"
        >
          <Rss className="w-10 h-10 text-primary shrink-0" />
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-lg font-semibold text-foreground mb-1">Subscribe to Circular Alerts</h3>
            <p className="text-sm text-muted-foreground">Get real-time notifications for SEBI circulars, exchange notices, and policy updates.</p>
          </div>
          <button className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shrink-0">
            <Rss className="h-4 w-4" /> Subscribe
          </button>
        </motion.div>
      </div>
    </section>
  );
};
