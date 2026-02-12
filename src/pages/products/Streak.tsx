import { Layout } from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { TrendingUp, Zap, LineChart, Code, Bell, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Streak = () => {
  const features = [
    {
      icon: Code,
      title: 'No coding required',
      description: 'Create complex trading strategies using simple English-like conditions. No programming knowledge needed.',
    },
    {
      icon: LineChart,
      title: 'Backtest strategies',
      description: 'Test your strategies against historical data to see how they would have performed.',
    },
    {
      icon: Bell,
      title: 'Real-time alerts',
      description: 'Get notified instantly when your strategy conditions are met in the live market.',
    },
    {
      icon: TrendingUp,
      title: 'Paper trading',
      description: 'Practice your strategies with virtual money before risking real capital.',
    },
    {
      icon: BarChart3,
      title: 'Technical indicators',
      description: 'Access 100+ technical indicators to build sophisticated trading strategies.',
    },
    {
      icon: Zap,
      title: 'One-click deployment',
      description: 'Deploy strategies directly to your Kite account with a single click.',
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
              <Zap className="w-4 h-4" />
              Algo Trading Platform
            </div>
            <h1 className="heading-xl mb-6">Streak</h1>
            <p className="text-body max-w-2xl mx-auto mb-8">
              Create, backtest, and deploy trading strategies without writing a single line of code. 
              Streak is the algo trading platform for retail traders.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <a href="https://streak.zerodha.com" target="_blank" rel="noopener noreferrer">
                  Try Streak
                </a>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/signup">Open account</Link>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-muted/30 rounded-2xl p-8 md:p-12 mb-16"
          >
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="heading-lg mb-4">
                Algorithmic trading made accessible
              </h2>
              <p className="text-body">
                Streak democratizes algo trading by making it accessible to everyone. 
                Build strategies using plain English conditions, backtest them against 
                years of historical data, and deploy them with a single click. No coding, 
                no complex setups, just pure trading logic.
              </p>
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
                <h3 className="heading-md mb-2">
                  {feature.title}
                </h3>
                <p className="text-small">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="bg-primary/5 rounded-lg p-8 text-center">
            <h3 className="heading-md mb-3">
              Pricing
            </h3>
            <p className="text-muted-foreground mb-6">
              Streak is available as a subscription service with plans starting at ₹500/month. 
              Free trial available for new users.
            </p>
            <Button asChild>
              <a href="https://streak.zerodha.com/pricing" target="_blank" rel="noopener noreferrer">
                View plans
              </a>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Streak;
