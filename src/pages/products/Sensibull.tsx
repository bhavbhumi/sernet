import { Layout } from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Target, BarChart3, Shield, Zap, Eye, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

const Sensibull = () => {
  const features = [
    {
      icon: Target,
      title: 'Strategy Builder',
      description: 'Build multi-leg options strategies with visual payoff diagrams. See potential profit/loss before trading.',
    },
    {
      icon: BarChart3,
      title: 'Options Analytics',
      description: 'Deep analytics including IV percentile, OI analysis, and Greeks for informed decision making.',
    },
    {
      icon: Eye,
      title: 'OI & Volume Analysis',
      description: 'Track open interest changes and volume patterns to understand market sentiment.',
    },
    {
      icon: Shield,
      title: 'Risk Management',
      description: 'Define and manage risk with built-in position sizing and max loss calculators.',
    },
    {
      icon: Zap,
      title: 'One-click Trading',
      description: 'Execute complex multi-leg strategies with a single click directly on Kite.',
    },
    {
      icon: Settings,
      title: 'Virtual Trading',
      description: 'Practice options trading with virtual money before risking real capital.',
    },
  ];

  const strategies = [
    { name: 'Iron Condor', description: 'Profit from range-bound markets with limited risk' },
    { name: 'Bull Call Spread', description: 'Bullish strategy with capped profit and loss' },
    { name: 'Straddle', description: 'Profit from big moves in either direction' },
    { name: 'Covered Call', description: 'Generate income from stocks you already own' },
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
              <Target className="w-4 h-4" />
              Options Trading
            </div>
            <h1 className="text-display mb-6">Sensibull</h1>
            <p className="text-body max-w-2xl mx-auto mb-8">
              India's most advanced options trading platform. Build strategies, 
              analyze markets, and trade options with confidence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <a href="https://sensibull.com" target="_blank" rel="noopener noreferrer">
                  Try Sensibull
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
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Options trading simplified
              </h2>
              <p className="text-body">
                Sensibull makes options trading accessible by providing visual tools 
                for strategy building, comprehensive analytics for market analysis, 
                and seamless integration with Kite for instant execution. Whether you're 
                hedging, generating income, or speculating, Sensibull has you covered.
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
              Popular strategies
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {strategies.map((strategy) => (
                <div
                  key={strategy.name}
                  className="bg-muted/30 rounded-lg p-6 hover:bg-muted/50 transition-colors"
                >
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {strategy.name}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {strategy.description}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="bg-primary/5 rounded-lg p-8 text-center">
            <h3 className="text-xl font-semibold text-foreground mb-3">
              Pricing
            </h3>
            <p className="text-muted-foreground mb-6">
              Free tier available with basic features. Pro plans start at ₹800/month 
              for advanced analytics and unlimited strategy building.
            </p>
            <Button asChild>
              <a href="https://sensibull.com/pricing" target="_blank" rel="noopener noreferrer">
                View plans
              </a>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Sensibull;
