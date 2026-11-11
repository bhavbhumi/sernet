import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

/** Private service rating for a resolved/closed ticket, with an optional public-review invitation for 4–5 stars. */
export function TicketRating({ ticketId, userId, clientName, existing, onSaved }: {
  ticketId: string; userId: string; clientName: string; existing?: number; onSaved: (rating: number) => void;
}) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState<number | null>(existing ?? null);
  const [reviewText, setReviewText] = useState('');
  const [consent, setConsent] = useState(false);
  const [reviewState, setReviewState] = useState<'idle' | 'sent' | 'error'>('idle');

  const submit = async () => {
    if (!rating) return;
    setSaving(true);
    const { error } = await supabase.from('ticket_feedback').insert({
      ticket_id: ticketId, user_id: userId, rating, comment: comment.trim() || null,
      follow_up_status: rating <= 3 ? 'pending' : 'none',
    });
    setSaving(false);
    if (!error) { setSaved(rating); onSaved(rating); }
  };

  const submitReview = async () => {
    if (!reviewText.trim() || !consent || saved === null) return;
    const { error } = await supabase.from('reviews').insert({
      name: clientName || 'SERNET client', review: reviewText.trim().slice(0, 1000), rating: saved,
      review_type: 'text', source: 'portal_ticket', status: 'pending',
    });
    setReviewState(error ? 'error' : 'sent');
  };

  if (saved !== null) {
    return (
      <div className="mt-2 text-xs text-muted-foreground space-y-2">
        <p>You rated this service {saved}/5. Thank you.</p>
        {saved >= 4 && reviewState !== 'sent' && (
          <div className="space-y-2 max-w-md">
            <p className="text-foreground">Would you like to share a short public review?</p>
            <Textarea rows={2} maxLength={1000} value={reviewText} onChange={e => setReviewText(e.target.value)} placeholder="Your experience with SERNET" />
            <label className="flex items-start gap-2"><Checkbox checked={consent} onCheckedChange={v => setConsent(v === true)} /> <span>SERNET may publish this review with my name after checking it.</span></label>
            <Button size="sm" variant="outline" disabled={!reviewText.trim() || !consent} onClick={submitReview}>Send review</Button>
            {reviewState === 'error' && <p className="text-destructive">Could not send your review. Please try again.</p>}
          </div>
        )}
        {reviewState === 'sent' && <p>Your review was sent and will appear after our team checks it.</p>}
      </div>
    );
  }

  return (
    <div className="mt-2 space-y-2 max-w-md">
      <p className="text-xs text-muted-foreground">How was our service on this request?</p>
      <div className="flex gap-1" role="radiogroup" aria-label="Rate this service from 1 to 5">
        {[1, 2, 3, 4, 5].map(n => (
          <button key={n} type="button" role="radio" aria-checked={rating === n} aria-label={`${n} star${n > 1 ? 's' : ''}`} onClick={() => setRating(n)}>
            <Star className={cn('h-5 w-5', n <= rating ? 'fill-primary text-primary' : 'text-muted-foreground')} />
          </button>
        ))}
      </div>
      {rating > 0 && (
        <>
          <Textarea rows={2} maxLength={1000} value={comment} onChange={e => setComment(e.target.value)} placeholder={rating <= 3 ? 'What could we have done better? (optional)' : 'Anything to add? (optional)'} />
          <Button size="sm" onClick={submit} disabled={saving}>{saving ? 'Saving…' : 'Submit rating'}</Button>
        </>
      )}
    </div>
  );
}
