
-- Allow public to read poll vote counts (needed for result bars on public page)
CREATE POLICY "Public can read poll votes"
ON public.poll_votes
FOR SELECT
USING (true);

-- Table for survey engagement likes
CREATE TABLE public.survey_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  survey_id UUID NOT NULL,
  fingerprint TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (survey_id, fingerprint)
);

ALTER TABLE public.survey_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read survey likes"
ON public.survey_likes FOR SELECT USING (true);

CREATE POLICY "Public can like surveys"
ON public.survey_likes FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can unlike surveys"
ON public.survey_likes FOR DELETE USING (true);

-- Table for poll engagement likes
CREATE TABLE public.poll_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  poll_id UUID NOT NULL,
  fingerprint TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (poll_id, fingerprint)
);

ALTER TABLE public.poll_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read poll likes"
ON public.poll_likes FOR SELECT USING (true);

CREATE POLICY "Public can like polls"
ON public.poll_likes FOR INSERT WITH CHECK (true);

CREATE POLICY "Public can unlike polls"
ON public.poll_likes FOR DELETE USING (true);
