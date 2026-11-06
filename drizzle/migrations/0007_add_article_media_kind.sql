ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS media_kind text NOT NULL DEFAULT 'image_text';
UPDATE public.articles SET media_kind = CASE
  WHEN media_url ~* '\.(mp3|wav|m4a|ogg|aac)(\?|$)' THEN 'audio'
  WHEN media_url ~* '\.(mp4|webm|mov)(\?|$)|youtu' THEN 'video'
  WHEN coalesce(thumbnail_url, media_url) IS NULL THEN 'text'
  ELSE 'image_text' END;
ALTER TABLE public.articles ADD CONSTRAINT articles_media_kind_chk CHECK (media_kind IN ('text','image_text','image','gif','video','audio'));
CREATE INDEX IF NOT EXISTS idx_articles_media_kind ON public.articles(media_kind);
COMMENT ON COLUMN public.articles.content_type IS 'Legacy kind; kept for URLs only. Use media_kind + post_type/category/sub_category.';
COMMENT ON COLUMN public.articles.format IS 'DEPRECATED: replaced by media_kind';