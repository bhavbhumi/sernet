-- Allow public users to read active automation rules (needed for ticket classification on /support page)
CREATE POLICY "Public read active automation rules"
  ON public.support_automation_rules
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);
