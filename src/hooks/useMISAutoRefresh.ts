import { useEffect, useRef } from 'react';
import { MIS_REFRESH_EVENT } from '@/lib/misRefresh';

// Legacy form screens retain their save callbacks but join the mounted admin refresh cycle.
export function useMISAutoRefresh(refresh: () => unknown) {
  const callback = useRef(refresh);
  useEffect(() => { callback.current = refresh; });
  useEffect(() => {
    const listener = () => { void callback.current(); };
    window.addEventListener(MIS_REFRESH_EVENT, listener);
    return () => window.removeEventListener(MIS_REFRESH_EVENT, listener);
  }, []);
}