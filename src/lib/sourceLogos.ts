import amfiLogo from '@/assets/amfi-logo.webp';
import sebiLogo from '@/assets/sebi-logo.webp';

/**
 * Official logos for feed sources whose sites don't expose a usable favicon.
 * Keyed by hostname fragment (matched with String.includes).
 */
const SOURCE_LOGO_OVERRIDES: Array<{ match: string; url: string }> = [
  { match: 'amfiindia.com', url: amfiLogo },
  { match: 'sebi.gov.in', url: sebiLogo },
];

export function getSourceLogoUrl(feedUrl: string | null): string | null {
  if (!feedUrl) return null;
  let host: string;
  try {
    host = new URL(feedUrl).hostname.toLowerCase();
  } catch {
    return null;
  }
  const override = SOURCE_LOGO_OVERRIDES.find((o) => host.includes(o.match));
  if (override) return override.url;
  return `https://www.google.com/s2/favicons?domain=${host}&sz=64`;
}
