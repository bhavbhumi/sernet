import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const MarginCalcContent = () => {
  const [stockPrice, setStockPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [segment, setSegment] = useState<'equity' | 'fno'>('equity');

  const calculateMargin = () => {
    const price = parseFloat(stockPrice) || 0;
    const qty = parseInt(quantity) || 0;
    const totalValue = price * qty;
    const marginRequired = segment === 'equity' ? totalValue * 0.2 : totalValue * 0.15;
    const leverage = segment === 'equity' ? 5 : 6.67;
    return { totalValue: totalValue.toFixed(2), marginRequired: marginRequired.toFixed(2), leverage: leverage.toFixed(2) };
  };

  const results = calculateMargin();

  return (
    <section className="section-padding">
      <div className="container-zerodha max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="text-center mb-10">
          <h2 className="heading-lg mb-2">Margin Calculator</h2>
          <p className="text-muted-foreground">Calculate the margin required for your trades across different segments</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="flex gap-4">
              <Button variant={segment === 'equity' ? 'default' : 'outline'} onClick={() => setSegment('equity')} className="flex-1">Equity Intraday</Button>
              <Button variant={segment === 'fno' ? 'default' : 'outline'} onClick={() => setSegment('fno')} className="flex-1">F&O</Button>
            </div>
            <div className="space-y-4">
              <div><Label htmlFor="margin-price">Stock/Index Price (₹)</Label><Input id="margin-price" type="number" placeholder="Enter price" value={stockPrice} onChange={(e) => setStockPrice(e.target.value)} /></div>
              <div><Label htmlFor="margin-qty">Quantity / Lot Size</Label><Input id="margin-qty" type="number" placeholder="Enter quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} /></div>
            </div>
          </div>

          <div className="bg-muted/50 rounded-lg p-6">
            <h3 className="font-semibold text-foreground mb-4">Margin Details</h3>
            <div className="space-y-4">
              <div className="flex justify-between"><span className="text-muted-foreground">Total Contract Value</span><span className="text-foreground font-medium">₹{results.totalValue}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Margin Required</span><span className="text-primary font-semibold">₹{results.marginRequired}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Leverage</span><span className="text-foreground font-medium">{results.leverage}x</span></div>
            </div>
            <div className="mt-6 p-4 bg-primary/10 rounded-lg">
              <p className="text-sm text-muted-foreground"><strong>Note:</strong> Margin requirements may vary based on stock volatility and exchange regulations.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MarginCalcContent;
