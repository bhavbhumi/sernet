import { useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Landmark, ArrowRight } from 'lucide-react';
import { Link } from '@/lib/router-compat';
import { CalculatorShell } from './CalculatorShell';
import {
  bondPrice, yieldToMaturity, currentYield, modifiedDuration, cashFlows, priceChangePct, postTaxYield, type BondInput,
} from '@/lib/bondMath';

type Mode = 'Returns' | 'Cash Flows' | 'Compare' | 'Checklist';
const modes: Mode[] = ['Returns', 'Cash Flows', 'Compare', 'Checklist'];
const freqs = [
  { v: 1, l: 'Annual' }, { v: 2, l: 'Half-yearly' }, { v: 4, l: 'Quarterly' }, { v: 12, l: 'Monthly' },
];
const inr = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`;
const pct = (n: number) => (Number.isFinite(n) ? `${n.toFixed(2)}%` : '—');
const num = (s: string) => parseFloat(s) || 0;

const Field = ({ id, label, value, onChange, step = 'any' }: { id: string; label: string; value: string; onChange: (v: string) => void; step?: string }) => (
  <div>
    <Label htmlFor={id}>{label}</Label>
    <Input id={id} type="number" inputMode="decimal" step={step} value={value} onChange={(e) => onChange(e.target.value)} className="mt-1.5" />
  </div>
);

const FreqSelect = ({ id, value, onChange }: { id: string; value: number; onChange: (v: number) => void }) => (
  <div>
    <Label htmlFor={id}>Interest paid</Label>
    <select id={id} value={value} onChange={(e) => onChange(Number(e.target.value))}
      className="mt-1.5 flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
      {freqs.map((f) => <option key={f.v} value={f.v}>{f.l}</option>)}
    </select>
  </div>
);

const DISCLAIMER = 'Illustrative only. Actual returns depend on issuer payments, credit events, call options, market prices and applicable tax. Not a recommendation; read the offer document before investing.';

/* ---------------- Returns ---------------- */
function ReturnsTab() {
  const [face, setFace] = useState('1000');
  const [coupon, setCoupon] = useState('10');
  const [price, setPrice] = useState('980');
  const [years, setYears] = useState('3');
  const [freq, setFreq] = useState(1);
  const [callYears, setCallYears] = useState('');
  const [callPrice, setCallPrice] = useState('1000');
  const [slab, setSlab] = useState('30');
  const [shift, setShift] = useState(1);

  const b: BondInput = { face: num(face), couponPct: num(coupon), years: Math.max(num(years), 1 / freq), freq };
  const p = num(price);
  const ytm = yieldToMaturity(b, p);
  const cy = currentYield(b, p);
  const ytc = num(callYears) > 0
    ? yieldToMaturity({ ...b, years: num(callYears), face: num(callPrice) || b.face, couponPct: (b.couponPct * b.face) / (num(callPrice) || b.face) }, p)
    : NaN;
  const dur = modifiedDuration(b, ytm);
  const move = priceChangePct(b, ytm, shift);
  const postTax = postTaxYield(ytm, num(slab));
  const premium = p > b.face ? 'premium' : p < b.face ? 'discount' : 'par';

  const commentary = p > 0
    ? `Bought at ${inr(p)} (a ${premium} to face value ${inr(b.face)}), a ${b.couponPct}% coupon bond maturing in ${b.years} years yields about ${pct(ytm)} to maturity, versus a current yield of ${pct(cy)}. ${premium === 'premium' ? 'Because you pay above face value, your real return is below the coupon.' : premium === 'discount' ? 'Because you pay below face value, your real return is above the coupon.' : 'At par, the yield equals the coupon.'} At a ${slab}% tax slab, that is roughly ${pct(postTax)} after tax. If market rates move by ${shift > 0 ? '+' : ''}${shift}%, the price would change by about ${move.toFixed(2)}%. ${DISCLAIMER}`
    : 'Enter the purchase price to see the yield.';

  return (
    <CalculatorShell
      title="Coupon vs Yield to Maturity"
      description="See what a bond really earns at the price you pay"
      icon={<Landmark className="w-4 h-4" />}
      calcType="bond_returns"
      methodology="Bond yield calculator: solves Yield to Maturity from price, coupon, frequency and maturity; also shows current yield, yield to call, modified duration, rate-change sensitivity and a simple slab-based post-tax yield."
      formInputs={
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Field id="b-face" label="Face value (₹)" value={face} onChange={setFace} />
            <Field id="b-price" label="Price you pay (₹)" value={price} onChange={setPrice} />
            <Field id="b-coupon" label="Coupon (% p.a.)" value={coupon} onChange={setCoupon} />
            <Field id="b-years" label="Years to maturity" value={years} onChange={setYears} />
            <FreqSelect id="b-freq" value={freq} onChange={setFreq} />
            <Field id="b-slab" label="Your tax slab (%)" value={slab} onChange={setSlab} />
          </div>
          <details className="rounded-md border border-border p-3">
            <summary className="text-sm font-medium cursor-pointer">Callable bond? (optional)</summary>
            <div className="grid grid-cols-2 gap-3 mt-3">
              <Field id="b-cy" label="Years to call" value={callYears} onChange={setCallYears} />
              <Field id="b-cp" label="Call price (₹)" value={callPrice} onChange={setCallPrice} />
            </div>
          </details>
          <div className="rounded-md border border-border p-3">
            <Label htmlFor="b-shift">If interest rates move by {shift > 0 ? '+' : ''}{shift}%</Label>
            <input id="b-shift" type="range" min={-3} max={3} step={0.25} value={shift} onChange={(e) => setShift(Number(e.target.value))} className="w-full mt-2" />
            <div className="flex justify-between text-xs text-muted-foreground mt-1"><span>−3%</span><span>0</span><span>+3%</span></div>
            <p className="text-sm mt-2">
              Price moves by about <span className={`font-semibold ${move < 0 ? 'text-destructive' : 'text-primary'}`}>{move.toFixed(2)}%</span>
              {' '}to {inr(bondPrice(b, ytm + shift))}. Rates up, prices down.
            </p>
          </div>
        </div>
      }
      result={{
        label: 'Bond Yield Summary',
        primary: { label: 'Yield to Maturity', value: pct(ytm) },
        metrics: [
          { label: 'Coupon rate', value: pct(b.couponPct) },
          { label: 'Current yield', value: pct(cy) },
          { label: 'Post-tax yield (approx.)', value: pct(postTax), highlight: true },
          { label: 'Yield to call', value: num(callYears) > 0 ? pct(ytc) : 'Not callable' },
          { label: 'Modified duration', value: Number.isFinite(dur) ? `${dur.toFixed(2)} yrs` : '—' },
          { label: `Price if rates ${shift >= 0 ? '+' : ''}${shift}%`, value: `${move.toFixed(2)}%` },
        ],
        commentary,
      }}
    />
  );
}

/* ---------------- Cash flows ---------------- */
function CashFlowTab() {
  const [amount, setAmount] = useState('100000');
  const [face, setFace] = useState('1000');
  const [coupon, setCoupon] = useState('9.5');
  const [years, setYears] = useState('3');
  const [freq, setFreq] = useState(12);
  const [slab, setSlab] = useState('30');

  const b: BondInput = { face: num(face) || 1000, couponPct: num(coupon), years: Math.max(num(years), 1 / freq), freq };
  const units = Math.max(0, Math.floor(num(amount) / b.face));
  const flows = useMemo(() => cashFlows(b, units), [b.face, b.couponPct, b.years, b.freq, units]);
  const totalInterest = flows.reduce((s, f) => s + f.coupon, 0);
  const tax = (totalInterest * num(slab)) / 100;
  const per = flows[0]?.coupon ?? 0;
  const max = Math.max(...flows.map((f) => f.total), 1);
  const freqLabel = freqs.find((f) => f.v === freq)?.l.toLowerCase();

  return (
    <CalculatorShell
      title="Maturity Cash-Flow Timeline"
      description="Every interest payment and the final repayment, in order"
      icon={<Landmark className="w-4 h-4" />}
      calcType="bond_cashflows"
      methodology="Bond cash-flow schedule: units bought at face value, periodic coupon payments and principal repaid at maturity, with interest tax estimated at the investor's slab rate."
      formInputs={
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Field id="cf-amt" label="Amount to invest (₹)" value={amount} onChange={setAmount} />
            <Field id="cf-face" label="Face value per bond (₹)" value={face} onChange={setFace} />
            <Field id="cf-coupon" label="Coupon (% p.a.)" value={coupon} onChange={setCoupon} />
            <Field id="cf-years" label="Years to maturity" value={years} onChange={setYears} />
            <FreqSelect id="cf-freq" value={freq} onChange={setFreq} />
            <Field id="cf-slab" label="Your tax slab (%)" value={slab} onChange={setSlab} />
          </div>
          <div className="rounded-md border border-border p-3">
            <p className="text-sm font-medium mb-2">Timeline ({flows.length} payments)</p>
            <div className="flex items-end gap-[2px] h-28" aria-hidden>
              {flows.map((f) => (
                <div key={f.period} className={`flex-1 min-w-[2px] rounded-t-sm ${f.principal ? 'bg-primary' : 'bg-primary/40'}`}
                  style={{ height: `${Math.max(3, (f.total / max) * 100)}%` }} title={`Payment ${f.period}: ${inr(f.total)}`} />
              ))}
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-1"><span>Start</span><span>Maturity</span></div>
          </div>
          <div className="max-h-64 overflow-auto rounded-md border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted/60 sticky top-0"><tr><th className="text-left p-2">#</th><th className="text-left p-2">Year</th><th className="text-right p-2">Interest</th><th className="text-right p-2">Principal</th></tr></thead>
              <tbody>
                {flows.map((f) => (
                  <tr key={f.period} className="border-t border-border">
                    <td className="p-2">{f.period}</td><td className="p-2">{f.year.toFixed(2)}</td>
                    <td className="p-2 text-right">{inr(f.coupon)}</td><td className="p-2 text-right">{f.principal ? inr(f.principal) : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      }
      result={{
        label: 'Cash-Flow Summary',
        primary: { label: 'Total you receive', value: inr(totalInterest + units * b.face) },
        metrics: [
          { label: 'Bonds bought', value: `${units} × ${inr(b.face)}` },
          { label: `Each ${freqLabel} payment`, value: inr(per) },
          { label: 'Total interest', value: inr(totalInterest), highlight: true },
          { label: 'Principal at maturity', value: inr(units * b.face) },
          { label: `Tax on interest @ ${slab}%`, value: inr(tax) },
          { label: 'Interest after tax', value: inr(totalInterest - tax) },
        ],
        commentary: `Investing ${inr(units * b.face)} in ${units} bonds paying ${b.couponPct}% ${freqLabel} gives ${flows.length} interest payments of about ${inr(per)} each, then ${inr(units * b.face)} back at maturity. Interest is taxed at your slab rate and TDS may apply. ${DISCLAIMER}`,
      }}
    />
  );
}

/* ---------------- Compare ---------------- */
interface Opt { name: string; rate: string; years: string; freq: number; taxable: boolean }
function CompareTab() {
  const [slab, setSlab] = useState('30');
  const [opts, setOpts] = useState<Opt[]>([
    { name: 'Corporate bond (AA+)', rate: '9.25', years: '3', freq: 12, taxable: true },
    { name: 'Bank FD', rate: '7', years: '3', freq: 4, taxable: true },
    { name: 'Tax-free bond', rate: '5.5', years: '3', freq: 1, taxable: false },
  ]);
  const upd = (i: number, k: keyof Opt, v: string | number | boolean) =>
    setOpts((o) => o.map((x, j) => (j === i ? { ...x, [k]: v } : x)));
  const rows = opts.map((o) => {
    const r = num(o.rate);
    const post = o.taxable ? postTaxYield(r, num(slab)) : r;
    const eff = (Math.pow(1 + post / 100 / o.freq, o.freq) - 1) * 100;
    return { ...o, post, eff };
  });
  const best = rows.reduce((a, b) => (b.eff > a.eff ? b : a), rows[0]);

  return (
    <CalculatorShell
      title="Compare Bonds and FDs"
      description="Side by side, after tax, on the same footing"
      icon={<Landmark className="w-4 h-4" />}
      calcType="bond_compare"
      methodology="Compares up to three fixed-income options by applying the investor's tax slab to taxable interest and converting each to an effective annual post-tax yield using its payment frequency."
      formInputs={
        <div className="space-y-4">
          <Field id="cmp-slab" label="Your tax slab (%)" value={slab} onChange={setSlab} />
          {opts.map((o, i) => (
            <div key={i} className="rounded-md border border-border p-3 space-y-3">
              <Input aria-label={`Option ${i + 1} name`} value={o.name} onChange={(e) => upd(i, 'name', e.target.value)} className="font-medium" />
              <div className="grid grid-cols-2 gap-3">
                <Field id={`cmp-r${i}`} label="Yield / rate (% p.a.)" value={o.rate} onChange={(v) => upd(i, 'rate', v)} />
                <Field id={`cmp-y${i}`} label="Tenure (years)" value={o.years} onChange={(v) => upd(i, 'years', v)} />
                <FreqSelect id={`cmp-f${i}`} value={o.freq} onChange={(v) => upd(i, 'freq', v)} />
                <label className="flex items-center gap-2 text-sm mt-6">
                  <input type="checkbox" checked={o.taxable} onChange={(e) => upd(i, 'taxable', e.target.checked)} /> Interest taxable
                </label>
              </div>
            </div>
          ))}
        </div>
      }
      result={{
        label: 'Post-Tax Comparison',
        primary: { label: `Highest post-tax yield: ${best.name}`, value: pct(best.eff) },
        metrics: rows.map((r) => ({ label: `${r.name} (${r.years} yrs)`, value: `${pct(r.post)} → ${pct(r.eff)} eff.`, highlight: r === best })),
        commentary: `At a ${slab}% slab, ${best.name} gives the highest effective post-tax yield (${pct(best.eff)}). Yield is only one factor: compare credit rating, security, liquidity and lock-in before choosing. Bank deposits have DICGC cover up to ₹5 lakh; bonds do not. ${DISCLAIMER}`,
      }}
    />
  );
}

/* ---------------- Checklist ---------------- */
const pillars: { name: string; checks: string[] }[] = [
  { name: 'Credit rating', checks: ['Rated AA or above by a SEBI-registered agency', 'No recent downgrade or rating watch', 'Rating rationale read'] },
  { name: 'Issuer strength', checks: ['Understands the issuer’s business', 'Profitable with manageable debt', 'Clean repayment history'] },
  { name: 'Security & ranking', checks: ['Secured by identified assets', 'Senior, not subordinated/perpetual', 'Debenture trustee named'] },
  { name: 'Liquidity & exit', checks: ['Listed on NSE/BSE', 'Can hold till maturity if needed', 'Call/put options understood'] },
  { name: 'Tax & fit', checks: ['Post-tax yield beats safer alternatives', 'Payment frequency suits cash needs', 'Not over-concentrated in one issuer'] },
];
function ChecklistTab() {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const total = pillars.reduce((s, p) => s + p.checks.length, 0);
  const ticked = Object.values(done).filter(Boolean).length;
  const per = pillars.map((p) => ({ name: p.name, n: p.checks.filter((c) => done[`${p.name}|${c}`]).length, of: p.checks.length }));
  const open = pillars.flatMap((p) => p.checks.filter((c) => !done[`${p.name}|${c}`]).map((c) => `${p.name}: ${c}`));

  return (
    <CalculatorShell
      title="Five-Pillar Due-Diligence Checklist"
      description="Questions to answer before buying any bond or NCD"
      icon={<Landmark className="w-4 h-4" />}
      calcType="bond_checklist"
      methodology="Five-pillar bond due-diligence checklist covering credit rating, issuer strength, security and ranking, liquidity and exit, and tax and portfolio fit. It records what has been checked; it is not a rating or recommendation."
      formInputs={
        <div className="space-y-3">
          {pillars.map((p) => (
            <fieldset key={p.name} className="rounded-md border border-border p-3">
              <legend className="px-1 text-sm font-semibold">{p.name}</legend>
              {p.checks.map((c) => {
                const k = `${p.name}|${c}`;
                return (
                  <label key={k} className="flex items-start gap-2 text-sm py-1">
                    <input type="checkbox" className="mt-1" checked={!!done[k]} onChange={(e) => setDone((d) => ({ ...d, [k]: e.target.checked }))} />
                    {c}
                  </label>
                );
              })}
            </fieldset>
          ))}
        </div>
      }
      result={{
        label: 'Checklist Summary',
        primary: { label: 'Checks completed', value: `${ticked} / ${total}` },
        metrics: per.map((p) => ({ label: p.name, value: `${p.n} / ${p.of}`, highlight: p.n === p.of })),
        commentary: open.length
          ? `Still to check before investing: ${open.slice(0, 6).join('; ')}${open.length > 6 ? `; and ${open.length - 6} more` : ''}. This checklist records your own review and is not a rating, score or recommendation.`
          : 'All five pillars reviewed. This records your own review and is not a rating or recommendation; read the offer document before investing.',
      }}
    />
  );
}

const BondCalcContent = () => {
  const [mode, setMode] = useState<Mode>('Returns');
  return (
    <div>
      <div className="container-sernet pt-6">
        <div role="tablist" aria-label="Bond calculator" className="flex gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {modes.map((m) => (
            <button key={m} role="tab" aria-selected={mode === m} onClick={() => setMode(m)}
              className={`px-3 py-1.5 text-sm whitespace-nowrap border-b-2 transition-colors ${mode === m ? 'border-primary text-foreground font-medium' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
              {m}
            </button>
          ))}
        </div>
      </div>
      {mode === 'Returns' && <ReturnsTab />}
      {mode === 'Cash Flows' && <CashFlowTab />}
      {mode === 'Compare' && <CompareTab />}
      {mode === 'Checklist' && <ChecklistTab />}
      <div className="container-sernet pb-8">
        <div className="rounded-lg border border-border bg-muted/30 p-4 flex flex-col sm:flex-row sm:items-center gap-3">
          <p className="text-sm text-muted-foreground flex-1">
            SERNET distributes listed bonds through Altifi (Northern Arc) and receives disclosed provider-paid commissions.
          </p>
          <div className="flex flex-wrap gap-2">
            <Link to="/open-account?tab=invest" className="btn-primary text-sm">Explore Bonds with Altifi <ArrowRight className="w-4 h-4 ml-1" /></Link>
            <Link to="/contact" className="btn-secondary text-sm">Talk to SERNET</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BondCalcContent;
