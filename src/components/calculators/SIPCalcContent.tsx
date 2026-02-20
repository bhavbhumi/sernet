import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TrendingUp } from 'lucide-react';
import { CalculatorShell } from './CalculatorShell';

interface SIPCalcContentProps {
  prefillMonthly?: number;
  prefillReturn?: number;
  prefillYears?: number;
}

const formatCurrency = (num: number) => {
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(2)} L`;
  return `₹${Math.round(num).toLocaleString('en-IN')}`;
};

const SIPCalcContent = ({ prefillMonthly, prefillReturn, prefillYears }: SIPCalcContentProps) => {
  const [monthlyInvestment, setMonthlyInvestment] = useState('10000');
  const [expectedReturn, setExpectedReturn] = useState('12');
  const [timePeriod, setTimePeriod] = useState('10');

  useEffect(() => {
    if (prefillMonthly) setMonthlyInvestment(String(Math.round(prefillMonthly)));
    if (prefillReturn) setExpectedReturn(String(prefillReturn));
    if (prefillYears) setTimePeriod(String(prefillYears));
  }, [prefillMonthly, prefillReturn, prefillYears]);

  const handleAIParams = (params: Record<string, number>) => {
    if (params.monthlyInvestment) setMonthlyInvestment(String(Math.round(params.monthlyInvestment)));
    if (params.expectedReturn) setExpectedReturn(String(params.expectedReturn));
    if (params.timePeriod) setTimePeriod(String(params.timePeriod));
  };

  const calculate = () => {
    const P = parseFloat(monthlyInvestment) || 0;
    const r = (parseFloat(expectedReturn) || 0) / 100 / 12;
    const n = (parseInt(timePeriod) || 0) * 12;
    const futureValue = r > 0 ? P * ((Math.pow(1 + r, n) - 1) / r) * (1 + r) : P * n;
    const totalInvestment = P * n;
    const wealthGained = futureValue - totalInvestment;
    return { futureValue, totalInvestment, wealthGained };
  };

  const results = calculate();
  const P = parseFloat(monthlyInvestment) || 0;
  const r = parseFloat(expectedReturn) || 12;
  const n = parseInt(timePeriod) || 10;

  const commentary = P > 0
    ? `Investing ₹${P.toLocaleString('en-IN')} every month at an assumed ${r}% annual return over ${n} years results in a projected corpus of ${formatCurrency(results.futureValue)}. Your total contribution is ${formatCurrency(results.totalInvestment)}, while market returns add another ${formatCurrency(results.wealthGained)} — that's ${((results.wealthGained / results.totalInvestment) * 100).toFixed(0)}% gain on capital. The power of compounding grows significantly in the later years — the last 5 years of a 15-year SIP typically generate more than the first 10.`
    : 'Enter your monthly investment amount to see your projected wealth.';

  return (
    <CalculatorShell
      title="SIP Calculator"
      description="Plan your systematic investments and see how your wealth grows over time"
      icon={<TrendingUp className="w-4 h-4" />}
      calcType="sip"
      aiContext="SIP (Systematic Investment Plan) calculator that computes the future value of recurring monthly investments using compound interest. Helps users plan wealth creation through regular investing."
      onAIParams={handleAIParams}
      formInputs={
        <div className="space-y-5">
          <div>
            <Label htmlFor="sip-monthly">Monthly Investment (₹)</Label>
            <Input id="sip-monthly" type="number" value={monthlyInvestment} onChange={(e) => setMonthlyInvestment(e.target.value)} className="mt-1.5" />
            <input type="range" min="500" max="100000" step="500" value={monthlyInvestment} onChange={(e) => setMonthlyInvestment(e.target.value)} className="w-full mt-2" />
            <div className="flex justify-between text-xs text-muted-foreground mt-1"><span>₹500</span><span className="font-medium text-foreground">{formatCurrency(parseFloat(monthlyInvestment) || 0)}</span><span>₹1L</span></div>
          </div>
          <div>
            <Label htmlFor="sip-return">Expected Annual Return (%)</Label>
            <Input id="sip-return" type="number" value={expectedReturn} onChange={(e) => setExpectedReturn(e.target.value)} className="mt-1.5" />
            <input type="range" min="1" max="30" step="0.5" value={expectedReturn} onChange={(e) => setExpectedReturn(e.target.value)} className="w-full mt-2" />
            <div className="flex justify-between text-xs text-muted-foreground mt-1"><span>1%</span><span className="font-medium text-foreground">{expectedReturn}%</span><span>30%</span></div>
          </div>
          <div>
            <Label htmlFor="sip-period">Time Period (Years)</Label>
            <Input id="sip-period" type="number" value={timePeriod} onChange={(e) => setTimePeriod(e.target.value)} className="mt-1.5" />
            <input type="range" min="1" max="40" step="1" value={timePeriod} onChange={(e) => setTimePeriod(e.target.value)} className="w-full mt-2" />
            <div className="flex justify-between text-xs text-muted-foreground mt-1"><span>1 yr</span><span className="font-medium text-foreground">{timePeriod} yrs</span><span>40 yrs</span></div>
          </div>
        </div>
      }
      result={{
        label: 'Investment Summary',
        primary: { label: 'Projected Corpus', value: formatCurrency(results.futureValue) },
        metrics: [
          { label: 'Total Invested', value: formatCurrency(results.totalInvestment) },
          { label: 'Est. Returns', value: formatCurrency(results.wealthGained), highlight: true },
          { label: 'Monthly SIP', value: `₹${(parseFloat(monthlyInvestment) || 0).toLocaleString('en-IN')}` },
          { label: 'Return Rate', value: `${expectedReturn}% p.a.` },
        ],
        commentary,
      }}
    />
  );
};

export default SIPCalcContent;
