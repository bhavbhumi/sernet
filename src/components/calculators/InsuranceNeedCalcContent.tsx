import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShieldCheck } from 'lucide-react';
import { CalculatorShell } from './CalculatorShell';

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

  useEffect(() => {
    if (prefillCoverAmount) setExistingCover(String(prefillCoverAmount));
  }, [prefillCoverAmount]);

  const handleAIParams = (params: Record<string, number>) => {
    if (params.annualIncome) setAnnualIncome(String(Math.round(params.annualIncome)));
    if (params.age) setAge(String(params.age));
    if (params.retirementAge) setRetirementAge(String(params.retirementAge));
    if (params.liabilities) setExistingLiabilities(String(Math.round(params.liabilities)));
    if (params.existingCover) setExistingCover(String(Math.round(params.existingCover)));
  };

  const calculate = () => {
    const income = parseFloat(annualIncome) || 0;
    const ageNum = parseInt(age) || 30;
    const retAge = parseInt(retirementAge) || 60;
    const liabilities = parseFloat(existingLiabilities) || 0;
    const existCover = parseFloat(existingCover) || 0;
    const yearsToRetire = Math.max(0, retAge - ageNum);
    const hlvCover = income * 0.5 * yearsToRetire;
    const recommendedCover = Math.max(0, hlvCover + liabilities - existCover);
    const minimumCover = income * 10;
    const annualPremiumEstimate = recommendedCover * 0.006;
    return { hlvCover, recommendedCover, minimumCover, annualPremiumEstimate, yearsToRetire };
  };

  const results = calculate();
  const income = parseFloat(annualIncome) || 0;
  const dep = parseInt(dependents) || 0;
  const ageNum = parseInt(age) || 30;
  const retAge = parseInt(retirementAge) || 60;
  const liab = parseFloat(existingLiabilities) || 0;

  const commentary = income > 0
    ? `Based on the Human Life Value (HLV) method, with an income of ${formatCurrency(income)} per year and ${results.yearsToRetire} working years remaining, your family needs ${formatCurrency(results.recommendedCover)} in life cover.${dep > 0 ? ` With ${dep} dependant(s), an inadequate cover could severely impact their financial security.` : ''} The minimum 10x income rule recommends ${formatCurrency(results.minimumCover)}.${liab > 0 ? ` Your outstanding liabilities of ${formatCurrency(liab)} have been added to the cover requirement.` : ''} A term plan for this cover would cost approximately ${formatCurrency(results.annualPremiumEstimate)} per year — very affordable insurance for critical protection.`
    : 'Enter your annual income to estimate the insurance cover you need.';

  return (
    <CalculatorShell
      title="Insurance Need Estimator"
      description="Calculate the exact life cover your family needs using the HLV method"
      icon={<ShieldCheck className="w-4 h-4" />}
      calcType="insurance"
      aiContext="Insurance need estimator using the Human Life Value (HLV) method. Calculates recommended life insurance cover based on income, years to retirement, liabilities, and existing cover. Helps users determine adequate term insurance coverage."
      onAIParams={handleAIParams}
      formInputs={
        <div className="space-y-5">
          <div>
            <Label htmlFor="ins-income">Annual Income (₹)</Label>
            <Input id="ins-income" type="number" value={annualIncome} onChange={(e) => setAnnualIncome(e.target.value)} className="mt-1.5" />
            <input type="range" min="200000" max="10000000" step="100000" value={annualIncome} onChange={(e) => setAnnualIncome(e.target.value)} className="w-full mt-2" />
            <div className="flex justify-between text-xs text-muted-foreground mt-1"><span>₹2L</span><span className="font-medium text-foreground">{formatCurrency(parseFloat(annualIncome) || 0)}</span><span>₹1 Cr</span></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="ins-age">Current Age</Label>
              <Input id="ins-age" type="number" min="18" max="65" value={age} onChange={(e) => setAge(e.target.value)} className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="ins-ret">Retirement Age</Label>
              <Input id="ins-ret" type="number" min="45" max="75" value={retirementAge} onChange={(e) => setRetirementAge(e.target.value)} className="mt-1.5" />
            </div>
          </div>
          <div>
            <Label htmlFor="ins-dependents">Number of Dependents</Label>
            <Input id="ins-dependents" type="number" min="0" max="10" value={dependents} onChange={(e) => setDependents(e.target.value)} className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="ins-liab">Outstanding Loans / Liabilities (₹)</Label>
            <Input id="ins-liab" type="number" placeholder="0" value={existingLiabilities} onChange={(e) => setExistingLiabilities(e.target.value)} className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="ins-cover">Existing Cover (₹) <span className="text-muted-foreground font-normal">(if any)</span></Label>
            <Input id="ins-cover" type="number" placeholder="0" value={existingCover} onChange={(e) => setExistingCover(e.target.value)} className="mt-1.5" />
          </div>
        </div>
      }
      result={{
        label: 'Recommended Coverage',
        primary: { label: 'Cover Required (HLV Method)', value: formatCurrency(results.recommendedCover) },
        metrics: [
          { label: 'Minimum (10x Rule)', value: formatCurrency(results.minimumCover) },
          { label: 'Est. Annual Premium', value: formatCurrency(results.annualPremiumEstimate) },
          { label: 'Working Years Left', value: `${results.yearsToRetire} yrs` },
          { label: 'Income p.a.', value: formatCurrency(income) },
        ],
        commentary,
      }}
    />
  );
};

export default InsuranceNeedCalcContent;
