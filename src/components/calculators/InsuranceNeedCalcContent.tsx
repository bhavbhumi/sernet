import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

interface InsuranceNeedCalcContentProps {
  prefillCoverAmount?: number;
}

const formatCurrency = (num: number) => {
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(2)} L`;
  return `₹${Math.round(num).toLocaleString('en-IN')}`;
};

const InsuranceNeedCalcContent = ({ prefillCoverAmount }: InsuranceNeedCalcContentProps) => {
  const [annualIncome, setAnnualIncome] = useState('1200000');
  const [age, setAge] = useState('30');
  const [retirementAge, setRetirementAge] = useState('60');
  const [existingLiabilities, setExistingLiabilities] = useState('0');
  const [existingCover, setExistingCover] = useState(prefillCoverAmount ? String(prefillCoverAmount) : '0');
  const [dependents, setDependents] = useState('3');

  const calculate = () => {
    const income = parseFloat(annualIncome) || 0;
    const ageNum = parseInt(age) || 30;
    const retAge = parseInt(retirementAge) || 60;
    const liabilities = parseFloat(existingLiabilities) || 0;
    const existCover = parseFloat(existingCover) || 0;
    const yearsToRetire = Math.max(0, retAge - ageNum);

    // Human Life Value method: 50% of income × working years (discounted)
    const hlvFactor = 0.5; // income replacement ratio
    const hlvCover = income * hlvFactor * yearsToRetire;

    // Add liabilities, subtract existing cover
    const recommendedCover = Math.max(0, hlvCover + liabilities - existCover);
    const minimumCover = income * 10; // 10x income rule
    const annualPremiumEstimate = recommendedCover * 0.006; // ~0.6% for term insurance

    return { hlvCover, recommendedCover, minimumCover, annualPremiumEstimate };
  };

  const results = calculate();

  return (
    <section className="section-padding">
      <div className="container-zerodha max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="text-center mb-10">
          <h2 className="heading-lg mb-2">Insurance Need Estimator</h2>
          <p className="text-muted-foreground">Find out how much life insurance cover your family truly needs using the Human Life Value method</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-5">
            <div>
              <Label htmlFor="ins-income">Annual Income (₹)</Label>
              <Input id="ins-income" type="number" value={annualIncome} onChange={(e) => setAnnualIncome(e.target.value)} />
              <input type="range" min="200000" max="10000000" step="100000" value={annualIncome} onChange={(e) => setAnnualIncome(e.target.value)} className="w-full mt-2" />
              <p className="text-xs text-muted-foreground mt-1">{formatCurrency(parseFloat(annualIncome) || 0)} per year</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="ins-age">Current Age</Label>
                <Input id="ins-age" type="number" min="18" max="65" value={age} onChange={(e) => setAge(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="ins-ret">Retirement Age</Label>
                <Input id="ins-ret" type="number" min="45" max="75" value={retirementAge} onChange={(e) => setRetirementAge(e.target.value)} />
              </div>
            </div>
            <div>
              <Label htmlFor="ins-dependents">Number of Dependents</Label>
              <Input id="ins-dependents" type="number" min="0" max="10" value={dependents} onChange={(e) => setDependents(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="ins-liab">Outstanding Loans / Liabilities (₹)</Label>
              <Input id="ins-liab" type="number" placeholder="0" value={existingLiabilities} onChange={(e) => setExistingLiabilities(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="ins-cover">Existing Insurance Cover (₹) <span className="text-muted-foreground font-normal">(optional)</span></Label>
              <Input id="ins-cover" type="number" placeholder="0" value={existingCover} onChange={(e) => setExistingCover(e.target.value)} />
            </div>
          </div>

          <div className="bg-muted/50 rounded-lg p-6 space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <ShieldCheck className="h-6 w-6 text-primary" />
              <h3 className="font-semibold text-foreground">Recommended Coverage</h3>
            </div>

            <div className="p-5 bg-primary/10 rounded-lg text-center">
              <p className="text-xs text-muted-foreground mb-1">Recommended Cover (HLV Method)</p>
              <p className="text-3xl font-bold text-primary">{formatCurrency(results.recommendedCover)}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-background rounded-lg border border-border text-center">
                <p className="text-xs text-muted-foreground mb-1">Minimum (10x Rule)</p>
                <p className="text-base font-semibold text-foreground">{formatCurrency(results.minimumCover)}</p>
              </div>
              <div className="p-3 bg-background rounded-lg border border-border text-center">
                <p className="text-xs text-muted-foreground mb-1">Est. Annual Premium</p>
                <p className="text-base font-semibold text-foreground">{formatCurrency(results.annualPremiumEstimate)}</p>
                <p className="text-[10px] text-muted-foreground">for term plan</p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-muted-foreground">
              <strong className="text-foreground">Methodology:</strong> Human Life Value (HLV) = 50% of annual income × working years remaining + outstanding liabilities − existing cover. Premium estimate assumes a standard term plan at ~0.6% of sum assured.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InsuranceNeedCalcContent;
