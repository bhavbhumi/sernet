import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Target } from 'lucide-react';
import { motion } from 'framer-motion';

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

const GoalCalcContent = ({ prefillTargetAmount, prefillReturn, prefillYears, prefillMonthly }: GoalCalcContentProps) => {
  const [goalAmount, setGoalAmount] = useState('10000000');
  const [expectedReturn, setExpectedReturn] = useState('12');
  const [timePeriod, setTimePeriod] = useState('15');
  const [existingCorpus, setExistingCorpus] = useState('0');

  useEffect(() => {
    if (prefillTargetAmount) setGoalAmount(String(Math.round(prefillTargetAmount)));
    if (prefillReturn) setExpectedReturn(String(prefillReturn));
    if (prefillYears) setTimePeriod(String(prefillYears));
  }, [prefillTargetAmount, prefillReturn, prefillYears, prefillMonthly]);

  const calculate = () => {
    const target = parseFloat(goalAmount) || 0;
    const r = (parseFloat(expectedReturn) || 0) / 100 / 12;
    const n = (parseInt(timePeriod) || 0) * 12;
    const corpus = parseFloat(existingCorpus) || 0;
    const corpusGrowth = corpus * Math.pow(1 + r, n);
    const remaining = Math.max(0, target - corpusGrowth);
    const requiredSIP = r > 0 ? (remaining * r) / ((Math.pow(1 + r, n) - 1) * (1 + r)) : remaining / n;
    const requiredLumpsum = r > 0 ? remaining / Math.pow(1 + r, n) : remaining;
    return {
      requiredSIP: Math.max(0, requiredSIP),
      requiredLumpsum: Math.max(0, requiredLumpsum),
      corpusGrowth,
      remaining,
    };
  };

  const results = calculate();

  return (
    <section className="section-padding">
      <div className="container-zerodha max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="text-center mb-10">
          <h2 className="heading-lg mb-2">Goal-Based Investment Calculator</h2>
          <p className="text-muted-foreground">Find out how much you need to invest monthly (SIP) or as a lumpsum to reach your financial goal</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <Label htmlFor="goal-amount">Target Goal Amount (₹)</Label>
              <Input id="goal-amount" type="number" value={goalAmount} onChange={(e) => setGoalAmount(e.target.value)} />
              <input type="range" min="100000" max="100000000" step="100000" value={goalAmount} onChange={(e) => setGoalAmount(e.target.value)} className="w-full mt-2" />
              <p className="text-xs text-muted-foreground mt-1">{formatCurrency(parseFloat(goalAmount) || 0)}</p>
            </div>
            <div>
              <Label htmlFor="goal-return">Expected Annual Return (%)</Label>
              <Input id="goal-return" type="number" value={expectedReturn} onChange={(e) => setExpectedReturn(e.target.value)} />
              <input type="range" min="4" max="24" step="0.5" value={expectedReturn} onChange={(e) => setExpectedReturn(e.target.value)} className="w-full mt-2" />
            </div>
            <div>
              <Label htmlFor="goal-period">Time Period (Years)</Label>
              <Input id="goal-period" type="number" value={timePeriod} onChange={(e) => setTimePeriod(e.target.value)} />
              <input type="range" min="1" max="40" step="1" value={timePeriod} onChange={(e) => setTimePeriod(e.target.value)} className="w-full mt-2" />
            </div>
            <div>
              <Label htmlFor="goal-corpus">Existing Savings / Corpus (₹) <span className="text-muted-foreground font-normal">(optional)</span></Label>
              <Input id="goal-corpus" type="number" placeholder="0" value={existingCorpus} onChange={(e) => setExistingCorpus(e.target.value)} />
            </div>
          </div>

          <div className="bg-muted/50 rounded-lg p-6 space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <Target className="h-6 w-6 text-primary" />
              <h3 className="font-semibold text-foreground">What You Need</h3>
            </div>

            <div className="p-5 bg-primary/10 rounded-lg text-center">
              <p className="text-xs text-muted-foreground mb-1">Monthly SIP Required</p>
              <p className="text-3xl font-bold text-primary">{formatCurrency(results.requiredSIP)}</p>
              <p className="text-xs text-muted-foreground mt-1">per month for {timePeriod} years</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground">OR invest as</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            <div className="p-4 bg-background rounded-lg text-center border border-border">
              <p className="text-xs text-muted-foreground mb-1">One-time Lumpsum Required</p>
              <p className="text-xl font-semibold text-foreground">{formatCurrency(results.requiredLumpsum)}</p>
              <p className="text-xs text-muted-foreground mt-1">today to reach your goal</p>
            </div>

            {parseFloat(existingCorpus) > 0 && (
              <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-sm">
                <p className="text-muted-foreground">Your existing corpus of <span className="text-foreground font-medium">{formatCurrency(parseFloat(existingCorpus))}</span> will grow to <span className="text-green-600 font-medium">{formatCurrency(results.corpusGrowth)}</span>, covering part of your goal.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default GoalCalcContent;
