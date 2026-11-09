import { queryOptions } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const downloadsTabs = ['invest', 'insure', 'trade', 'other'] as const;
export type DownloadsTab = (typeof downloadsTabs)[number];

export const downloadsTabLabels: Record<DownloadsTab, string> = {
  invest: 'Invest',
  insure: 'Insure',
  trade: 'Trade',
  other: 'Other Services',
};

/** Section order on the public page; sections with no published items are hidden. */
export const DOWNLOAD_SECTIONS = ['Account Opening', 'Information', 'Transactions', 'Service', 'Apps'] as const;

export const downloadsIntro: Record<DownloadsTab, string> = {
  invest: 'Forms, documents and apps for investing with Tick Funds and Altifi.',
  insure: 'Forms, documents and apps for insurance through Tushil.',
  trade: 'Forms, documents and apps for trading with Choice FinX.',
  other: 'Forms and documents for estate planning, credit counselling, tax filing and NRI documentation notarisation.',
};

export interface DownloadDoc { id: string; tab: string; section: string; title: string; note: string | null; href: string; sort_order: number }
export interface DownloadSection { heading: string; docs: DownloadDoc[] }

/** Published download items, managed in Admin → Website → Resources → Downloads. */
export const downloadItemsQuery = queryOptions({
  queryKey: ['download_items', 'public'],
  queryFn: async (): Promise<DownloadDoc[]> => {
    const { data, error } = await supabase
      .from('download_items')
      .select('id,tab,section,title,note,href,sort_order')
      .eq('status', 'published')
      .order('sort_order', { ascending: true });
    if (error) throw new Error(error.message);
    return data ?? [];
  },
});

export function groupDownloads(items: DownloadDoc[], tab: DownloadsTab): DownloadSection[] {
  return DOWNLOAD_SECTIONS
    .map((heading) => ({ heading, docs: items.filter((d) => d.tab === tab && d.section === heading) }))
    .filter((s) => s.docs.length > 0);
}

export const isDownloadsTab = (v: string | null): v is DownloadsTab =>
  !!v && (downloadsTabs as readonly string[]).includes(v);

/** Legacy ?tab=apps and ?tab=documents links land on Invest. */
export const resolveDownloadsTab = (v: string | null): DownloadsTab =>
  isDownloadsTab(v) ? v : 'invest';
