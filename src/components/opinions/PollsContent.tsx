
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Vote, BarChart3, CheckCircle2, Users, Clock, Heart, Share2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = (t: string) => supabase.from(t as any) as any;

const getFingerprint = () => {
  let fp = localStorage.getItem('sernet_fp');
  if (!fp) { fp = Math.random().toString(36).slice(2) + Date.now().toString(36); localStorage.setItem('sernet_fp', fp); }
  return fp;
};

interface PollOption {
  id: string;
  label: string;
  sort_order: number;
}

interface Poll {
  id: string;
  question: string;
  category: string;
  status: string;
  ends_at: string | null;
}

// ── Engagement Buttons ───────────────────────────────────────────────────────
function PollEngagement({ pollId }: { pollId: string }) {
  const { toast } = useToast();
  const fp = getFingerprint();
  const qc = useQueryClient();

  const { data: likeData } = useQuery({
    queryKey: ['poll_likes', pollId],
    queryFn: async () => {
      const { data } = await db('poll_likes').select('fingerprint').eq('poll_id', pollId);
      return data ?? [];
    },
  });

  const liked = (likeData ?? []).some((l: { fingerprint: string }) => l.fingerprint === fp);
  const likeCount = (likeData ?? []).length;

  const toggleLike = useMutation({
    mutationFn: async () => {
      if (liked) {
        await db('poll_likes').delete().eq('poll_id', pollId).eq('fingerprint', fp);
      } else {
        await db('poll_likes').insert([{ poll_id: pollId, fingerprint: fp }]);
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['poll_likes', pollId] }),
  });

  const handleShare = async () => {
    await navigator.clipboard.writeText(window.location.href);
    toast({ title: 'Link copied!', description: 'Poll link copied to clipboard.' });
  };

  return (
    <div className="flex items-center gap-3 mt-4 pt-3 border-t border-border/50">
      <button
        onClick={() => toggleLike.mutate()}
        className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${liked ? 'text-rose-500' : 'text-muted-foreground hover:text-rose-500'}`}
      >
        <Heart className={`h-3.5 w-3.5 ${liked ? 'fill-rose-500' : ''}`} />
        {likeCount > 0 ? likeCount : ''} {liked ? 'Liked' : 'Like'}
      </button>
      <button onClick={handleShare} className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary transition-colors">
        <Share2 className="h-3.5 w-3.5" /> Share
      </button>
    </div>
  );
}

// ── Poll Card ────────────────────────────────────────────────────────────────
function PollCard({ poll, index }: { poll: Poll; index: number }) {
  const { toast } = useToast();
  const fp = getFingerprint();
  const qc = useQueryClient();

  const { data: options = [] } = useQuery({
    queryKey: ['poll_options', poll.id],
    queryFn: async () => {
      const { data } = await db('poll_options').select('*').eq('poll_id', poll.id).order('sort_order');
      return (data ?? []) as PollOption[];
    },
  });

  const { data: votes = [] } = useQuery({
    queryKey: ['poll_votes', poll.id],
    queryFn: async () => {
      const { data } = await db('poll_votes').select('option_id, voter_fingerprint').eq('poll_id', poll.id);
      return data ?? [];
    },
  });

  const myVote = (votes as { option_id: string; voter_fingerprint: string | null }[])
    .find(v => v.voter_fingerprint === fp)?.option_id;

  const hasVoted = !!myVote;
  const showResults = hasVoted || poll.status === 'closed';
  const totalVotes = votes.length;

  const voteMutation = useMutation({
    mutationFn: async (optionId: string) => {
      if (hasVoted || poll.status === 'closed') return;
      const { error } = await db('poll_votes').insert([{ poll_id: poll.id, option_id: optionId, voter_fingerprint: fp }]);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['poll_votes', poll.id] });
      toast({ title: 'Vote recorded!', description: 'Thanks for participating.' });
    },
    onError: () => toast({ title: 'Could not record vote', variant: 'destructive' }),
  });

  const getEndsIn = () => {
    if (!poll.ends_at || poll.status === 'closed') return null;
    const diff = new Date(poll.ends_at).getTime() - Date.now();
    if (diff <= 0) return 'Ending soon';
    const days = Math.floor(diff / 86400000);
    if (days > 0) return `${days}d left`;
    const hours = Math.floor(diff / 3600000);
    return `${hours}h left`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.08 * index }}
      className="bg-muted/30 rounded-lg p-6 border border-border/50 hover:shadow-lg transition-all"
    >
      <div className="flex items-center justify-between mb-4">
        <span className="px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">{poll.category}</span>
        <span className="text-xs text-muted-foreground flex items-center gap-1">
          {poll.status === 'closed' ? (
            <><CheckCircle2 className="h-3 w-3" /> Closed</>
          ) : getEndsIn() ? (
            <><Clock className="h-3 w-3" /> {getEndsIn()}</>
          ) : (
            <span className="text-emerald-600 font-medium">Active</span>
          )}
        </span>
      </div>

      <h3 className="text-lg font-semibold text-foreground mb-4">{poll.question}</h3>

      <div className="space-y-2.5">
        {options.map((option) => {
          const optVotes = (votes as { option_id: string }[]).filter(v => v.option_id === option.id).length;
          const percentage = totalVotes > 0 ? Math.round((optVotes / totalVotes) * 100) : 0;
          const isSelected = myVote === option.id;

          return (
            <button
              key={option.id}
              onClick={() => !showResults && voteMutation.mutate(option.id)}
              disabled={showResults || poll.status === 'closed' || voteMutation.isPending}
              className={`w-full text-left relative rounded-lg overflow-hidden border transition-all ${
                isSelected ? 'border-primary bg-primary/5' : 'border-border/50 hover:border-primary/30'
              } ${!showResults && poll.status === 'active' ? 'cursor-pointer' : 'cursor-default'}`}
            >
              {showResults && (
                <motion.div
                  className="absolute inset-0 bg-primary/10"
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                />
              )}
              <div className="relative flex items-center justify-between px-4 py-3">
                <span className="text-sm font-medium text-foreground flex items-center gap-2">
                  {isSelected && <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />}
                  {option.label}
                </span>
                {showResults && (
                  <span className="text-sm font-semibold text-foreground ml-2 shrink-0">{percentage}%</span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
        <Users className="h-3 w-3" />
        <span>{totalVotes.toLocaleString()} {totalVotes === 1 ? 'vote' : 'votes'}</span>
        {showResults && !hasVoted && <span className="flex items-center gap-1"><BarChart3 className="h-3 w-3" /> Final results</span>}
        {hasVoted && <span className="text-primary font-medium">· You voted</span>}
      </div>

      <PollEngagement pollId={poll.id} />
    </motion.div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────
export const PollsContent = () => {
  const { data: polls = [], isLoading } = useQuery({
    queryKey: ['polls_public'],
    queryFn: async () => {
      const { data } = await db('polls').select('*').order('created_at', { ascending: false });
      return (data ?? []) as Poll[];
    },
  });

  return (
    <section className="section-padding">
      <div className="container-zerodha">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <Vote className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-semibold text-foreground">Quick Polls</h2>
          </div>
          <p className="text-muted-foreground">Cast your vote on trending topics — see how the community thinks.</p>
        </motion.div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 gap-6">
            {Array(4).fill(0).map((_, i) => <div key={i} className="h-64 bg-muted animate-pulse rounded-lg" />)}
          </div>
        ) : polls.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground">No polls available right now. Check back soon!</div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {polls.map((poll, index) => (
              <PollCard key={poll.id} poll={poll} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
