import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Calculator } from 'lucide-react';

const MarginCalculator = () => {
  const [stockPrice, setStockPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [segment, setSegment] = useState<'equity' | 'fno'>('equity');

  const calculateMargin = () => {
    const price = parseFloat(stockPrice) || 0;
    const qty = parseInt(quantity) || 0;
    const totalValue = price * qty;

    let marginRequired = 0;
    let leverage = 1;

    if (segment === 'equity') {
      marginRequired = totalValue * 0.2; // 5x leverage for equity intraday
      leverage = 5;
    } else {
      marginRequired = totalValue * 0.15; // ~6.67x leverage for F&O
      leverage = 6.67;
    }

    return {
      totalValue: totalValue.toFixed(2),
      marginRequired: marginRequired.toFixed(2),
      leverage: leverage.toFixed(2),
    };
  };

  const results = calculateMargin();

  return (
    <Layout>
      <section className="section-padding">
        <div className="container-zerodha max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-6">
              <Calculator className="h-8 w-8 text-primary" />
            </div>
            <h1 className="heading-xl mb-4">
              Margin Calculator
            </h1>
            <p className="text-lg text-muted-foreground">
              Calculate the margin required for your trades across different segments
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-6"
            >
              <div className="flex gap-4">
                <Button
                  variant={segment === 'equity' ? 'default' : 'outline'}
                  onClick={() => setSegment('equity')}
                  className="flex-1"
                >
                  Equity Intraday
                </Button>
                <Button
                  variant={segment === 'fno' ? 'default' : 'outline'}
                  onClick={() => setSegment('fno')}
                  className="flex-1"
                >
                  F&O
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="stockPrice">Stock/Index Price (₹)</Label>
                  <Input
                    id="stockPrice"
                    type="number"
                    placeholder="Enter price"
                    value={stockPrice}
                    onChange={(e) => setStockPrice(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="quantity">Quantity / Lot Size</Label>
                  <Input
                    id="quantity"
                    type="number"
                    placeholder="Enter quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-muted/50 rounded-lg p-6"
            >
              <h3 className="font-semibold text-foreground mb-4">Margin Details</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Contract Value</span>
                  <span className="text-foreground font-medium">₹{results.totalValue}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Margin Required</span>
                  <span className="text-primary font-semibold">₹{results.marginRequired}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Leverage</span>
                  <span className="text-foreground font-medium">{results.leverage}x</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-primary/10 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Note:</strong> Margin requirements may vary based on stock volatility 
                  and exchange regulations. Always check the actual margin required in Choice FinX 
                  before placing orders.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default MarginCalculator;
