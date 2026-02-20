import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

interface LumpsumCalcContentProps {
  prefillAmount?: number;
  prefillReturn?: number;
  prefillYears?: number;
}

const LumpsumCalcContent = ({ prefillAmount, prefillReturn, prefillYears }: LumpsumCalcContentProps) => {
  const [investment, setInvestment] = useState('100000');
  const [expectedReturn, setExpectedReturn] = useState('12');
  const [timePeriod, setTimePeriod] = useState('10');

  useEffect(() => {
    if (prefillAmount) setInvestment(String(Math.round(prefillAmount)));
    if (prefillReturn) setExpectedReturn(String(prefillReturn));
    if (prefillYears) setTimePeriod(String(prefillYears));
  }, [prefillAmount, prefillReturn, prefillYears]);

  const calculateLumpsum = () => {
    const P = parseFloat(investment) || 0;
    const r = (parseFloat(expectedReturn) || 0) / 100;
    const n = parseInt(timePeriod) || 0;
    const futureValue = P * Math.pow(1 + r, n);
    const wealthGained = futureValue - P;
    return { futureValue: futureValue.toFixed(0), investment: P.toFixed(0), wealthGained: wealthGained.toFixed(0) };
  };

  const results = calculateLumpsum();

  const formatCurrency = (value: string) => {
    const num = parseInt(value);
    if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
    if (num >= 100000) return `₹${(num / 100000).toFixed(2)} L`;
    return `₹${num.toLocaleString('en-IN')}`;
  };

  return (
    <section className="section-padding">
      <div className="container-zerodha max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="text-center mb-10">
          <h2 className="heading-lg mb-2">Lumpsum Calculator</h2>
          <p className="text-muted-foreground">Calculate returns on your one-time investment over a period</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div><Label htmlFor="lump-invest">Total Investment (₹)</Label><Input id="lump-invest" type="number" value={investment} onChange={(e) => setInvestment(e.target.value)} /><input type="range" min="10000" max="10000000" step="10000" value={investment} onChange={(e) => setInvestment(e.target.value)} className="w-full mt-2" /></div>
            <div><Label htmlFor="lump-return">Expected Annual Return (%)</Label><Input id="lump-return" type="number" value={expectedReturn} onChange={(e) => setExpectedReturn(e.target.value)} /><input type="range" min="1" max="30" step="0.5" value={expectedReturn} onChange={(e) => setExpectedReturn(e.target.value)} className="w-full mt-2" /></div>
            <div><Label htmlFor="lump-period">Time Period (Years)</Label><Input id="lump-period" type="number" value={timePeriod} onChange={(e) => setTimePeriod(e.target.value)} /><input type="range" min="1" max="40" step="1" value={timePeriod} onChange={(e) => setTimePeriod(e.target.value)} className="w-full mt-2" /></div>
          </div>

          <div className="bg-muted/50 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-6"><TrendingUp className="h-6 w-6 text-primary" /><h3 className="font-semibold text-foreground">Investment Summary</h3></div>
            <div className="space-y-6">
              <div className="text-center p-6 bg-primary/10 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">Expected Amount</p>
                <p className="text-3xl font-bold text-primary">{formatCurrency(results.futureValue)}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-background rounded-lg"><p className="text-xs text-muted-foreground mb-1">Invested Amount</p><p className="text-lg font-semibold text-foreground">{formatCurrency(results.investment)}</p></div>
                <div className="text-center p-4 bg-background rounded-lg"><p className="text-xs text-muted-foreground mb-1">Est. Returns</p><p className="text-lg font-semibold text-green-600">{formatCurrency(results.wealthGained)}</p></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LumpsumCalcContent;
