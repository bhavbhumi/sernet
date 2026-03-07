
-- Step 1: Create content_type enum
CREATE TYPE public.post_content_type AS ENUM ('article', 'analysis', 'awareness', 'report');

-- Step 2: Add columns to articles table
ALTER TABLE public.articles 
  ADD COLUMN content_type public.post_content_type NOT NULL DEFAULT 'article',
  ADD COLUMN sub_category text NULL,
  ADD COLUMN file_url text NULL;

-- Step 3: Migrate analyses into articles
INSERT INTO public.articles (title, excerpt, body, author, category, read_time, media_url, thumbnail_url, source_url, status, published_at, created_at, updated_at, created_by, item_date, content_type, format)
SELECT title, excerpt, body, author, category, read_time, media_url, thumbnail_url, source_url, status, published_at, created_at, updated_at, created_by, item_date, 'analysis'::post_content_type, 'Text'::article_format
FROM public.analyses;

-- Step 4: Migrate awareness into articles
INSERT INTO public.articles (title, excerpt, body, author, category, read_time, media_url, thumbnail_url, status, published_at, created_at, updated_at, created_by, item_date, content_type, format)
SELECT title, excerpt, body, author, category, read_time, media_url, thumbnail_url, status, published_at, created_at, updated_at, created_by, item_date, 'awareness'::post_content_type, 'Text'::article_format
FROM public.awareness;

-- Step 5: Migrate reports into articles
INSERT INTO public.articles (title, excerpt, body, author, category, status, published_at, created_at, updated_at, created_by, content_type, format, file_url)
SELECT title, description, NULL, 'Research Desk', report_type, status, published_at, created_at, updated_at, created_by, 'report'::post_content_type, 'Text'::article_format, file_url
FROM public.reports;

-- Step 6: Create feed_type enum
CREATE TYPE public.feed_type AS ENUM ('news', 'circular');

-- Step 7: Create unified feeds table
CREATE TABLE public.feeds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  feed_type public.feed_type NOT NULL DEFAULT 'news',
  title text NOT NULL,
  source text NOT NULL,
  category text NOT NULL DEFAULT 'General',
  sub_category text NULL,
  link text NULL,
  summary text NULL,
  is_rss boolean DEFAULT false,
  rss_feed_url text NULL,
  status public.content_status NOT NULL DEFAULT 'draft',
  published_at timestamptz NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid NULL
);

ALTER TABLE public.feeds ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage feeds" ON public.feeds FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Public can read published feeds" ON public.feeds FOR SELECT USING (status = 'published');

-- Step 8: Migrate news_items into feeds
INSERT INTO public.feeds (title, source, category, link, summary, is_rss, rss_feed_url, status, published_at, created_at, updated_at, created_by, feed_type)
SELECT title, source, category, link, summary, COALESCE(is_rss, false), rss_feed_url, status, published_at, created_at, updated_at, created_by, 'news'::feed_type
FROM public.news_items;

-- Step 9: Migrate circulars into feeds
INSERT INTO public.feeds (title, source, category, link, summary, is_rss, rss_feed_url, status, published_at, created_at, updated_at, created_by, feed_type)
SELECT title, source, category, link, summary, COALESCE(is_rss, false), rss_feed_url, status, published_at, created_at, updated_at, created_by, 'circular'::feed_type
FROM public.circulars;

-- Step 10: Auto read_time trigger
CREATE OR REPLACE FUNCTION public.calc_read_time()
RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE word_count int; minutes int;
BEGIN
  IF NEW.body IS NOT NULL AND length(NEW.body) > 0 THEN
    word_count := array_length(string_to_array(trim(NEW.body), ' '), 1);
    minutes := GREATEST(1, round(word_count / 200.0));
    NEW.read_time := minutes || ' min read';
  ELSIF NEW.media_url IS NOT NULL THEN
    IF NEW.media_url ~* '\.(mp4|webm|mov|avi)' THEN NEW.read_time := '5 min watch';
    ELSIF NEW.media_url ~* '\.(mp3|wav|ogg|m4a)' THEN NEW.read_time := '5 min listen';
    ELSIF NEW.media_url ~* '\.(pdf)' THEN NEW.read_time := '10 min read';
    ELSE NEW.read_time := '3 min read';
    END IF;
  ELSE NEW.read_time := '1 min read';
  END IF;
  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS trg_calc_read_time ON public.articles;
CREATE TRIGGER trg_calc_read_time BEFORE INSERT OR UPDATE OF body, media_url ON public.articles FOR EACH ROW EXECUTE FUNCTION public.calc_read_time();

-- Step 11: updated_at trigger for feeds
CREATE OR REPLACE FUNCTION public.set_updated_at_fn()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at := now(); RETURN NEW; END; $$;

CREATE TRIGGER set_feeds_updated_at BEFORE UPDATE ON public.feeds FOR EACH ROW EXECUTE FUNCTION public.set_updated_at_fn();

-- Step 12: Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.feeds;

-- Step 13: Updated search_content RPC
CREATE OR REPLACE FUNCTION public.search_content(query_text text, result_limit int DEFAULT 20)
RETURNS TABLE(id uuid, content_type text, title text, excerpt text, category text, url text, published_at timestamptz, rank real)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT * FROM (
    SELECT a.id, a.content_type::text, a.title, a.excerpt, a.category, NULL::text as url, a.published_at,
           ts_rank(to_tsvector('english', coalesce(a.title,'') || ' ' || coalesce(a.excerpt,'') || ' ' || coalesce(a.body,'')), plainto_tsquery('english', query_text)) as rank
    FROM articles a WHERE a.status = 'published'
      AND to_tsvector('english', coalesce(a.title,'') || ' ' || coalesce(a.excerpt,'') || ' ' || coalesce(a.body,'')) @@ plainto_tsquery('english', query_text)
    UNION ALL
    SELECT f.id, f.feed_type::text, f.title, f.summary, f.category, f.link, f.published_at,
           ts_rank(to_tsvector('english', coalesce(f.title,'') || ' ' || coalesce(f.summary,'')), plainto_tsquery('english', query_text)) as rank
    FROM feeds f WHERE f.status = 'published'
      AND to_tsvector('english', coalesce(f.title,'') || ' ' || coalesce(f.summary,'')) @@ plainto_tsquery('english', query_text)
    UNION ALL
    SELECT b.id, 'bulletin'::text, b.title, b.description, NULL::text, NULL::text, b.published_at,
           ts_rank(to_tsvector('english', coalesce(b.title,'') || ' ' || coalesce(b.description,'')), plainto_tsquery('english', query_text)) as rank
    FROM bulletins b WHERE b.status = 'published'
      AND to_tsvector('english', coalesce(b.title,'') || ' ' || coalesce(b.description,'')) @@ plainto_tsquery('english', query_text)
    UNION ALL
    SELECT p.id, 'press'::text, p.title, NULL::text, p.medium, p.link, p.published_at,
           ts_rank(to_tsvector('english', coalesce(p.title,'')), plainto_tsquery('english', query_text)) as rank
    FROM press_items p WHERE p.status = 'published'
      AND to_tsvector('english', coalesce(p.title,'')) @@ plainto_tsquery('english', query_text)
  ) sub ORDER BY rank DESC LIMIT result_limit;
$$;
