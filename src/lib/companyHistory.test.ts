import { describe, expect, it } from 'vitest';
import { companyHistory, completedFamilyPracticeYears } from './companyHistory';

describe('confirmed family practice and incorporation dates', () => {
  it('starts the individual family practice in October 1986', () => {
    expect(companyHistory.familyPracticeStarted).toBe('1986-10');
  });
  it('keeps incorporation on 10 March 2004 separate from the legacy', () => {
    expect(companyHistory.incorporatedOn).toBe('2004-03-10');
  });
  it('counts 40 completed years in October 2026, not 41', () => {
    expect(completedFamilyPracticeYears(2026, 10)).toBe(40);
    expect(completedFamilyPracticeYears(2026, 9)).toBe(39);
    expect(completedFamilyPracticeYears(2027, 10)).toBe(41);
  });
  it('retains the confirmed joining periods', () => {
    expect(companyHistory.milestones[1].period).toBe('June 1987');
    expect(companyHistory.milestones[2].period).toBe('1994');
  });
});