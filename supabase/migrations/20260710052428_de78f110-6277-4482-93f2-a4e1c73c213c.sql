
-- 1. Support tickets: drop header-spoofable public read policy
DROP POLICY IF EXISTS "Public can read own tickets by email" ON public.support_tickets;

-- 2. Ticket replies: replace open non-internal read with scoped ownership check
DROP POLICY IF EXISTS "Public can read non-internal replies" ON public.ticket_replies;

CREATE POLICY "Ticket owners can read non-internal replies"
ON public.ticket_replies
FOR SELECT
TO authenticated
USING (
  is_internal = false
  AND EXISTS (
    SELECT 1 FROM public.support_tickets t
    WHERE t.id = ticket_replies.ticket_id
      AND t.created_by = auth.uid()
  )
);

-- 3. cms-media storage: defensively drop any legacy broad authenticated write policies
DROP POLICY IF EXISTS "Authenticated users can upload cms-media" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update cms-media" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete cms-media" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload/update/delete cms-media" ON storage.objects;
