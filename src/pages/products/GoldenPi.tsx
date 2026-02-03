import { Layout } from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Landmark, TrendingUp, Shield, Clock, PieChart, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const GoldenPi = () => {
  const features = [
    {
      icon: Landmark,
      title: 'Government & Corporate Bonds',
      description: 'Access to a wide range of government securities and corporate bonds in one place.',
    },
    {
      icon: TrendingUp,
      title: 'Better returns than FDs',
      description: 'Bond yields often exceed fixed deposit rates with similar safety profiles.',
    },
    {
      icon: Shield,
      title: 'Credit ratings visible',
      description: 'See credit ratings from agencies like CRISIL, ICRA, and CARE before investing.',
    },
    {
      icon: Clock,
      title: 'Flexible tenures',
      description: 'Choose from bonds with maturities ranging from a few months to several years.',
    },
    {
      icon: PieChart,
      title: 'Portfolio diversification',
      description: 'Add fixed income to your portfolio to reduce overall investment risk.',
    },
    {
      icon: CheckCircle2,
      title: 'Easy buying process',
      description: 'Buy bonds directly from Kite with the same ease as buying stocks.',
    },
  ];

  const bondTypes = [
    {
      name: 'Government Securities (G-Secs)',
      description: 'Sovereign bonds issued by RBI with the highest safety rating',
      yield: '7.0% - 7.5%',
    },
    {
      name: 'State Development Loans (SDLs)',
      description: 'Bonds issued by state governments with sovereign backing',
      yield: '7.2% - 7.8%',
    },
    {
      name: 'Corporate Bonds (AAA)',
      description: 'High-quality bonds from blue-chip companies',
      yield: '7.5% - 8.5%',
    },
    {
      name: 'Tax-free Bonds',
      description: 'Interest income is exempt from income tax',
      yield: '5.0% - 6.0% (tax-free)',
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
              <Landmark className="w-4 h-4" />
              Fixed Income
            </div>
            <h1 className="text-display mb-6">GoldenPi</h1>
            <p className="text-body max-w-2xl mx-auto mb-8">
              Invest in bonds directly from Kite. Government securities, corporate bonds, 
              and more with transparent pricing and real-time execution.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <a href="https://goldenpi.com" target="_blank" rel="noopener noreferrer">
                  Explore bonds
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
                Why invest in bonds?
              </h2>
              <p className="text-body">
                Bonds provide stable, predictable returns and are an essential part of a 
                balanced portfolio. Unlike stocks, bonds pay regular interest and return 
                your principal at maturity, making them ideal for capital preservation 
                and income generation.
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
              Types of bonds available
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {bondTypes.map((bond) => (
                <div
                  key={bond.name}
                  className="bg-card border border-border rounded-lg p-6"
                >
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {bond.name}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {bond.description}
                  </p>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Indicative yield: </span>
                    <span className="text-primary font-medium">{bond.yield}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="bg-primary/5 rounded-lg p-8 text-center">
            <h3 className="text-xl font-semibold text-foreground mb-3">
              No additional charges
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              GoldenPi is integrated into Kite at no extra cost. Standard Zerodha 
              brokerage charges apply for bond transactions.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default GoldenPi;
