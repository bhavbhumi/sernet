import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { isMISQuery, MIS_REFRESH_EVENT, MIS_REFRESH_MS } from '@/lib/misRefresh';

export function AdminMISRefresh() {
  const client = useQueryClient();
  useEffect(() => {
    let pending: ReturnType<typeof setTimeout> | undefined;
    const refresh = () => {
      if (document.visibilityState !== 'visible' || !navigator.onLine) return;
      void client.invalidateQueries({ predicate: query => isMISQuery(query.queryKey), refetchType: 'active' });
      window.dispatchEvent(new Event(MIS_REFRESH_EVENT));
    };
    const interval = setInterval(refresh, MIS_REFRESH_MS);
    window.addEventListener('focus', refresh);
    window.addEventListener('online', refresh);
    document.addEventListener('visibilitychange', refresh);
    const unsubscribe = client.getMutationCache().subscribe(event => {
      if (event.type !== 'updated' || event.action.type !== 'success') return;
      clearTimeout(pending);
      pending = setTimeout(refresh, 200);
    });
    return () => {
      clearInterval(interval);
      clearTimeout(pending);
      unsubscribe();
      window.removeEventListener('focus', refresh);
      window.removeEventListener('online', refresh);
      document.removeEventListener('visibilitychange', refresh);
    };
  }, [client]);
  return null;
}