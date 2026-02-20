CREATE TABLE public.content_summaries (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content_id uuid NOT NULL,
  content_type text NOT NULL CHECK (content_type IN ('article', 'analysis')),
  tldr text NOT NULL,
  key_points jsonb NOT NULL DEFAULT '[]'::jsonb,
  sentiment text NOT NULL DEFAULT 'neutral',
  read_time text NOT NULL DEFAULT '1 min read',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (content_id, content_type)
);

ALTER TABLE public.content_summaries ENABLE ROW LEVEL SECURITY;

-- Anyone can read cached summaries
CREATE POLICY "Public can read summaries"
ON public.content_summaries
FOR SELECT
USING (true);

-- Only service role (edge function) can insert/update
CREATE POLICY "Service role can manage summaries"
ON public.content_summaries
FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');
