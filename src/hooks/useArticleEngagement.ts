import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Simple browser fingerprint stored in localStorage
function getFingerprint(): string {
  const key = 'sernet_fp';
  let fp = localStorage.getItem(key);
  if (!fp) {
    fp = Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem(key, fp);
  }
  return fp;
}

// Track whether this device has already shared this article
function hasShared(articleId: string): boolean {
  const key = `sernet_shared_${articleId}`;
  return localStorage.getItem(key) === '1';
}

function markShared(articleId: string) {
  localStorage.setItem(`sernet_shared_${articleId}`, '1');
}

export function useArticleEngagement(articleId: string) {
  const qc = useQueryClient();
  const fp = getFingerprint();

  // Fetch like count + whether current user liked
  const { data: likesData } = useQuery({
    queryKey: ['article-likes', articleId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('article_likes')
        .select('id, fingerprint')
        .eq('article_id', articleId);
      if (error) throw error;
      return {
        count: data.length,
        liked: data.some((l) => l.fingerprint === fp),
        myLikeId: data.find((l) => l.fingerprint === fp)?.id ?? null,
      };
    },
    enabled: !!articleId,
  });

  // Fetch share count
  const { data: sharesData } = useQuery({
    queryKey: ['article-shares', articleId],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('article_shares')
        .select('*', { count: 'exact', head: true })
        .eq('article_id', articleId);
      if (error) throw error;
      return count ?? 0;
    },
    enabled: !!articleId,
  });

  const likeMutation = useMutation({
    mutationFn: async () => {
      if (likesData?.liked && likesData.myLikeId) {
        await supabase.from('article_likes').delete().eq('id', likesData.myLikeId);
      } else {
        await supabase.from('article_likes').insert({ article_id: articleId, fingerprint: fp });
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['article-likes', articleId] }),
  });

  // Share: record only once per device per article
  const recordShare = useCallback(async (): Promise<boolean> => {
    if (hasShared(articleId)) {
      // Already shared from this device — don't add another row, just copy the link
      return false;
    }
    await supabase.from('article_shares').insert({ article_id: articleId, fingerprint: fp });
    markShared(articleId);
    qc.invalidateQueries({ queryKey: ['article-shares', articleId] });
    return true;
  }, [articleId, fp, qc]);

  return {
    likeCount: likesData?.count ?? 0,
    liked: likesData?.liked ?? false,
    shareCount: sharesData ?? 0,
    alreadyShared: hasShared(articleId),
    toggleLike: () => likeMutation.mutate(),
    recordShare,
  };
}
