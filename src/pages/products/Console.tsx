import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ExternalLink, PieChart, FileText, TrendingUp, Shield } from 'lucide-react';

const features = [
  {
    icon: PieChart,
    title: 'Portfolio insights',
    description: 'Comprehensive visualizations of your holdings, asset allocation, and performance.',
  },
  {
    icon: FileText,
    title: 'Tax reports',
    description: 'P&L statements, tax reports, and contract notes - all in one place.',
  },
  {
    icon: TrendingUp,
    title: 'Performance tracking',
    description: 'Track your investments with detailed analytics and historical data.',
  },
  {
    icon: Shield,
    title: 'Account management',
    description: 'Manage your profile, bank accounts, and trading preferences.',
  },
];

const Console = () => {
  return (
    <Layout>
      <section className="section-padding bg-gradient-to-b from-muted/30 to-background">
        <div className="container-zerodha">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <h1 className="heading-xl mb-4">
              Console
            </h1>
            <p className="text-body">
              The central dashboard for your Zerodha account. Gain insights into your 
              trades and investments with in-depth reports and visualisations.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <Button asChild>
                <a href="https://console.zerodha.com" target="_blank" rel="noopener noreferrer">
                  Login to Console <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-muted/50 rounded-lg p-8 mb-16"
          >
            <div className="aspect-video bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <PieChart className="h-16 w-16 text-primary mx-auto mb-4" />
                <p className="text-muted-foreground">Console Dashboard Preview</p>
              </div>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="text-center"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="heading-md mb-2">{feature.title}</h3>
                <p className="text-small">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Console;
