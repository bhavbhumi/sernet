import { useMemo, useState } from 'react';
import { ArrowRight, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link } from '@/lib/router-compat';
import { calculateFunds, type FundsInput, type FundsPlan, type FundsStep } from '@/lib/fundsMath';
import { CalculatorShell } from './CalculatorShell';

const groups = ['Lumpsum', 'SIP · STP · SWP', 'Step-up SIP · STP · SWP', 'Step-down SIP · STP · SWP'];
const frequencies = [{ value: 12, label: 'Monthly' }, { value: 4, label: 'Quarterly' }, { value: 2, label: 'Half-yearly' }, { value: 1, label: 'Annual' }];
const money = (value: number) => `₹${Math.round(value).toLocaleString('en-IN')}`;
const assumptions = 'Illustrative projections, not guaranteed returns or personalised advice. Effective annual returns are converted to the selected payment frequency. Payments occur at the beginning of each period; annual changes start after each completed year. Tax and exit loads are excluded. STP source redemptions and SWP withdrawals may attract tax and exit loads.';

function Field({ id, label, value, setValue, min = '0', max, step = 'any' }: { id: string; label: string; value: string; setValue: (v: string) => void; min?: string; max?: string; step?: string }) {
  return <div><Label htmlFor={id}>{label}</Label><Input id={id} type="number" inputMode="decimal" min={min} max={max} step={step} value={value} onChange={e => setValue(e.target.value)} className="mt-1.5" /></div>;
}

export default function FundsCalcContent() {
  const [group, setGroup] = useState(0);
  const [recurringPlan, setRecurringPlan] = useState<FundsPlan>('SIP');
  const [initial, setInitial] = useState('100000');
  const [instalment, setInstalment] = useState('5000');
  const [annualReturn, setAnnualReturn] = useState('12');
  const [sourceReturn, setSourceReturn] = useState('6');
  const [years, setYears] = useState('10');
  const [frequency, setFrequency] = useState(12);
  const [change, setChange] = useState('10');
  const [changeType, setChangeType] = useState<'percent' | 'amount'>('percent');
  const plan: FundsPlan = group === 0 ? 'Lumpsum' : recurringPlan;
  const step: FundsStep = group === 2 ? 'Step-up' : group === 3 ? 'Step-down' : 'Regular';
  const title = `${step === 'Regular' ? '' : `${step} `}${plan} Calculator`;
  const input: FundsInput = { plan, step, initial: Number(initial), instalment: Number(instalment), annualReturn: Number(annualReturn), sourceReturn: Number(sourceReturn), years: Number(years), frequency, change: Number(change), changeType };
  const computed = useMemo(() => {
    try {
      const required = [years, annualReturn, ...(plan !== 'SIP' ? [initial] : []), ...(plan !== 'Lumpsum' ? [instalment] : []), ...(plan === 'STP' ? [sourceReturn] : []), ...(step !== 'Regular' ? [change] : [])];
      if (required.some(value => value.trim() === '')) throw new Error('Complete the required inputs to calculate.');
      return { result: calculateFunds(input), error: '' };
    } catch (error) { return { result: undefined, error: error instanceof Error ? error.message : 'Check your inputs.' }; }
  }, [plan, step, initial, instalment, annualReturn, sourceReturn, years, frequency, change, changeType]);
  const result = computed.result;
  const paymentLabel = plan === 'SIP' ? 'Contribution' : plan === 'STP' ? 'Transfer' : 'Withdrawal';
  const frequencyLabel = frequencies.find(item => item.value === frequency)?.label ?? 'Monthly';
  const inputSummary = `Duration: ${years} years. Assumed annual ${plan === 'STP' ? 'destination ' : ''}return: ${annualReturn}%. ${plan !== 'SIP' ? `Initial ${plan === 'STP' ? 'source balance' : 'investment'}: ${money(Number(initial))}. ` : ''}${plan !== 'Lumpsum' ? `${frequencyLabel} starting ${paymentLabel.toLowerCase()}: ${money(Number(instalment))}. ` : ''}${plan === 'STP' ? `Source-fund annual return: ${sourceReturn}%. ` : ''}${step !== 'Regular' ? `Annual ${step.toLowerCase()}: ${changeType === 'percent' ? `${change}%` : money(Number(change))}. ` : ''}`;
  const form = <>
    {plan !== 'SIP' && <Field id="funds-initial" label={plan === 'STP' ? 'Initial source-fund balance (₹)' : plan === 'SWP' ? 'Starting corpus (₹)' : 'Investment amount (₹)'} value={initial} setValue={setInitial} />}
    {plan !== 'Lumpsum' && <Field id="funds-payment" label={`Starting ${paymentLabel.toLowerCase()} (₹)`} value={instalment} setValue={setInstalment} />}
    {plan !== 'Lumpsum' && <div><Label htmlFor="funds-frequency">Payment frequency</Label><select id="funds-frequency" value={frequency} onChange={e => setFrequency(Number(e.target.value))} className="mt-1.5 h-10 w-full rounded-md border border-input bg-background px-3 text-sm">{frequencies.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}</select></div>}
    <Field id="funds-return" label={`Assumed annual ${plan === 'STP' ? 'destination-fund ' : ''}return (%)`} value={annualReturn} setValue={setAnnualReturn} min="-99" max="100" />
    {plan === 'STP' && <Field id="funds-source-return" label="Assumed annual source-fund return (%)" value={sourceReturn} setValue={setSourceReturn} min="-99" max="100" />}
    <Field id="funds-years" label="Duration (whole years)" value={years} setValue={setYears} min="1" max="50" step="1" />
    {step !== 'Regular' && <div className="space-y-3">
      <div><Label>Annual {step.toLowerCase()} method</Label><div className="flex gap-2 mt-1.5" role="group" aria-label="Annual change method">{(['percent', 'amount'] as const).map(method => <Button key={method} variant={changeType === method ? 'default' : 'outline'} aria-pressed={changeType === method} onClick={() => setChangeType(method)}>{method === 'percent' ? 'Percentage (%)' : 'Fixed amount (₹)'}</Button>)}</div></div>
      <Field id="funds-change" label={`Annual ${step.toLowerCase()} (${changeType === 'percent' ? '%' : '₹'})`} value={change} setValue={setChange} max={step === 'Step-down' && changeType === 'percent' ? '100' : undefined} />
    </div>}
  </>;

  const metrics = result ? [
    { label: 'Total invested', value: money(result.invested) },
    { label: 'Estimated gain / loss', value: money(result.gain), highlight: true },
    ...(plan === 'STP' ? [{ label: 'Total transferred', value: money(result.payments) }, { label: 'Source balance', value: money(result.source) }, { label: 'Destination value', value: money(result.destination) }] : []),
    ...(plan === 'SWP' ? [{ label: 'Total withdrawn', value: money(result.payments) }] : []),
    ...(result.exhaustionPeriod !== undefined ? [{ label: plan === 'STP' ? 'Source exhausted' : 'Corpus exhausted', value: `Period ${result.exhaustionPeriod} (year ${Math.floor((result.exhaustionPeriod - 1) / result.frequency) + 1})` }] : []),
    ...(result.shortfall > 0 ? [{ label: 'Unfunded payments', value: money(result.shortfall) }] : []),
  ] : [];
  const startingBalance = plan === 'SIP' ? 0 : Number(initial);
  const chartRows = result ? [{ year: 0, balance: startingBalance, source: plan === 'STP' ? startingBalance : 0, destination: plan === 'STP' ? 0 : startingBalance }, ...result.rows.filter(row => row.period % result.frequency === 0)] : [];
  const maxBalance = Math.max(1, ...chartRows.map(row => row.balance));
  const points = (key: 'balance' | 'source' | 'destination') => chartRows.map((row, index) => `${48 + index / Math.max(1, chartRows.length - 1) * 640},${190 - row[key] / maxBalance * 160}`).join(' ');

  return <>
    <div className="container-sernet pt-5 space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2" role="group" aria-label="Funds calculator group">
        {groups.map((label, index) => <Button key={label} variant={group === index ? 'default' : 'outline'} className="h-auto min-h-10 whitespace-normal px-3 py-2" aria-pressed={group === index} onClick={() => setGroup(index)}>{label}</Button>)}
      </div>
      {group !== 0 && <div className="flex gap-2" role="group" aria-label="Recurring plan">{(['SIP', 'STP', 'SWP'] as const).map(item => <Button key={item} variant={recurringPlan === item ? 'default' : 'outline'} aria-pressed={recurringPlan === item} onClick={() => setRecurringPlan(item)}>{item}</Button>)}</div>}
    </div>
    {result ? <CalculatorShell title={title} description={plan === 'STP' ? 'Transfer between funds with separate return assumptions' : plan === 'SWP' ? 'Project withdrawals and remaining corpus' : 'Project contributions and fund value'} icon={<TrendingUp className="w-4 h-4" />} calcType={`funds-${step.toLowerCase()}-${plan.toLowerCase()}`} methodology={`${inputSummary} ${assumptions}`} formInputs={form} result={{ label: 'Funds projection', primary: { label: plan === 'STP' ? 'Total portfolio value' : plan === 'SWP' ? 'Remaining corpus' : 'Projected value', value: money(result.balance) }, metrics, commentary: `${inputSummary}${plan === 'STP' ? 'Transfers move existing money between funds; they are not additional investment or profit. ' : plan === 'SWP' ? 'Withdrawals are shown separately from investment gains. ' : ''}${result.shortfall > 0 ? 'The available balance cannot fund every scheduled payment; the final funded payment is capped. ' : ''}` }} />
      : <div className="container-sernet py-6"><h2 className="text-lg font-semibold mb-5">{title}</h2><div className="grid lg:grid-cols-2 gap-6"><div className="space-y-5">{form}</div><p role="alert" className="text-destructive">{computed.error}</p></div></div>}
    {result && <div className="container-sernet pb-6 space-y-6">
      <section aria-labelledby="funds-chart-title" className="border-t border-border pt-5">
        <h3 id="funds-chart-title" className="font-medium">Balance over time</h3>
        <p className="text-xs text-muted-foreground mt-1">Year-end balances · maximum {money(maxBalance)}</p>
        <svg viewBox="0 0 720 230" className="w-full h-auto max-h-80 mt-3" role="img" aria-label={`Projected balance over ${years} years, ending at ${money(result.balance)}`}>
          <line x1="48" y1="190" x2="688" y2="190" className="stroke-border" />
          <line x1="48" y1="110" x2="688" y2="110" className="stroke-border" strokeDasharray="4 4" />
          <polyline points={points('balance')} fill="none" strokeWidth="3" className="stroke-primary" />
          {plan === 'STP' && <><polyline points={points('source')} fill="none" strokeWidth="2" strokeDasharray="6 4" className="stroke-muted-foreground" /><polyline points={points('destination')} fill="none" strokeWidth="2" className="stroke-success" /></>}
          <text x="48" y="218" className="fill-muted-foreground text-sm">Year 0</text><text x="688" y="218" textAnchor="end" className="fill-muted-foreground text-sm">Year {years}</text>
        </svg>
        <div className="flex flex-wrap gap-4 text-xs"><span className="text-primary">━ {plan === 'STP' ? 'Total portfolio' : 'Balance'}</span>{plan === 'STP' && <><span className="text-muted-foreground">┄ Source fund</span><span className="text-success">━ Destination fund</span></>}</div>
      </section>
      <details className="border-y border-border py-4"><summary className="cursor-pointer font-medium">Period-by-period cash flows</summary>
        <div className="overflow-x-auto mt-4" tabIndex={0} role="region" aria-label="Funds cash-flow table"><table className="w-full text-xs text-right whitespace-nowrap"><thead className="bg-muted"><tr>{['Period', 'Year', ...(plan !== 'Lumpsum' ? [`Scheduled ${paymentLabel.toLowerCase()}`, `Actual ${paymentLabel.toLowerCase()}`, 'Total payments'] : []), ...(plan === 'STP' ? ['Source balance', 'Destination value'] : []), 'Period gain / loss', 'Closing balance'].map(label => <th key={label} className="px-3 py-3 font-medium">{label}</th>)}</tr></thead><tbody>{result.rows.map(row => <tr key={row.period} className="border-b border-border"><td className="px-3 py-2">{row.period}</td><td className="px-3 py-2">{Math.ceil(row.year)}</td>{plan !== 'Lumpsum' && <><td className="px-3 py-2">{money(row.requested)}</td><td className="px-3 py-2">{money(row.payment)}</td><td className="px-3 py-2">{money(row.cumulativePayments)}</td></>}{plan === 'STP' && <><td className="px-3 py-2">{money(row.source)}</td><td className="px-3 py-2">{money(row.destination)}</td></>}<td className="px-3 py-2">{money(row.gain)}</td><td className="px-3 py-2">{money(row.balance)}</td></tr>)}</tbody></table></div>
      </details>
      <p className="text-xs text-muted-foreground leading-relaxed">{assumptions}</p>
      <div className="flex flex-wrap gap-3"><Button asChild variant="outline"><Link to="/tickfunds">Explore Tick Funds <ArrowRight className="w-4 h-4" /></Link></Button><Button asChild><Link to="/open-account?tab=invest">Open Account <ArrowRight className="w-4 h-4" /></Link></Button></div>
    </div>}
  </>;
}