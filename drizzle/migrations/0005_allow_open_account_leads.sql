DROP POLICY IF EXISTS "Public can submit leads" ON public.leads;
CREATE POLICY "Public can submit leads" ON public.leads FOR INSERT TO public
WITH CHECK ((status = 'new') AND (source = ANY (ARRAY['website','schedule-call','ask-us','tieup','referral','calculator','open_account'])) AND (assigned_to IS NULL) AND (notes IS NULL));