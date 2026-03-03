
-- Allow public to read employees marked as public (for About/Careers pages)
CREATE POLICY "Public can read public employees"
  ON public.employees
  FOR SELECT
  TO anon, authenticated
  USING (is_public = true);
