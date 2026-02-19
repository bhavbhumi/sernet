-- Allow public to count survey responses (needed for showing response count on survey cards)
CREATE POLICY "Public can count survey responses"
  ON public.survey_responses
  FOR SELECT
  USING (true);
