import { describe, expect, it } from 'vitest';
import { defaultInterests, interestOptions, isOnboardingTab, tabContent } from './onboarding';

describe('partner onboarding', () => {
  it('offers Other Services without submitting an unselected generic interest', () => {
    expect(isOnboardingTab('other')).toBe(true);
    expect(defaultInterests('other')).toEqual([]);
    expect(defaultInterests('invest')).toEqual(['invest']);
  });
  it('places Altifi before PMS and AIF and uses the supplied signup address', () => {
    expect(tabContent.invest.sections?.map((section) => section.interest)).toEqual(['bonds', 'pms', 'aif']);
    expect(tabContent.invest.sections?.[0].steps?.[0].links?.[0].href).toBe('https://altifi.ai/sign_up');
  });
  it('keeps PMS and AIF callback-only until management supplies links', () => {
    for (const interest of ['pms', 'aif']) {
      const section = tabContent.invest.sections?.find((item) => item.interest === interest);
      expect(section).toBeDefined();
      expect(section?.links).toBeUndefined();
      expect(section?.steps).toBeUndefined();
    }
  });
  it('offers notarisation as an interest only, not a provider link', () => {
    expect(interestOptions.some((option) => option.value === 'notarisation')).toBe(true);
    expect(tabContent.other.sections?.some((section) => section.interest === 'notarisation')).toBe(false);
  });
  it('uses the supplied Quicko referral for tax filing separately from planning', () => {
    const filing = tabContent.other.sections?.find((section) => section.interest === 'tax_filing');
    expect(filing?.links?.[0].href).toBe('https://www.quicko.com?ref=sernetfspl');
    expect(tabContent.other.sections?.find((section) => section.interest === 'tax_planning')?.links).toBeUndefined();
  });
});