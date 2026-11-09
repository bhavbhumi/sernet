/**
 * Lead attribution: remembers how a visitor first arrived (campaign tags, referrer,
 * landing page) so every enquiry form can record where the lead came from.
 * Browser-only helpers; safe to import during server rendering.
 */
export type LeadAttribution = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  referrer?: string;
  landing_page?: string;
  first_seen_at?: string;
  submitted_from?: string;
};

const STORAGE_KEY = 'sernet_lead_attribution';
const MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;
const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const;

const clean = (value: string | null | undefined, max = 200) => {
  const v = (value ?? '').trim();
  return v ? v.slice(0, max) : undefined;
};

/** Pure parser: build attribution from a URL and referrer. Returns null when nothing is attributable. */
export function parseAttribution(url: string, referrer: string, now = new Date()): LeadAttribution | null {
  let parsed: URL;
  try { parsed = new URL(url); } catch { return null; }
  const result: LeadAttribution = {};
  for (const key of UTM_KEYS) {
    const value = clean(parsed.searchParams.get(key));
    if (value) result[key] = value.toLowerCase();
  }
  let externalReferrer: string | undefined;
  try {
    const ref = referrer ? new URL(referrer) : null;
    if (ref && ref.hostname !== parsed.hostname) externalReferrer = ref.hostname;
  } catch { /* ignore malformed referrer */ }
  if (externalReferrer) result.referrer = externalReferrer;
  if (!result.utm_source && !externalReferrer) return null;
  result.landing_page = clean(parsed.pathname, 300);
  result.first_seen_at = now.toISOString();
  return result;
}

/** Campaign-tagged visits replace older attribution; plain referrals only fill an empty or expired slot. */
export function mergeAttribution(existing: LeadAttribution | null, incoming: LeadAttribution | null, now = new Date()): LeadAttribution | null {
  const expired = !existing?.first_seen_at || now.getTime() - new Date(existing.first_seen_at).getTime() > MAX_AGE_MS;
  if (!incoming) return expired ? null : existing;
  if (incoming.utm_source || expired) return incoming;
  return existing;
}

function read(): LeadAttribution | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as LeadAttribution) : null;
  } catch { return null; }
}

/** Call on public page navigation (in an effect). */
export function captureAttribution() {
  if (typeof window === 'undefined') return;
  const incoming = parseAttribution(window.location.href, document.referrer);
  const next = mergeAttribution(read(), incoming);
  try {
    if (next) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    else window.localStorage.removeItem(STORAGE_KEY);
  } catch { /* storage unavailable */ }
}

/** Attribution to store in a lead's context at submission time. */
export function getAttribution(): LeadAttribution {
  if (typeof window === 'undefined') return {};
  const stored = mergeAttribution(read(), null) ?? {};
  return { ...stored, submitted_from: window.location.pathname };
}

/** Label used in reports: campaign name, else source, else referrer, else Direct. */
export function attributionLabel(context: unknown): { channel: string; campaign: string | null } {
  const a = ((context as { attribution?: LeadAttribution } | null)?.attribution) ?? {};
  const channel = a.utm_source ?? a.referrer ?? 'direct / unknown';
  return { channel, campaign: a.utm_campaign ?? null };
}
