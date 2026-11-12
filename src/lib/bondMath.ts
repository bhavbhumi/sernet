/** Deterministic bond maths (no AI). Prices per 100 face value unless noted. */
export interface BondInput {
  face: number; // face value per bond
  couponPct: number; // annual coupon %
  years: number; // years to maturity
  freq: number; // payments per year (1, 2, 4, 12)
}

/** Price per bond for a given annual yield (%), using periodic compounding. */
export function bondPrice({ face, couponPct, years, freq }: BondInput, yieldPct: number): number {
  const n = Math.max(1, Math.round(years * freq));
  const c = (face * couponPct) / 100 / freq;
  const y = yieldPct / 100 / freq;
  if (Math.abs(y) < 1e-12) return c * n + face;
  const df = Math.pow(1 + y, -n);
  return c * ((1 - df) / y) + face * df;
}

/** Yield to maturity (% annual, nominal) solved by bisection. */
export function yieldToMaturity(input: BondInput, price: number): number {
  if (price <= 0) return NaN;
  let lo = -0.99 * input.freq * 100 + 0.01;
  let hi = 200;
  lo = Math.max(lo, -50);
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    if (bondPrice(input, mid) > price) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

export function currentYield(input: BondInput, price: number): number {
  return price > 0 ? ((input.face * input.couponPct) / 100 / price) * 100 : NaN;
}

/** Modified duration (years) at a given yield. */
export function modifiedDuration(input: BondInput, yieldPct: number): number {
  const n = Math.max(1, Math.round(input.years * input.freq));
  const c = (input.face * input.couponPct) / 100 / input.freq;
  const y = yieldPct / 100 / input.freq;
  let pv = 0;
  let weighted = 0;
  for (let k = 1; k <= n; k++) {
    const cf = c + (k === n ? input.face : 0);
    const d = cf / Math.pow(1 + y, k);
    pv += d;
    weighted += (k / input.freq) * d;
  }
  return weighted / pv / (1 + y);
}

export interface CashFlow { period: number; year: number; coupon: number; principal: number; total: number }

export function cashFlows(input: BondInput, units = 1): CashFlow[] {
  const n = Math.max(1, Math.round(input.years * input.freq));
  const c = (input.face * input.couponPct) / 100 / input.freq;
  return Array.from({ length: n }, (_, i) => {
    const k = i + 1;
    const principal = k === n ? input.face : 0;
    return { period: k, year: k / input.freq, coupon: c * units, principal: principal * units, total: (c + principal) * units };
  });
}

/** Price change (%) if yields move by deltaPct, by full repricing. */
export function priceChangePct(input: BondInput, ytmPct: number, deltaPct: number): number {
  const p0 = bondPrice(input, ytmPct);
  return ((bondPrice(input, ytmPct + deltaPct) - p0) / p0) * 100;
}

/** Simple post-tax yield: interest taxed at slab; capital gain on maturity taxed at slab too (listed bonds held <12m / unlisted). */
export function postTaxYield(preTaxPct: number, slabPct: number): number {
  return preTaxPct * (1 - slabPct / 100);
}
