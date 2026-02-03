import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ExternalLink, Smartphone, Monitor, BarChart3, Zap } from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'Blazing fast',
    description: 'Experience ultra-fast execution with streaming market data and minimal latency.',
  },
  {
    icon: BarChart3,
    title: 'Advanced charting',
    description: '100+ technical indicators, 6 chart types, drawing tools, and more.',
  },
  {
    icon: Monitor,
    title: 'Multi-platform',
    description: 'Available on web, Windows, Mac, Android, and iOS.',
  },
  {
    icon: Smartphone,
    title: 'Mobile first',
    description: 'Full-featured mobile apps with the same power as the web platform.',
  },
];

const Kite = () => {
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
              Kite
            </h1>
            <p className="text-lg text-muted-foreground">
              Our ultra-fast flagship trading platform with streaming market data, 
              advanced charts, an elegant UI, and more.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <Button asChild>
                <a href="https://kite-demo.zerodha.com" target="_blank" rel="noopener noreferrer">
                  Try demo <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href="https://kite.zerodha.com" target="_blank" rel="noopener noreferrer">
                  Login to Kite
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
                <Monitor className="h-16 w-16 text-primary mx-auto mb-4" />
                <p className="text-muted-foreground">Kite Trading Platform Preview</p>
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
            <h2 className="text-2xl font-bold text-foreground mb-4">Download Kite</h2>
            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="outline" className="gap-2">
                <Smartphone className="h-4 w-4" />
                Android App
              </Button>
              <Button variant="outline" className="gap-2">
                <Smartphone className="h-4 w-4" />
                iOS App
              </Button>
              <Button variant="outline" className="gap-2">
                <Monitor className="h-4 w-4" />
                Windows
              </Button>
              <Button variant="outline" className="gap-2">
                <Monitor className="h-4 w-4" />
                Mac
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Kite;
