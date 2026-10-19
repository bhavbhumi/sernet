// Resolves published_at for CMS content saves and status toggles.
// Rules (per editorial requirement for backdated research imports):
// 1. An explicit item_date always wins: published_at = that date at midnight Asia/Kolkata,
//    applied on draft saves too so later edits (e.g. image changes) preserve the original date.
// 2. Without item_date, an existing published_at is preserved across saves and status changes
//    (reverting to draft never clears a historical timestamp).
// 3. Current time is used only for a genuinely new, undated publication.

const IST_MIDNIGHT_SUFFIX = 'T00:00:00+05:30';

export function itemDateToIstMidnight(itemDate: string): string {
  return `${itemDate}${IST_MIDNIGHT_SUFFIX}`;
}

export function resolvePublishedAt(opts: {
  status: string;
  itemDate?: string | null;
  existingPublishedAt?: string | null;
  now?: Date;
}): string | null {
  const itemDate = opts.itemDate?.trim();
  if (itemDate) return itemDateToIstMidnight(itemDate);

  const existing = opts.existingPublishedAt?.trim();
  if (opts.status === 'published') {
    return existing || (opts.now ?? new Date()).toISOString();
  }
  // draft / archived: keep whatever historical timestamp exists
  return existing || null;
}
