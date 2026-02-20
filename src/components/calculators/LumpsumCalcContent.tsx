import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TrendingUp } from 'lucide-react';
import { CalculatorShell } from './CalculatorShell';

interface LumpsumCalcContentProps {
  prefillAmount?: number;
  prefillReturn?: number;
  prefillYears?: number;
}

const formatCurrency = (num: number) => {
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(2)} L`;
  return `₹${Math.round(num).toLocaleString('en-IN')}`;
};

const LumpsumCalcContent = ({ prefillAmount, prefillReturn, prefillYears }: LumpsumCalcContentProps) => {
  const [investment, setInvestment] = useState('100000');
  const [expectedReturn, setExpectedReturn] = useState('12');
  const [timePeriod, setTimePeriod] = useState('10');

  useEffect(() => {
    if (prefillAmount) setInvestment(String(Math.round(prefillAmount)));
    if (prefillReturn) setExpectedReturn(String(prefillReturn));
    if (prefillYears) setTimePeriod(String(prefillYears));
  }, [prefillAmount, prefillReturn, prefillYears]);

  const handleAIParams = (params: Record<string, number>) => {
    if (params.lumpsum) setInvestment(String(Math.round(params.lumpsum)));
    if (params.expectedReturn) setExpectedReturn(String(params.expectedReturn));
    if (params.timePeriod) setTimePeriod(String(params.timePeriod));
  };

  const calculate = () => {
    const P = parseFloat(investment) || 0;
    const r = (parseFloat(expectedReturn) || 0) / 100;
    const n = parseInt(timePeriod) || 0;
    const futureValue = P * Math.pow(1 + r, n);
    const wealthGained = futureValue - P;
    return { futureValue, wealthGained };
  };

  const results = calculate();
  const P = parseFloat(investment) || 0;
  const r = parseFloat(expectedReturn) || 12;
  const n = parseInt(timePeriod) || 10;
  const gain = ((results.wealthGained / (P || 1)) * 100).toFixed(0);

  const commentary = P > 0
    ? `A one-time investment of ${formatCurrency(P)} at ${r}% annual return over ${n} years grows to ${formatCurrency(results.futureValue)}. That's a ${gain}% absolute gain on your capital. Lumpsum investing works best when markets are down or fairly valued — investing at market peaks can reduce actual returns. Consider dividing a large lumpsum into 6–12 tranches via STP (Systematic Transfer Plan) to reduce timing risk.`
    : 'Enter your investment amount to see the projected growth.';

  return (
    <CalculatorShell
      title="Lumpsum Calculator"
      description="Calculate returns on your one-time investment over a period"
      icon={<TrendingUp className="w-4 h-4" />}
      calcType="lumpsum"
      aiContext="Lumpsum investment calculator that computes future value of a one-time investment using compound annual growth rate. Useful for planning FD alternatives, equity investments, or large windfalls."
      onAIParams={handleAIParams}
      formInputs={
        <div className="space-y-5">
          <div>
            <Label htmlFor="lump-invest">Total Investment (₹)</Label>
            <Input id="lump-invest" type="number" value={investment} onChange={(e) => setInvestment(e.target.value)} className="mt-1.5" />
            <input type="range" min="10000" max="10000000" step="10000" value={investment} onChange={(e) => setInvestment(e.target.value)} className="w-full mt-2" />
            <div className="flex justify-between text-xs text-muted-foreground mt-1"><span>₹10K</span><span className="font-medium text-foreground">{formatCurrency(parseFloat(investment) || 0)}</span><span>₹1 Cr</span></div>
          </div>
          <div>
            <Label htmlFor="lump-return">Expected Annual Return (%)</Label>
            <Input id="lump-return" type="number" value={expectedReturn} onChange={(e) => setExpectedReturn(e.target.value)} className="mt-1.5" />
            <input type="range" min="1" max="30" step="0.5" value={expectedReturn} onChange={(e) => setExpectedReturn(e.target.value)} className="w-full mt-2" />
            <div className="flex justify-between text-xs text-muted-foreground mt-1"><span>1%</span><span className="font-medium text-foreground">{expectedReturn}%</span><span>30%</span></div>
          </div>
          <div>
            <Label htmlFor="lump-period">Time Period (Years)</Label>
            <Input id="lump-period" type="number" value={timePeriod} onChange={(e) => setTimePeriod(e.target.value)} className="mt-1.5" />
            <input type="range" min="1" max="40" step="1" value={timePeriod} onChange={(e) => setTimePeriod(e.target.value)} className="w-full mt-2" />
            <div className="flex justify-between text-xs text-muted-foreground mt-1"><span>1 yr</span><span className="font-medium text-foreground">{timePeriod} yrs</span><span>40 yrs</span></div>
          </div>
        </div>
      }
      result={{
        label: 'Investment Summary',
        primary: { label: 'Projected Value', value: formatCurrency(results.futureValue) },
        metrics: [
          { label: 'Amount Invested', value: formatCurrency(P) },
          { label: 'Est. Returns', value: formatCurrency(results.wealthGained), highlight: true },
          { label: 'Absolute Gain', value: `${gain}%` },
          { label: 'Return Rate', value: `${expectedReturn}% p.a.` },
        ],
        commentary,
      }}
    />
  );
};

export default LumpsumCalcContent;
