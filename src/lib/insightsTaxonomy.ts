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

/** Approved Category → Sub Category options per Type (mapping workbook + Trading additions). */
export const TAXONOMY: Record<PostType, Record<string, string[]>> = {
  'Macro & Markets': { Macro: ['Economy'], Markets: ['Updates', 'Market Impact', 'Triggers', 'Outlook'] },
  Investment: {
    'Mutual Funds': ['Equity', 'Debt', 'Hybrid', 'Other Schemes'],
    'Bonds & Fixed Income': ['Corporate', 'Government & Sovereign'],
    'Precious Metals': ['Gold', 'Silver'],
    'Specialized Investment Funds (SIF)': [],
  },
  Insurance: { 'Life Insurance': ['Traditional'] },
  Trading: { Stocks: [], IPO: [], Industry: [], Sector: [] },
  Credit: { 'Loans Against Assets': ['LAMF', 'LAS', 'LAPM'], 'Credit Counselling': [] },
  'Personal Finance': { 'Budgeting & Money Management': [] },
};

export function categoriesFor(type: string): string[] {
  return Object.keys(TAXONOMY[type as PostType] ?? {});
}
export function subCategoriesFor(type: string, category: string): string[] {
  return TAXONOMY[type as PostType]?.[category] ?? [];
}

export const MEDIA_GROUPS = ['Read', 'Watch', 'Listen'] as const;
export type MediaGroup = (typeof MEDIA_GROUPS)[number];
export const MEDIA_KINDS = [
  { value: 'text', label: 'Text only', group: 'Read' },
  { value: 'image_text', label: 'Image + Text', group: 'Read' },
  { value: 'image', label: 'Image', group: 'Watch' },
  { value: 'gif', label: 'GIF', group: 'Watch' },
  { value: 'video', label: 'Video', group: 'Watch' },
  { value: 'audio', label: 'Audio', group: 'Listen' },
] as const;
export type MediaKind = (typeof MEDIA_KINDS)[number]['value'];
export function mediaGroupOf(kind: string | null | undefined): MediaGroup {
  return (MEDIA_KINDS.find((k) => k.value === kind)?.group ?? 'Read') as MediaGroup;
}
export function kindsFor(group: MediaGroup) {
  return MEDIA_KINDS.filter((k) => k.group === group);
}
