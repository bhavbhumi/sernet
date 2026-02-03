import { Layout } from '@/components/layout/Layout';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Activity, Clock } from 'lucide-react';

const indices = [
  { name: 'NIFTY 50', value: '22,147.00', change: '+0.85%', isUp: true },
  { name: 'SENSEX', value: '72,831.94', change: '+0.78%', isUp: true },
  { name: 'NIFTY BANK', value: '47,526.65', change: '-0.12%', isUp: false },
  { name: 'NIFTY IT', value: '35,982.30', change: '+1.24%', isUp: true },
];

const topGainers = [
  { name: 'ADANIPORTS', price: '1,245.80', change: '+4.52%' },
  { name: 'TATASTEEL', price: '167.45', change: '+3.21%' },
  { name: 'HINDALCO', price: '598.30', change: '+2.89%' },
  { name: 'JSWSTEEL', price: '876.55', change: '+2.45%' },
  { name: 'COALINDIA', price: '435.20', change: '+2.12%' },
];

const topLosers = [
  { name: 'CIPLA', price: '1,432.60', change: '-2.34%' },
  { name: 'SUNPHARMA', price: '1,567.85', change: '-1.87%' },
  { name: 'DRREDDY', price: '5,876.40', change: '-1.56%' },
  { name: 'DIVISLAB', price: '3,987.25', change: '-1.23%' },
  { name: 'APOLLOHOSP', price: '6,234.70', change: '-0.98%' },
];

const MarketOverview = () => {
  return (
    <Layout>
      <section className="section-padding">
        <div className="container-zerodha">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-6">
              <Activity className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Market Overview
            </h1>
            <p className="text-lg text-muted-foreground">
              Live updates on Indian stock market indices and top movers
            </p>
            <div className="flex items-center justify-center gap-2 mt-4 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Last updated: {new Date().toLocaleString('en-IN')}</span>
            </div>
          </motion.div>

          {/* Indices */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
          >
            {indices.map((index) => (
              <div
                key={index.name}
                className="bg-muted/50 rounded-lg p-4 text-center"
              >
                <p className="text-sm text-muted-foreground mb-1">{index.name}</p>
                <p className="text-xl font-bold text-foreground">{index.value}</p>
                <p className={`text-sm font-medium ${index.isUp ? 'text-green-600' : 'text-red-600'}`}>
                  {index.change}
                </p>
              </div>
            ))}
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Top Gainers */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-muted/50 rounded-lg p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <h2 className="text-lg font-semibold text-foreground">Top Gainers</h2>
              </div>
              <div className="space-y-3">
                {topGainers.map((stock) => (
                  <div key={stock.name} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                    <span className="font-medium text-foreground">{stock.name}</span>
                    <div className="text-right">
                      <span className="text-foreground">₹{stock.price}</span>
                      <span className="ml-2 text-green-600 text-sm">{stock.change}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Top Losers */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-muted/50 rounded-lg p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <TrendingDown className="h-5 w-5 text-red-600" />
                <h2 className="text-lg font-semibold text-foreground">Top Losers</h2>
              </div>
              <div className="space-y-3">
                {topLosers.map((stock) => (
                  <div key={stock.name} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                    <span className="font-medium text-foreground">{stock.name}</span>
                    <div className="text-right">
                      <span className="text-foreground">₹{stock.price}</span>
                      <span className="ml-2 text-red-600 text-sm">{stock.change}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-8 p-4 bg-primary/10 rounded-lg text-center"
          >
            <p className="text-sm text-muted-foreground">
              <strong>Disclaimer:</strong> The data shown above is for demonstration purposes only. 
              For live market data, please visit Kite or use the Kite Connect API.
            </p>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default MarketOverview;
