import { describe, expect, it } from 'vitest';
import { salesDealSchema, productLabel } from './salesWorkflow';
const valid = { title: 'MF opportunity', contact: '00000000-0000-4000-8000-000000000001', product: '00000000-0000-4000-8000-000000000002', value: 50000 };
describe('Sales opportunities', () => {
  it('requires an existing contact', () => expect(salesDealSchema.safeParse({ ...valid, contact: '' }).success).toBe(false));
  it('requires a master product', () => expect(salesDealSchema.safeParse({ ...valid, product: '' }).success).toBe(false));
  it('rejects negative opportunity value', () => expect(salesDealSchema.safeParse({ ...valid, value: -1 }).success).toBe(false));
  it('accepts a zero initial value', () => expect(salesDealSchema.parse({ ...valid, value: 0 }).value).toBe(0));
  it('uses saved brand and product hierarchy', () => expect(productLabel({ name: 'Mutual Funds', parent_id: 'brand' }, [{ id: 'brand', name: 'Tick Funds' }])).toBe('Tick Funds · Mutual Funds'));
});