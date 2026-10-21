export const POST_TYPES = ['Macro & Markets', 'Investment', 'Insurance', 'Trading', 'Credit', 'Personal Finance'] as const;
export type PostType = (typeof POST_TYPES)[number];

export function typeSlug(t: string): string {
  return t.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export function typeFromSlug(slug: string | null): PostType | 'All' {
  return POST_TYPES.find((t) => typeSlug(t) === slug) ?? 'All';
}

export function postPath(p: { id: string; content_type?: string | null }): string {
  return p.content_type === 'analysis' ? `/insights/analysis/${p.id}` : `/insights/articles/${p.id}`;
}
