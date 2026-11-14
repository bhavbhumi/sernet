export type FundsPlan = 'Lumpsum' | 'SIP' | 'STP' | 'SWP';
export type FundsStep = 'Regular' | 'Step-up' | 'Step-down';
export interface FundsInput {
  plan: FundsPlan;
  step: FundsStep;
  initial: number;
  instalment: number;
  annualReturn: number;
  sourceReturn: number;
  years: number;
  frequency: number;
  change: number;
  changeType: 'percent' | 'amount';
}
export interface FundsRow {
  period: number;
  year: number;
  requested: number;
  payment: number;
  source: number;
  destination: number;
  balance: number;
  gain: number;
  cumulativePayments: number;
}
export function calculateFunds(input: FundsInput) {
  const nonnegative = (v: number) => Number.isFinite(v) && v >= 0;
  if (![input.initial, input.instalment, input.change].every(nonnegative)
    || ![1, 2, 4, 12].includes(input.frequency)
    || !Number.isInteger(input.years) || input.years < 1 || input.years > 50
    || ![input.annualReturn, input.sourceReturn].every(v => Number.isFinite(v) && v > -100 && v <= 100)
    || (input.step === 'Step-down' && input.changeType === 'percent' && input.change > 100)) {
    throw new Error('Enter valid amounts, returns above −100% and up to 100%, and a duration of 1–50 whole years. Step-down cannot exceed 100%.');
  }
  const frequency = input.plan === 'Lumpsum' ? 1 : input.frequency;
  const rate = Math.pow(1 + input.annualReturn / 100, 1 / frequency) - 1;
  const sourceRate = Math.pow(1 + input.sourceReturn / 100, 1 / frequency) - 1;
  let source = input.plan === 'STP' ? input.initial : 0;
  let destination = input.plan === 'SIP' || input.plan === 'STP' ? 0 : input.initial;
  let payments = 0;
  let exhaustionPeriod: number | undefined;
  let shortfall = 0;
  const rows: FundsRow[] = [];
  for (let index = 0; index < input.years * frequency; index++) {
    const elapsedYears = Math.floor(index / frequency);
    const direction = input.step === 'Step-down' ? -1 : 1;
    const changeYears = input.step === 'Regular' ? 0 : elapsedYears;
    const requested = input.plan === 'Lumpsum' ? 0 : Math.max(0,
      input.changeType === 'amount'
        ? input.instalment + direction * input.change * changeYears
        : input.instalment * Math.pow(1 + direction * input.change / 100, changeYears));
    const opening = source + destination;
    let payment = requested;
    if (input.plan === 'STP' || input.plan === 'SWP') {
      const available = input.plan === 'STP' ? source : destination;
      payment = Math.min(requested, available);
      shortfall += requested - payment;
      if (requested > 0 && payment >= available && exhaustionPeriod === undefined) exhaustionPeriod = index + 1;
    }
    if (input.plan === 'STP') { source -= payment; destination += payment; }
    if (input.plan === 'SIP') destination += payment;
    if (input.plan === 'SWP') destination -= payment;
    payments += payment;
    source *= 1 + sourceRate;
    destination *= 1 + rate;
    const balance = source + destination;
    const netExternal = input.plan === 'SIP' ? payment : input.plan === 'SWP' ? -payment : 0;
    const gain = balance - opening - netExternal;
    if (![balance, payments, gain, requested].every(Number.isFinite)) throw new Error('These inputs produce an excessively large projection. Reduce the amount, step change or duration.');
    rows.push({ period: index + 1, year: (index + 1) / frequency, requested, payment, source, destination, balance, gain, cumulativePayments: payments });
  }
  const invested = input.plan === 'SIP' ? payments : input.initial;
  const balance = source + destination;
  const gain = balance + (input.plan === 'SWP' ? payments : 0) - invested;
  return { rows, invested, payments, source, destination, balance, gain, exhaustionPeriod, shortfall, frequency };
}