import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useDebounce } from './useDebounce';

export interface SearchResult {
  id: string;
  content_type: 'article' | 'analysis' | 'circular' | 'news' | 'bulletin' | 'press' | 'report';
  title: string;
  excerpt: string | null;
  category: string | null;
  url: string | null;
  published_at: string | null;
  rank: number;
}

const TYPE_LABEL: Record<string, string> = {
  article: 'Article',
  analysis: 'Analysis',
  circular: 'Circular',
  news: 'News',
  bulletin: 'Bulletin',
  press: 'Press',
  report: 'Report',
};

const TYPE_ROUTE: Record<string, (id: string, url?: string | null) => string> = {
  article: (id) => `/insights/articles/${id}`,
  analysis: (id) => `/insights/analysis/${id}`,
  circular: (_id, url) => url || '/updates',
  news: (_id, url) => url || '/updates',
  bulletin: () => '/insights',
  press: (_id, url) => url || '/about?tab=Press',
  report: (_id, url) => url || '/insights?tab=Reports',
};

export function useSearch(query: string) {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 300);

  const search = useCallback(async (q: string) => {
    if (!q || q.trim().length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('search_content', {
        query_text: q.trim(),
        result_limit: 20,
      });
      if (error) throw error;
      setResults((data as SearchResult[]) || []);
    } catch (err) {
      console.error('Search error:', err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    search(debouncedQuery);
  }, [debouncedQuery, search]);

  // Group results by content type
  const grouped = results.reduce<Record<string, SearchResult[]>>((acc, item) => {
    const key = item.content_type;
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  return { results, grouped, loading, TYPE_LABEL, TYPE_ROUTE };
}
