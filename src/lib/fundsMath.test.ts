import { describe, expect, it } from 'vitest';
import { calculateFunds, type FundsInput } from './fundsMath';

const base: FundsInput = { plan: 'SIP', step: 'Regular', initial: 10000, instalment: 100, annualReturn: 0, sourceReturn: 0, years: 2, frequency: 12, change: 10, changeType: 'percent' };
describe('Funds calculator rules', () => {
  it('compounds Lumpsum using effective annual returns', () => {
    expect(calculateFunds({ ...base, plan: 'Lumpsum', annualReturn: 10 }).balance).toBeCloseTo(12100, 6);
  });
  for (const plan of ['SIP', 'STP', 'SWP'] as const) {
    for (const [step, payment] of [['Regular', 2400], ['Step-up', 2520], ['Step-down', 2280]] as const) {
      it(`${step} ${plan} keeps first-year payments and changes only year two`, () => {
        const result = calculateFunds({ ...base, plan, step });
        expect(result.payments).toBeCloseTo(payment, 6);
        expect(result.rows[11].payment).toBe(100);
        expect(result.rows[12].payment).toBeCloseTo(step === 'Regular' ? 100 : step === 'Step-up' ? 110 : 90);
        expect(result.balance).toBeCloseTo(plan === 'SIP' ? payment : plan === 'STP' ? 10000 : 10000 - payment);
        expect(result.gain).toBeCloseTo(0);
      });
    }
  }
  it('uses beginning-of-period SIP payments and equivalent annual growth', () => {
    const rate = Math.pow(1.12, 1 / 12) - 1;
    expect(calculateFunds({ ...base, years: 1, annualReturn: 12 }).balance).toBeCloseTo(100 * (Math.pow(1 + rate, 12) - 1) / rate * (1 + rate));
  });
  it('tracks source and destination returns without double-counting STP', () => {
    const result = calculateFunds({ ...base, plan: 'STP', years: 1, frequency: 1, instalment: 1000, sourceReturn: 5, annualReturn: 10 });
    expect(result.source).toBeCloseTo(9450);
    expect(result.destination).toBeCloseTo(1100);
    expect(result.invested).toBe(10000);
    expect(result.gain).toBeCloseTo(550);
  });
  for (const plan of ['STP', 'SWP'] as const) {
    it(`caps ${plan} at available balance and reports exhaustion`, () => {
      const result = calculateFunds({ ...base, plan, initial: 250, years: 1 });
      expect(result.rows[2].payment).toBe(50);
      expect(result.exhaustionPeriod).toBe(3);
      expect(result.shortfall).toBe(950);
      expect(result.rows.every(row => row.source >= 0 && row.destination >= 0)).toBe(true);
    });
  }
  it('fixed step-down reaches zero and never becomes negative', () => {
    const result = calculateFunds({ ...base, step: 'Step-down', changeType: 'amount', change: 60, years: 3 });
    expect(result.rows[12].payment).toBe(40);
    expect(result.rows[24].payment).toBe(0);
    expect(result.payments).toBe(1680);
  });
  it('fixed step-up applies annually, not every quarter', () => {
    const result = calculateFunds({ ...base, frequency: 4, step: 'Step-up', changeType: 'amount', change: 50 });
    expect(result.rows[3].payment).toBe(100);
    expect(result.rows[4].payment).toBe(150);
    expect(result.payments).toBe(1000);
  });
  it('rejects step-down percentages above 100%', () => {
    expect(() => calculateFunds({ ...base, step: 'Step-down', change: 101 })).toThrow();
    expect(calculateFunds({ ...base, step: 'Step-down', change: 100 }).rows[12].payment).toBe(0);
  });
  it('supports negative returns and rejects invalid amounts and duration', () => {
    expect(calculateFunds({ ...base, plan: 'Lumpsum', annualReturn: -10 }).balance).toBeCloseTo(8100);
    for (const patch of [{ initial: -1 }, { years: 0 }, { annualReturn: -100 }, { frequency: 3 }, { years: 1.5 }]) {
      expect(() => calculateFunds({ ...base, ...patch })).toThrow();
    }
  });
});