import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Target } from 'lucide-react';
import { CalculatorShell } from './CalculatorShell';

interface GoalCalcContentProps {
  prefillTargetAmount?: number;
  prefillReturn?: number;
  prefillYears?: number;
  prefillMonthly?: number;
}

const formatCurrency = (num: number) => {
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(2)} L`;
  return `₹${Math.round(num).toLocaleString('en-IN')}`;
};

const GoalCalcContent = ({ prefillTargetAmount, prefillReturn, prefillYears }: GoalCalcContentProps) => {
  const [goalAmount, setGoalAmount] = useState('10000000');
  const [expectedReturn, setExpectedReturn] = useState('12');
  const [timePeriod, setTimePeriod] = useState('15');
  const [existingCorpus, setExistingCorpus] = useState('0');

  useEffect(() => {
    if (prefillTargetAmount) setGoalAmount(String(Math.round(prefillTargetAmount)));
    if (prefillReturn) setExpectedReturn(String(prefillReturn));
    if (prefillYears) setTimePeriod(String(prefillYears));
  }, [prefillTargetAmount, prefillReturn, prefillYears]);

  const handleAIParams = (params: Record<string, number>) => {
    if (params.targetAmount) setGoalAmount(String(Math.round(params.targetAmount)));
    if (params.expectedReturn) setExpectedReturn(String(params.expectedReturn));
    if (params.timePeriod) setTimePeriod(String(params.timePeriod));
    if (params.existingCorpus) setExistingCorpus(String(Math.round(params.existingCorpus)));
    if (params.monthlyInvestment) {
      // User asked "how much would X/month give me" — invert goal logic
    }
  };

  const calculate = () => {
    const target = parseFloat(goalAmount) || 0;
    const r = (parseFloat(expectedReturn) || 0) / 100 / 12;
    const n = (parseInt(timePeriod) || 0) * 12;
    const corpus = parseFloat(existingCorpus) || 0;
    const corpusGrowth = corpus * Math.pow(1 + r, n);
    const remaining = Math.max(0, target - corpusGrowth);
    const requiredSIP = r > 0 ? (remaining * r) / ((Math.pow(1 + r, n) - 1) * (1 + r)) : remaining / n;
    const requiredLumpsum = r > 0 ? remaining / Math.pow(1 + r, n) : remaining;
    return { requiredSIP: Math.max(0, requiredSIP), requiredLumpsum: Math.max(0, requiredLumpsum), corpusGrowth, remaining };
  };

  const results = calculate();
  const target = parseFloat(goalAmount) || 0;
  const r = parseFloat(expectedReturn) || 12;
  const n = parseInt(timePeriod) || 15;
  const corpus = parseFloat(existingCorpus) || 0;

  const commentary = target > 0
    ? `To accumulate ${formatCurrency(target)} in ${n} years at ${r}% annual return, you need a monthly SIP of ${formatCurrency(results.requiredSIP)}. Alternatively, a one-time investment of ${formatCurrency(results.requiredLumpsum)} today achieves the same goal.${corpus > 0 ? ` Your existing savings of ${formatCurrency(corpus)} will grow to ${formatCurrency(results.corpusGrowth)}, reducing the fresh investment needed.` : ''} Starting early is critical — delaying by 5 years would roughly double the required monthly SIP.`
    : 'Set your target goal amount to see what you need to invest.';

  return (
    <CalculatorShell
      title="Goal-Based Investment Planner"
      description="Find out exactly how much to invest to reach your financial goal"
      icon={<Target className="w-4 h-4" />}
      calcType="goal"
      aiContext="Goal-based investment planner that works backwards from a target wealth goal to calculate the required monthly SIP or lumpsum investment needed. Accounts for existing corpus and compound growth."
      onAIParams={handleAIParams}
      formInputs={
        <div className="space-y-5">
          <div>
            <Label htmlFor="goal-amount">Target Goal Amount (₹)</Label>
            <Input id="goal-amount" type="number" value={goalAmount} onChange={(e) => setGoalAmount(e.target.value)} className="mt-1.5" />
            <input type="range" min="100000" max="100000000" step="100000" value={goalAmount} onChange={(e) => setGoalAmount(e.target.value)} className="w-full mt-2" />
            <div className="flex justify-between text-xs text-muted-foreground mt-1"><span>₹1L</span><span className="font-medium text-foreground">{formatCurrency(parseFloat(goalAmount) || 0)}</span><span>₹10 Cr</span></div>
          </div>
          <div>
            <Label htmlFor="goal-return">Expected Annual Return (%)</Label>
            <Input id="goal-return" type="number" value={expectedReturn} onChange={(e) => setExpectedReturn(e.target.value)} className="mt-1.5" />
            <input type="range" min="4" max="24" step="0.5" value={expectedReturn} onChange={(e) => setExpectedReturn(e.target.value)} className="w-full mt-2" />
            <div className="flex justify-between text-xs text-muted-foreground mt-1"><span>4%</span><span className="font-medium text-foreground">{expectedReturn}%</span><span>24%</span></div>
          </div>
          <div>
            <Label htmlFor="goal-period">Time Period (Years)</Label>
            <Input id="goal-period" type="number" value={timePeriod} onChange={(e) => setTimePeriod(e.target.value)} className="mt-1.5" />
            <input type="range" min="1" max="40" step="1" value={timePeriod} onChange={(e) => setTimePeriod(e.target.value)} className="w-full mt-2" />
            <div className="flex justify-between text-xs text-muted-foreground mt-1"><span>1 yr</span><span className="font-medium text-foreground">{timePeriod} yrs</span><span>40 yrs</span></div>
          </div>
          <div>
            <Label htmlFor="goal-corpus">Existing Savings (₹) <span className="text-muted-foreground font-normal">(optional)</span></Label>
            <Input id="goal-corpus" type="number" placeholder="0" value={existingCorpus} onChange={(e) => setExistingCorpus(e.target.value)} className="mt-1.5" />
          </div>
        </div>
      }
      result={{
        label: 'What You Need to Invest',
        primary: { label: 'Monthly SIP Required', value: formatCurrency(results.requiredSIP) },
        metrics: [
          { label: 'Your Goal', value: formatCurrency(target) },
          { label: 'Lumpsum Alternative', value: formatCurrency(results.requiredLumpsum) },
          { label: 'Time Horizon', value: `${n} years` },
          { label: 'Return Assumption', value: `${r}% p.a.` },
        ],
        commentary,
      }}
    />
  );
};

export default GoalCalcContent;
