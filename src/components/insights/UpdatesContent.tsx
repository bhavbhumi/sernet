import { useState } from 'react';
import { motion } from 'framer-motion';
import { Rss, Newspaper, AlertCircle, Calendar, ExternalLink, Filter } from 'lucide-react';

type FeedCategory = 'All' | 'Market News' | 'SEBI Circulars' | 'Exchange Notices' | 'Corporate Actions' | 'Policy Updates';

interface FeedItem {
  id: number;
  title: string;
  source: string;
  date: string;
  category: FeedCategory;
  type: 'news' | 'circular';
  link: string;
  summary: string;
}

const feedItems: FeedItem[] = [
  {
    id: 1,
    title: 'SEBI Enhances Cybersecurity Framework for Stock Exchanges and Depositories',
    source: 'SEBI',
    date: 'Feb 14, 2026',
    category: 'SEBI Circulars',
    type: 'circular',
    link: '#',
    summary: 'New guidelines mandate enhanced cybersecurity measures including SOC operations, incident response plans, and regular audits.',
  },
  {
    id: 2,
    title: 'Sensex Crosses 95,000 Mark for the First Time Amid Global Rally',
    source: 'Reuters',
    date: 'Feb 14, 2026',
    category: 'Market News',
    type: 'news',
    link: '#',
    summary: 'Indian markets hit historic highs driven by strong FII inflows and positive global cues from US Fed commentary.',
  },
  {
    id: 3,
    title: 'NSE Circular: Revised Lot Sizes for F&O Contracts Effective March 2026',
    source: 'NSE',
    date: 'Feb 13, 2026',
    category: 'Exchange Notices',
    type: 'circular',
    link: '#',
    summary: 'NSE has revised lot sizes for 45 F&O stocks to align with the SEBI mandate of ₹5-10 lakh contract value.',
  },
  {
    id: 4,
    title: 'RBI Holds Repo Rate Steady at 6.0% in February Policy Review',
    source: 'Economic Times',
    date: 'Feb 12, 2026',
    category: 'Market News',
    type: 'news',
    link: '#',
    summary: 'The MPC voted 5-1 to maintain status quo, citing inflation concerns despite signs of moderating growth.',
  },
  {
    id: 5,
    title: 'SEBI Circular: T+0 Settlement for Top 500 Stocks from April 2026',
    source: 'SEBI',
    date: 'Feb 11, 2026',
    category: 'SEBI Circulars',
    type: 'circular',
    link: '#',
    summary: 'SEBI extends optional T+0 settlement to top 500 stocks by market cap, marking a significant infrastructure upgrade.',
  },
  {
    id: 6,
    title: 'Tata Motors Announces 1:5 Stock Split — Record Date March 15',
    source: 'BSE Filing',
    date: 'Feb 10, 2026',
    category: 'Corporate Actions',
    type: 'news',
    link: '#',
    summary: 'Tata Motors board approves sub-division of equity shares from ₹10 to ₹2 face value to improve liquidity.',
  },
  {
    id: 7,
    title: 'New KYC Rules: Aadhaar-Based E-KYC Mandatory for All Demat Accounts',
    source: 'CDSL',
    date: 'Feb 9, 2026',
    category: 'Policy Updates',
    type: 'circular',
    link: '#',
    summary: 'All existing and new demat accounts must complete Aadhaar e-KYC verification by June 30, 2026.',
  },
  {
    id: 8,
    title: 'BSE Notice: Change in Trading Hours for Currency Derivatives',
    source: 'BSE',
    date: 'Feb 8, 2026',
    category: 'Exchange Notices',
    type: 'circular',
    link: '#',
    summary: 'Currency derivatives trading hours extended to 7:30 PM IST to align with global forex market timings.',
  },
];

const categories: FeedCategory[] = ['All', 'Market News', 'SEBI Circulars', 'Exchange Notices', 'Corporate Actions', 'Policy Updates'];

const categoryColors: Record<string, string> = {
  'Market News': 'bg-blue-500/10 text-blue-600',
  'SEBI Circulars': 'bg-red-500/10 text-red-600',
  'Exchange Notices': 'bg-amber-500/10 text-amber-600',
  'Corporate Actions': 'bg-emerald-500/10 text-emerald-600',
  'Policy Updates': 'bg-purple-500/10 text-purple-600',
};

export const UpdatesContent = () => {
  const [activeCategory, setActiveCategory] = useState<FeedCategory>('All');

  const filteredItems = activeCategory === 'All'
    ? feedItems
    : feedItems.filter((item) => item.category === activeCategory);

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
            <Rss className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-semibold text-foreground">Live Updates & RSS Feeds</h2>
          </div>
          <p className="text-muted-foreground">Real-time news and regulatory circulars from exchanges, SEBI, and market sources.</p>
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

        {/* Feed Items */}
        <div className="space-y-3">
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.05 * index }}
              className="flex gap-4 p-5 bg-muted/30 rounded-lg border border-border/50 hover:shadow-md hover:border-primary/20 transition-all group"
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                item.type === 'circular' ? 'bg-red-500/10' : 'bg-blue-500/10'
              }`}>
                {item.type === 'circular' ? (
                  <AlertCircle className="w-5 h-5 text-red-500" />
                ) : (
                  <Newspaper className="w-5 h-5 text-blue-500" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-2 mb-1 flex-wrap">
                  <a
                    href={item.link}
                    className="text-base font-semibold text-foreground hover:text-primary transition-colors group-hover:text-primary"
                  >
                    {item.title}
                  </a>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{item.summary}</p>
                <div className="flex items-center gap-3 flex-wrap">
                  <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${categoryColors[item.category] || 'bg-muted text-muted-foreground'}`}>
                    {item.category}
                  </span>
                  <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${
                    item.type === 'circular' ? 'bg-red-500/10 text-red-600' : 'bg-blue-500/10 text-blue-600'
                  }`}>
                    {item.type === 'circular' ? 'Circular' : 'News'}
                  </span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> {item.date}
                  </span>
                  <span className="text-xs text-muted-foreground">via {item.source}</span>
                </div>
              </div>
              <a
                href={item.link}
                className="self-center shrink-0 p-2 rounded-full hover:bg-muted transition-colors"
                title="Open source"
              >
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
            <h3 className="text-lg font-semibold text-foreground mb-1">Subscribe to Our RSS Feed</h3>
            <p className="text-sm text-muted-foreground">Get real-time updates on market news, circulars, and exchange notices delivered to your feed reader.</p>
          </div>
          <button className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shrink-0">
            <Rss className="h-4 w-4" /> Subscribe RSS
          </button>
        </motion.div>
      </div>
    </section>
  );
};
