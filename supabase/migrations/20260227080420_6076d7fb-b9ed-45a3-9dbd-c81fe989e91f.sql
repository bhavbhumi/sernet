-- Add source_url for deduplication (replaces media_url misuse for imported articles)
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS source_url text;

-- Add SEO meta fields
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS meta_title text;
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS meta_description text;

-- Create index on source_url for dedup lookups
CREATE INDEX IF NOT EXISTS idx_articles_source_url ON public.articles (source_url) WHERE source_url IS NOT NULL;

-- Migrate existing data: move blog URLs from media_url to source_url
UPDATE public.articles
SET source_url = media_url,
    media_url = NULL
WHERE media_url LIKE 'https://sernetindia.com/blog/%';

-- Also fix thumbnail_url that contains blog URLs instead of image URLs
UPDATE public.articles
SET thumbnail_url = NULL
WHERE thumbnail_url LIKE 'https://sernetindia.com/blog/%'
  AND thumbnail_url NOT LIKE '%.png%'
  AND thumbnail_url NOT LIKE '%.jpg%'
  AND thumbnail_url NOT LIKE '%.jpeg%'
  AND thumbnail_url NOT LIKE '%.webp%';