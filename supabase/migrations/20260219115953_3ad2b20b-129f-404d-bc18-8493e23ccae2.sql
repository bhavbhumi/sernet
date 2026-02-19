
-- Article likes table (fingerprint-based to prevent duplicates)
CREATE TABLE public.article_likes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  article_id uuid NOT NULL,
  fingerprint text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(article_id, fingerprint)
);

ALTER TABLE public.article_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can like articles"
  ON public.article_likes FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Public can read like counts"
  ON public.article_likes FOR SELECT
  USING (true);

CREATE POLICY "Public can unlike"
  ON public.article_likes FOR DELETE
  USING (true);

-- Article shares table
CREATE TABLE public.article_shares (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  article_id uuid NOT NULL,
  fingerprint text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.article_shares ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can record shares"
  ON public.article_shares FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Public can read share counts"
  ON public.article_shares FOR SELECT
  USING (true);
