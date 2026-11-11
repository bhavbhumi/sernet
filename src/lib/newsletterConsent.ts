export const NEWSLETTER_PREFERENCES = ['resources', 'articles', 'promotions'];

export function normalizePreferences(value: unknown): string[] {
  const values = Array.isArray(value) ? value.map(String) : [];
  return [...new Set(values.map(p => p === 'promotion' ? 'promotions' : p))];
}

export function eligibleSubscriber(row: { status: string; preferences: unknown; unsubscribed_at: string | null }, targets: string[]) {
  if (row.status !== 'active' || row.unsubscribed_at) return false;
  const desired = normalizePreferences(targets);
  return desired.length === 0 || normalizePreferences(row.preferences).some(p => desired.includes(p));
}