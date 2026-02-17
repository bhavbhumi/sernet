import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Image, Headphones, Video, ArrowRight, Calendar, User, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';

type ArticleFormat = 'All' | 'Text' | 'Image' | 'Audio' | 'Video';

interface Article {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  format: Exclude<ArticleFormat, 'All'>;
  category: string;
  readTime: string;
}

const articles: Article[] = [
  {
    id: 1,
    title: 'Understanding P/E Ratios: A Beginner\'s Guide to Valuation',
    excerpt: 'Learn how to use price-to-earnings ratios to evaluate whether a stock is overvalued or undervalued.',
    author: 'Research Desk',
    date: 'Feb 15, 2026',
    format: 'Text',
    category: 'Fundamentals',
    readTime: '6 min read',
  },
  {
    id: 2,
    title: 'Infographic: India\'s Top Performing Sectors in FY26',
    excerpt: 'A visual breakdown of sector-wise returns, FII flows, and market cap changes across Indian equities.',
    author: 'Design Team',
    date: 'Feb 13, 2026',
    format: 'Image',
    category: 'Markets',
    readTime: '2 min view',
  },
  {
    id: 3,
    title: 'Podcast: Navigating Volatile Markets — Expert Panel Discussion',
    excerpt: 'Our panel of market experts discuss strategies for protecting your portfolio during periods of high volatility.',
    author: 'Insights Studio',
    date: 'Feb 12, 2026',
    format: 'Audio',
    category: 'Strategy',
    readTime: '25 min listen',
  },
  {
    id: 4,
    title: 'Video: How to Read Candlestick Charts Like a Pro',
    excerpt: 'A step-by-step visual guide to reading and interpreting candlestick patterns for better trading decisions.',
    author: 'Education Team',
    date: 'Feb 10, 2026',
    format: 'Video',
    category: 'Technical',
    readTime: '12 min watch',
  },
  {
    id: 5,
    title: 'The Power of Compounding: Why Starting Early Matters',
    excerpt: 'A deep dive into how compound interest works and why time in the market beats timing the market.',
    author: 'Research Desk',
    date: 'Feb 8, 2026',
    format: 'Text',
    category: 'Wealth Building',
    readTime: '8 min read',
  },
  {
    id: 6,
    title: 'Audio Explainer: Union Budget 2026 Impact on Markets',
    excerpt: 'Breaking down the key budget announcements and their implications for equity, debt, and commodity markets.',
    author: 'Insights Studio',
    date: 'Feb 5, 2026',
    format: 'Audio',
    category: 'Economy',
    readTime: '18 min listen',
  },
  {
    id: 7,
    title: 'Visual Guide: ETF vs Index Fund — Which One Should You Pick?',
    excerpt: 'An illustrated comparison of ETFs and index funds covering costs, liquidity, tracking error, and tax efficiency.',
    author: 'Design Team',
    date: 'Feb 3, 2026',
    format: 'Image',
    category: 'Products',
    readTime: '3 min view',
  },
  {
    id: 8,
    title: 'Video: Setting Up Your First SIP — Complete Walkthrough',
    excerpt: 'A hands-on tutorial showing you exactly how to start a Systematic Investment Plan from scratch.',
    author: 'Education Team',
    date: 'Feb 1, 2026',
    format: 'Video',
    category: 'Getting Started',
    readTime: '8 min watch',
  },
];

const formatIcons: Record<string, typeof FileText> = {
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

const formats: ArticleFormat[] = ['All', 'Text', 'Image', 'Audio', 'Video'];

export const ArticlesContent = () => {
  const [activeFormat, setActiveFormat] = useState<ArticleFormat>('All');

  const filteredArticles = activeFormat === 'All'
    ? articles
    : articles.filter((a) => a.format === activeFormat);

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
            <FileText className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-semibold text-foreground">Articles</h2>
          </div>
          <p className="text-muted-foreground">Explore insights in text, image, audio, and video formats — learn the way that suits you best.</p>
        </motion.div>

        {/* Format Filter */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="flex items-center gap-2 mb-8 overflow-x-auto pb-2"
          style={{ scrollbarWidth: 'none' }}
        >
          <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
          {formats.map((fmt) => {
            const Icon = fmt !== 'All' ? formatIcons[fmt] : null;
            return (
              <button
                key={fmt}
                onClick={() => setActiveFormat(fmt)}
                className={`px-4 py-2 text-sm rounded-full whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  activeFormat === fmt
                    ? 'bg-primary text-primary-foreground font-medium'
                    : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                {Icon && <Icon className="h-3.5 w-3.5" />}
                {fmt}
              </button>
            );
          })}
        </motion.div>

        {/* Articles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.map((article, index) => {
            const FormatIcon = formatIcons[article.format];
            return (
              <motion.article
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.08 * index }}
                className="bg-muted/30 rounded-lg p-6 hover:shadow-lg transition-shadow border border-border/50"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${formatColors[article.format]}`}>
                    <FormatIcon className="w-5 h-5" />
                  </div>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
                      {article.category}
                    </span>
                    <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${formatColors[article.format]}`}>
                      {article.format}
                    </span>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">{article.title}</h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{article.excerpt}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    <span>{article.author}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span>{article.readTime}</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {article.date}
                    </span>
                  </div>
                </div>
                <Link to="#" className="flex items-center gap-1 text-primary text-sm font-medium hover:underline">
                  {article.format === 'Audio' ? 'Listen now' : article.format === 'Video' ? 'Watch now' : 'Read more'}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
