import { Layout } from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { PieChart, TrendingUp, RefreshCw, Briefcase, Star, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const Smallcase = () => {
  const features = [
    {
      icon: Briefcase,
      title: 'Thematic portfolios',
      description: 'Invest in professionally curated portfolios built around themes, strategies, and market ideas.',
    },
    {
      icon: PieChart,
      title: 'Diversification made easy',
      description: 'Each smallcase contains a basket of stocks/ETFs, giving you instant diversification.',
    },
    {
      icon: RefreshCw,
      title: 'Regular rebalancing',
      description: 'Get notified when your smallcase needs rebalancing to stay aligned with its strategy.',
    },
    {
      icon: Star,
      title: 'Expert-managed',
      description: 'Portfolios are created and managed by SEBI-registered professionals and research firms.',
    },
    {
      icon: TrendingUp,
      title: 'Track performance',
      description: 'Monitor your portfolio performance with detailed analytics and insights.',
    },
    {
      icon: Shield,
      title: 'You own the stocks',
      description: 'Unlike mutual funds, you directly own the underlying stocks in your demat account.',
    },
  ];

  const popularSmallcases = [
    {
      name: 'All Weather Investing',
      description: 'A balanced portfolio designed to perform in all market conditions',
      minAmount: '₹4,890',
    },
    {
      name: 'Top 100 Stocks',
      description: 'Invest in India\'s top 100 companies by market cap',
      minAmount: '₹6,747',
    },
    {
      name: 'Dividend Aristocrats',
      description: 'Companies with consistent dividend growth track record',
      minAmount: '₹5,234',
    },
    {
      name: 'Brand Value',
      description: 'Portfolio of companies with strong brand recognition',
      minAmount: '₹3,567',
    },
  ];

  return (
    <Layout>
      <section className="section-padding bg-background">
        <div className="container-zerodha">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <PieChart className="w-4 h-4" />
              Thematic Investing
            </div>
            <h1 className="text-display mb-6">smallcase</h1>
            <p className="text-body max-w-2xl mx-auto mb-8">
              Invest in portfolios of stocks and ETFs built around market themes, 
              strategies, and ideas. Simple, transparent, and in your control.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <a href="https://smallcase.zerodha.com" target="_blank" rel="noopener noreferrer">
                  Explore smallcases
                </a>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/signup">Open account</Link>
              </Button>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card border border-border rounded-lg p-6"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-16"
          >
            <h2 className="text-2xl font-semibold text-foreground text-center mb-8">
              Popular smallcases
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {popularSmallcases.map((smallcase) => (
                <div
                  key={smallcase.name}
                  className="bg-muted/30 rounded-lg p-6 hover:bg-muted/50 transition-colors"
                >
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {smallcase.name}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {smallcase.description}
                  </p>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Min. investment: </span>
                    <span className="text-foreground font-medium">{smallcase.minAmount}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="bg-primary/5 rounded-lg p-8 text-center">
            <h3 className="text-xl font-semibold text-foreground mb-3">
              How it works
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              smallcase is available for free within Kite. Some smallcases may have 
              subscription fees charged by the portfolio manager. You can invest in 
              any smallcase with just a few clicks.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Smallcase;
