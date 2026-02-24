
-- Allow re-subscribing via upsert: public can update their own subscription
-- but only to set status='active' and clear unsubscribed_at
DROP POLICY IF EXISTS "Public can resubscribe" ON public.newsletter_subscribers;
CREATE POLICY "Public can resubscribe" ON public.newsletter_subscribers
  FOR UPDATE
  USING (true)
  WITH CHECK (
    status = 'active'
    AND unsubscribed_at IS NULL
  );
