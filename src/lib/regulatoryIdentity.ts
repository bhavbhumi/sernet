// Single source of SERNET's verified regulatory identity.
// Plain data only (no React/imports) so the build-time prerenderer can reuse it.

export const legalEntityName = 'SERNET Financial Services Private Limited';

export const distributorRegistrations = [
  { authority: 'AMFI', role: 'Mutual Fund Distributor', registration: 'ARN 35275', euin: 'E025145', firstRegistered: '10 February 2006', validUntil: '28 October 2028' },
  { authority: 'APMI', role: 'PMS Distributor', registration: 'APRN 10097', euin: 'E19955', firstRegistered: '25 October 2025', validUntil: '28 October 2028' },
] as const;

export const distributorScope =
  'SERNET is an AMFI-registered mutual fund distributor and an APMI-registered PMS distributor. SERNET is not a stock broker, Research Analyst (RA) or Registered Investment Adviser (RIA).';

/** Short one-line form for product pages. */
export const regulatoryShortLine =
  'AMFI-registered Mutual Fund Distributor (ARN 35275, EUIN E025145) · APMI-registered PMS Distributor (APRN 10097, EUIN E19955) · Valid until 28 October 2028';

export const regulatoryLimits =
  'Not a stock broker, Research Analyst or Registered Investment Adviser. Any guidance is incidental to distribution; registration does not imply regulatory approval of any product or assurance of returns.';

/**
 * Actual content-review dates for code-maintained pages (ISO yyyy-mm-dd).
 * Update only after a genuine content review — never on deployment.
 * CMS documents keep their review date in legal_pages.last_reviewed_on.
 */
export const pageReviewDates: Record<string, string> = {
  tickfunds: '2026-10-15',
};

export const formatReviewDate = (iso?: string | null) =>
  iso ? new Date(`${iso.slice(0, 10)}T00:00:00Z`).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }) : '';
