
-- Fix leads INSERT policy to allow all legitimate frontend source values
DROP POLICY IF EXISTS "Public can submit leads" ON public.leads;
CREATE POLICY "Public can submit leads" ON public.leads
  FOR INSERT WITH CHECK (
    status = 'new'
    AND source IN ('website', 'schedule-call', 'ask-us', 'tieup', 'referral', 'calculator')
    AND assigned_to IS NULL
    AND notes IS NULL
  );
