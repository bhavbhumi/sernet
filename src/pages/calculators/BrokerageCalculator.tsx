import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Calculator, ArrowRight } from 'lucide-react';

const BrokerageCalculator = () => {
  const [buyPrice, setBuyPrice] = useState('');
  const [sellPrice, setSellPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [tradeType, setTradeType] = useState<'delivery' | 'intraday'>('delivery');

  const calculateBrokerage = () => {
    const buy = parseFloat(buyPrice) || 0;
    const sell = parseFloat(sellPrice) || 0;
    const qty = parseInt(quantity) || 0;

    const turnover = (buy + sell) * qty;
    const brokerage = tradeType === 'delivery' ? 0 : Math.min(20, turnover * 0.0003);
    const stt = tradeType === 'delivery' ? turnover * 0.001 : sell * qty * 0.00025;
    const exchangeCharges = turnover * 0.0000345;
    const gst = (brokerage + exchangeCharges) * 0.18;
    const sebiCharges = turnover * 0.000001;
    const stampDuty = buy * qty * 0.00015;
    
    const totalCharges = brokerage + stt + exchangeCharges + gst + sebiCharges + stampDuty;
    const profit = (sell - buy) * qty - totalCharges;

    return {
      turnover: turnover.toFixed(2),
      brokerage: brokerage.toFixed(2),
      stt: stt.toFixed(2),
      exchangeCharges: exchangeCharges.toFixed(2),
      gst: gst.toFixed(2),
      sebiCharges: sebiCharges.toFixed(2),
      stampDuty: stampDuty.toFixed(2),
      totalCharges: totalCharges.toFixed(2),
      profit: profit.toFixed(2),
    };
  };

  const results = calculateBrokerage();

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
              Brokerage Calculator
            </h1>
            <p className="text-lg text-muted-foreground">
              Calculate your trading costs including brokerage, STT, and other charges
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
                  variant={tradeType === 'delivery' ? 'default' : 'outline'}
                  onClick={() => setTradeType('delivery')}
                  className="flex-1"
                >
                  Delivery
                </Button>
                <Button
                  variant={tradeType === 'intraday' ? 'default' : 'outline'}
                  onClick={() => setTradeType('intraday')}
                  className="flex-1"
                >
                  Intraday
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="buyPrice">Buy Price (₹)</Label>
                  <Input
                    id="buyPrice"
                    type="number"
                    placeholder="Enter buy price"
                    value={buyPrice}
                    onChange={(e) => setBuyPrice(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="sellPrice">Sell Price (₹)</Label>
                  <Input
                    id="sellPrice"
                    type="number"
                    placeholder="Enter sell price"
                    value={sellPrice}
                    onChange={(e) => setSellPrice(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="quantity">Quantity</Label>
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
              <h3 className="font-semibold text-foreground mb-4">Calculation Results</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Turnover</span>
                  <span className="text-foreground">₹{results.turnover}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Brokerage</span>
                  <span className="text-foreground">₹{results.brokerage}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">STT</span>
                  <span className="text-foreground">₹{results.stt}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Exchange Charges</span>
                  <span className="text-foreground">₹{results.exchangeCharges}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">GST</span>
                  <span className="text-foreground">₹{results.gst}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">SEBI Charges</span>
                  <span className="text-foreground">₹{results.sebiCharges}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Stamp Duty</span>
                  <span className="text-foreground">₹{results.stampDuty}</span>
                </div>
                <div className="border-t border-border pt-3 mt-3">
                  <div className="flex justify-between font-semibold">
                    <span className="text-foreground">Total Charges</span>
                    <span className="text-foreground">₹{results.totalCharges}</span>
                  </div>
                  <div className="flex justify-between font-semibold mt-2">
                    <span className="text-foreground">Net P&L</span>
                    <span className={parseFloat(results.profit) >= 0 ? 'text-green-600' : 'text-red-600'}>
                      ₹{results.profit}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default BrokerageCalculator;
