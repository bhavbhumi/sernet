import { Layout } from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { MessageSquare, TrendingUp, BookOpen, Users, Search, Star } from 'lucide-react';

const TradingQnA = () => {
  const categories = [
    {
      icon: TrendingUp,
      title: 'Trading & Markets',
      description: 'Questions about stocks, F&O, commodities, and currency trading',
      topics: 234,
    },
    {
      icon: BookOpen,
      title: 'Mutual Funds',
      description: 'Everything about mutual fund investing and Coin',
      topics: 156,
    },
    {
      icon: MessageSquare,
      title: 'General Discussion',
      description: 'Market news, opinions, and general investing discussions',
      topics: 892,
    },
    {
      icon: Users,
      title: 'Zerodha Platforms',
      description: 'Kite, Console, Coin usage questions and tips',
      topics: 421,
    },
  ];

  const popularTopics = [
    'How to calculate F&O margins?',
    'What is the difference between NRML and MIS?',
    'How do I transfer shares from another broker?',
    'GTT orders - how do they work?',
    'Tax implications on short-term gains',
    'Best practices for intraday trading',
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
              <MessageSquare className="w-4 h-4" />
              Community
            </div>
            <h1 className="text-display mb-6">TradingQ&A</h1>
            <p className="text-body max-w-2xl mx-auto mb-8">
              India's most active trading and investment community. Ask questions, 
              share knowledge, and learn from fellow traders and investors.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <a href="https://tradingqna.com" target="_blank" rel="noopener noreferrer">
                  Visit TradingQ&A
                </a>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl mx-auto mb-16"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search questions..."
                className="w-full pl-12 pr-4 py-4 border border-border rounded-lg bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {categories.map((category, index) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <category.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {category.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-2">
                      {category.description}
                    </p>
                    <span className="text-xs text-primary">{category.topics} topics</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-muted/30 rounded-2xl p-8 md:p-12 mb-16"
          >
            <h2 className="text-2xl font-semibold text-foreground text-center mb-8">
              Popular questions
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {popularTopics.map((topic) => (
                <a
                  key={topic}
                  href="https://tradingqna.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-background rounded-lg hover:bg-primary/5 transition-colors"
                >
                  <Star className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="text-foreground text-sm">{topic}</span>
                </a>
              ))}
            </div>
          </motion.div>

          <div className="text-center">
            <h3 className="text-xl font-semibold text-foreground mb-4">
              Join the community
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
              TradingQ&A is free for everyone. Create an account to ask questions, 
              share your knowledge, and connect with India's most active trading community.
            </p>
            <Button asChild>
              <a href="https://tradingqna.com" target="_blank" rel="noopener noreferrer">
                Get started
              </a>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default TradingQnA;
