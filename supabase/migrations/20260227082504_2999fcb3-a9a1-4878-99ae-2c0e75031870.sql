
-- Add source_url column to analyses for deduplication and re-scraping
ALTER TABLE public.analyses ADD COLUMN IF NOT EXISTS source_url text;

-- Create index for efficient deduplication
CREATE INDEX IF NOT EXISTS idx_analyses_source_url ON public.analyses(source_url) WHERE source_url IS NOT NULL;
