
DROP POLICY IF EXISTS "Public can submit tickets" ON public.support_tickets;

CREATE POLICY "Anon can submit tickets"
ON public.support_tickets
FOR INSERT TO anon
WITH CHECK (
  status = 'open'
  AND channel = 'website'
  AND created_by IS NULL
  AND assigned_to IS NULL
  AND resolved_at IS NULL
  AND closed_at IS NULL
  AND first_response_at IS NULL
);

DROP POLICY IF EXISTS "Authenticated users can submit tickets" ON public.support_tickets;

CREATE POLICY "Authenticated users can submit tickets"
ON public.support_tickets
FOR INSERT TO authenticated
WITH CHECK (
  status = 'open'
  AND channel = 'website'
  AND created_by = auth.uid()
  AND assigned_to IS NULL
  AND resolved_at IS NULL
  AND closed_at IS NULL
  AND first_response_at IS NULL
);
