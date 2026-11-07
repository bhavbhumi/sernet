/** Publication status does not imply that a table has a publication timestamp. */
export function cmsOrderColumn(fields: readonly { key: string; type: string }[], explicit?: string) {
  return explicit ?? (fields.some(field => field.key === 'published_at') ? 'published_at' : 'created_at');
}

export function cmsPublicationPatch(hasPublicationDate: boolean, status: unknown, existing: unknown) {
  return hasPublicationDate && status === 'published' && !String(existing ?? '').trim()
    ? { published_at: new Date().toISOString() }
    : {};
}

export function matchesCMSRecord(item: Record<string, unknown>, keys: readonly string[], search: string) {
  const term = search.trim().toLowerCase();
  return keys.some(key => String(item[key] ?? '').toLowerCase().includes(term));
}