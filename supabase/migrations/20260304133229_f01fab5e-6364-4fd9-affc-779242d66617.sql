
-- Add a separate INSERT policy for authenticated users that allows created_by to be set
CREATE POLICY "Authenticated users can submit tickets"
ON public.support_tickets FOR INSERT
TO authenticated
WITH CHECK (
  status = 'open'::ticket_status
  AND channel = 'website'::ticket_channel
  AND created_by = auth.uid()
  AND assigned_to IS NULL
  AND resolved_at IS NULL
  AND closed_at IS NULL
  AND first_response_at IS NULL
);

-- Allow authenticated users to read their own tickets
CREATE POLICY "Authenticated users can read own tickets"
ON public.support_tickets FOR SELECT
TO authenticated
USING (created_by = auth.uid());
