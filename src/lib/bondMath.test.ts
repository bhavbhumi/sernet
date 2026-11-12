import { describe, it, expect } from 'vitest';
import { bondPrice, yieldToMaturity, currentYield, cashFlows, priceChangePct, postTaxYield } from './bondMath';

const bond = { face: 1000, couponPct: 10, years: 5, freq: 1 };

describe('bondMath', () => {
  it('prices at par when yield equals coupon', () => {
    expect(bondPrice(bond, 10)).toBeCloseTo(1000, 6);
  });
  it('YTM above coupon when bought at a discount', () => {
    const ytm = yieldToMaturity(bond, 950);
    expect(ytm).toBeGreaterThan(10);
    expect(bondPrice(bond, ytm)).toBeCloseTo(950, 4);
  });
  it('current yield is coupon over price', () => {
    expect(currentYield(bond, 1250)).toBeCloseTo(8, 6);
  });
  it('cash flows: 5 coupons of 100 and 1000 repaid at the end', () => {
    const cf = cashFlows(bond);
    expect(cf).toHaveLength(5);
    expect(cf[4].total).toBe(1100);
    expect(cf.reduce((s, c) => s + c.total, 0)).toBe(1500);
  });
  it('prices fall when rates rise', () => {
    expect(priceChangePct(bond, 10, 1)).toBeLessThan(0);
    expect(priceChangePct(bond, 10, -1)).toBeGreaterThan(0);
  });
  it('post-tax yield at 30% slab', () => {
    expect(postTaxYield(10, 30)).toBeCloseTo(7, 6);
  });
});
