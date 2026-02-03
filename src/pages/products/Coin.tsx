import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ExternalLink, Smartphone, Wallet, TrendingUp, Shield } from 'lucide-react';

const features = [
  {
    icon: Wallet,
    title: 'Direct mutual funds',
    description: 'Buy direct mutual funds with 0% commission, saving up to 1.5% annually.',
  },
  {
    icon: TrendingUp,
    title: 'SIP automation',
    description: 'Set up automated SIPs and never miss an investment date.',
  },
  {
    icon: Shield,
    title: 'Demat delivery',
    description: 'Units delivered directly to your demat account for complete transparency.',
  },
  {
    icon: Smartphone,
    title: 'Mobile apps',
    description: 'Full-featured Android and iOS apps for investing on the go.',
  },
];

const Coin = () => {
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
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Coin
            </h1>
            <p className="text-lg text-muted-foreground">
              Buy direct mutual funds online, commission-free, delivered directly to 
              your Demat account.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <Button asChild>
                <a href="https://coin.zerodha.com" target="_blank" rel="noopener noreferrer">
                  Go to Coin <ExternalLink className="ml-2 h-4 w-4" />
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
                <Wallet className="h-16 w-16 text-primary mx-auto mb-4" />
                <p className="text-muted-foreground">Coin Mutual Funds Platform</p>
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
                <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">Download Coin</h2>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="outline" className="gap-2">
                <Smartphone className="h-4 w-4" />
                Android App
              </Button>
              <Button variant="outline" className="gap-2">
                <Smartphone className="h-4 w-4" />
                iOS App
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Coin;
