
-- Fix duplicate RLS policies
DROP POLICY IF EXISTS "Public can unlike polls" ON public.poll_likes;
DROP POLICY IF EXISTS "Public can unlike surveys" ON public.survey_likes;

-- Tighten survey_responses INSERT
DROP POLICY IF EXISTS "Public can submit survey responses" ON public.survey_responses;
CREATE POLICY "Public can submit survey responses" ON public.survey_responses
  FOR INSERT WITH CHECK (
    survey_id IS NOT NULL
    AND answers IS NOT NULL
  );
