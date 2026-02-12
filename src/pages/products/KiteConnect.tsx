import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ExternalLink, Code, Zap, Users, BookOpen } from 'lucide-react';

const features = [
  {
    icon: Code,
    title: 'Simple APIs',
    description: 'Super simple HTTP/JSON APIs for placing orders, fetching data, and more.',
  },
  {
    icon: Zap,
    title: 'Real-time streaming',
    description: 'WebSocket streaming for live market data with minimal latency.',
  },
  {
    icon: Users,
    title: 'Partner ecosystem',
    description: 'Build apps and showcase them to our 1.6+ crore customers.',
  },
  {
    icon: BookOpen,
    title: 'Documentation',
    description: 'Comprehensive documentation with examples in multiple languages.',
  },
];

const KiteConnect = () => {
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
              Kite Connect
            </h1>
            <p className="text-body">
              Build powerful trading platforms and experiences with our super simple 
              HTTP/JSON APIs. If you are a startup, build your investment app and 
              showcase it to our clientbase.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <Button asChild>
                <a href="https://kite.trade" target="_blank" rel="noopener noreferrer">
                  Get Started <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href="https://kite.trade/docs/connect/v3/" target="_blank" rel="noopener noreferrer">
                  View Documentation
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
            <pre className="bg-foreground/5 rounded-lg p-6 overflow-x-auto">
              <code className="text-sm text-muted-foreground">
{`from kiteconnect import KiteConnect

kite = KiteConnect(api_key="your_api_key")

# Place an order
order_id = kite.place_order(
    tradingsymbol="INFY",
    exchange=kite.EXCHANGE_NSE,
    transaction_type=kite.TRANSACTION_TYPE_BUY,
    quantity=1,
    order_type=kite.ORDER_TYPE_MARKET,
    product=kite.PRODUCT_CNC
)`}
              </code>
            </pre>
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

export default KiteConnect;
