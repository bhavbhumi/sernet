import { describe, expect, it } from 'vitest';
import { defaultInterests, interestOptions, isOnboardingTab, tabContent } from './onboarding';

describe('partner onboarding', () => {
  it('offers Other Services without submitting an unselected generic interest', () => {
    expect(isOnboardingTab('other')).toBe(true);
    expect(defaultInterests('other')).toEqual([]);
    expect(defaultInterests('invest')).toEqual(['invest']);
  });

  it('places Altifi before PMS and AIF and uses the supplied signup address', () => {
    expect(tabContent.invest.sections?.map((section) => section.heading)).toEqual([
      'Bonds through Altifi',
      'Portfolio Management Services (PMS)',
      'Alternative Investment Funds (AIF)',
      'Minor, HUF, NRI or Non-Individual?',
    ]);
    expect(tabContent.invest.sections?.[0].steps?.[0].links?.[0].href).toBe('https://altifi.ai/sign_up');
  });

  it('routes non-individual investors on Invest and Trade to the account opening form', () => {
    for (const tab of ['invest', 'trade'] as const) {
      const section = tabContent[tab].sections?.find((item) => item.heading === 'Minor, HUF, NRI or Non-Individual?');
      expect(section).toBeDefined();
      expect(section?.intro).toContain('adult Resident Indian individuals');
      expect(section?.links?.[0].href).toBe('/downloads?tab=documents');
      expect(section?.interest).toBe(tab);
    }
  });

  it('uses one PMS / AIF interest and no Bonds interest', () => {
    const values = interestOptions.map((option) => option.value);
    expect(values.filter((value) => value === 'pms_aif')).toHaveLength(1);
    expect(interestOptions.find((option) => option.value === 'pms_aif')?.label).toBe('PMS / AIF');
    for (const retired of ['pms', 'aif', 'bonds']) expect(values).not.toContain(retired);
    expect(tabContent.invest.sections?.[0].interest).toBeUndefined();
    expect(tabContent.invest.sections?.[1]?.interest).toBe('pms_aif');
    expect(tabContent.invest.sections?.[2]?.interest).toBe('pms_aif');
  });

  it('keeps PMS and AIF callback-only until management supplies links', () => {
    for (const heading of ['Portfolio Management Services (PMS)', 'Alternative Investment Funds (AIF)']) {
      const section = tabContent.invest.sections?.find((item) => item.heading === heading);
      expect(section).toBeDefined();
      expect(section?.links).toBeUndefined();
      expect(section?.steps).toBeUndefined();
    }
  });

  it('offers notarisation as an interest only, not a provider link', () => {
    expect(interestOptions.some((option) => option.value === 'notarisation')).toBe(true);
    expect(tabContent.other.sections?.some((section) => section.interest === 'notarisation')).toBe(false);
  });

  it('has no Tax Planning section or interest because no partner is confirmed', () => {
    expect(interestOptions.map((option) => option.value)).not.toContain('tax_planning');
    expect(tabContent.other.sections?.some((section) => section.heading === 'Tax Planning')).toBe(false);
    expect(tabContent.other.sections?.some((section) => section.interest === 'tax_planning')).toBe(false);
  });

  it('uses the supplied Quicko referral for tax filing', () => {
    const filing = tabContent.other.sections?.find((section) => section.interest === 'tax_filing');
    expect(filing?.links?.[0].href).toBe('https://www.quicko.com?ref=sernetfspl');
  });
});
