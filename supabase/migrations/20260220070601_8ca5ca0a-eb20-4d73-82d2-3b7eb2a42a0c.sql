
-- Enable pg_trgm for trigram-based fuzzy matching (completely free, built-in)
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- GIN indexes for full-text search on articles
CREATE INDEX IF NOT EXISTS articles_fts_idx 
ON public.articles USING gin(
  to_tsvector('english', 
    coalesce(title, '') || ' ' || 
    coalesce(excerpt, '') || ' ' || 
    coalesce(category, '') || ' ' || 
    coalesce(author, '')
  )
);

-- GIN indexes for analyses
CREATE INDEX IF NOT EXISTS analyses_fts_idx 
ON public.analyses USING gin(
  to_tsvector('english', 
    coalesce(title, '') || ' ' || 
    coalesce(excerpt, '') || ' ' || 
    coalesce(category, '') || ' ' || 
    coalesce(author, '')
  )
);

-- GIN indexes for circulars
CREATE INDEX IF NOT EXISTS circulars_fts_idx 
ON public.circulars USING gin(
  to_tsvector('english', 
    coalesce(title, '') || ' ' || 
    coalesce(summary, '') || ' ' || 
    coalesce(source, '') || ' ' || 
    coalesce(category, '')
  )
);

-- GIN indexes for news_items
CREATE INDEX IF NOT EXISTS news_items_fts_idx 
ON public.news_items USING gin(
  to_tsvector('english', 
    coalesce(title, '') || ' ' || 
    coalesce(summary, '') || ' ' || 
    coalesce(source, '') || ' ' || 
    coalesce(category, '')
  )
);

-- GIN indexes for bulletins
CREATE INDEX IF NOT EXISTS bulletins_fts_idx 
ON public.bulletins USING gin(
  to_tsvector('english', 
    coalesce(title, '') || ' ' || 
    coalesce(description, '')
  )
);

-- Trigram indexes for partial/fuzzy matching on titles
CREATE INDEX IF NOT EXISTS articles_title_trgm_idx ON public.articles USING gin(title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS analyses_title_trgm_idx ON public.analyses USING gin(title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS circulars_title_trgm_idx ON public.circulars USING gin(title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS news_items_title_trgm_idx ON public.news_items USING gin(title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS bulletins_title_trgm_idx ON public.bulletins USING gin(title gin_trgm_ops);

-- Create a database function for semantic search across all content tables
CREATE OR REPLACE FUNCTION public.search_content(
  query_text text,
  result_limit int DEFAULT 5
)
RETURNS TABLE (
  id uuid,
  content_type text,
  title text,
  excerpt text,
  category text,
  url text,
  published_at timestamptz,
  rank real
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  ts_query tsquery;
BEGIN
  -- Build a tsquery from input, fallback to simple LIKE if parsing fails
  BEGIN
    ts_query := plainto_tsquery('english', query_text);
  EXCEPTION WHEN OTHERS THEN
    ts_query := plainto_tsquery('english', quote_literal(query_text));
  END;

  RETURN QUERY
  -- Search articles
  SELECT
    a.id,
    'article'::text AS content_type,
    a.title,
    coalesce(a.excerpt, left(a.body, 200)) AS excerpt,
    a.category,
    ('/article/' || a.id)::text AS url,
    a.published_at,
    ts_rank(
      to_tsvector('english', coalesce(a.title,'') || ' ' || coalesce(a.excerpt,'') || ' ' || coalesce(a.category,'')),
      ts_query
    ) AS rank
  FROM public.articles a
  WHERE a.status = 'published'
    AND (
      ts_query @@ to_tsvector('english', coalesce(a.title,'') || ' ' || coalesce(a.excerpt,'') || ' ' || coalesce(a.category,'') || ' ' || coalesce(a.author,''))
      OR a.title ILIKE ('%' || query_text || '%')
    )

  UNION ALL

  -- Search analyses
  SELECT
    an.id,
    'analysis'::text AS content_type,
    an.title,
    coalesce(an.excerpt, left(an.body, 200)) AS excerpt,
    an.category,
    ('/analysis/' || an.id)::text AS url,
    an.published_at,
    ts_rank(
      to_tsvector('english', coalesce(an.title,'') || ' ' || coalesce(an.excerpt,'') || ' ' || coalesce(an.category,'')),
      ts_query
    ) AS rank
  FROM public.analyses an
  WHERE an.status = 'published'
    AND (
      ts_query @@ to_tsvector('english', coalesce(an.title,'') || ' ' || coalesce(an.excerpt,'') || ' ' || coalesce(an.category,'') || ' ' || coalesce(an.author,''))
      OR an.title ILIKE ('%' || query_text || '%')
    )

  UNION ALL

  -- Search circulars
  SELECT
    c.id,
    'circular'::text AS content_type,
    c.title,
    coalesce(c.summary, '') AS excerpt,
    c.category,
    coalesce(c.link, '') AS url,
    c.published_at,
    ts_rank(
      to_tsvector('english', coalesce(c.title,'') || ' ' || coalesce(c.summary,'') || ' ' || coalesce(c.category,'')),
      ts_query
    ) AS rank
  FROM public.circulars c
  WHERE c.status = 'published'
    AND (
      ts_query @@ to_tsvector('english', coalesce(c.title,'') || ' ' || coalesce(c.summary,'') || ' ' || coalesce(c.source,'') || ' ' || coalesce(c.category,''))
      OR c.title ILIKE ('%' || query_text || '%')
    )

  UNION ALL

  -- Search news_items
  SELECT
    ni.id,
    'news'::text AS content_type,
    ni.title,
    coalesce(ni.summary, '') AS excerpt,
    ni.category,
    coalesce(ni.link, '') AS url,
    ni.published_at,
    ts_rank(
      to_tsvector('english', coalesce(ni.title,'') || ' ' || coalesce(ni.summary,'') || ' ' || coalesce(ni.category,'')),
      ts_query
    ) AS rank
  FROM public.news_items ni
  WHERE ni.status = 'published'
    AND (
      ts_query @@ to_tsvector('english', coalesce(ni.title,'') || ' ' || coalesce(ni.summary,'') || ' ' || coalesce(ni.source,'') || ' ' || coalesce(ni.category,''))
      OR ni.title ILIKE ('%' || query_text || '%')
    )

  UNION ALL

  -- Search bulletins
  SELECT
    b.id,
    'bulletin'::text AS content_type,
    b.title,
    b.description AS excerpt,
    'Bulletin'::text AS category,
    ''::text AS url,
    b.published_at,
    ts_rank(
      to_tsvector('english', coalesce(b.title,'') || ' ' || coalesce(b.description,'')),
      ts_query
    ) AS rank
  FROM public.bulletins b
  WHERE b.status = 'published'
    AND (
      ts_query @@ to_tsvector('english', coalesce(b.title,'') || ' ' || coalesce(b.description,''))
      OR b.title ILIKE ('%' || query_text || '%')
    )

  ORDER BY rank DESC, published_at DESC
  LIMIT result_limit;
END;
$$;

-- Allow public to call this search function
GRANT EXECUTE ON FUNCTION public.search_content(text, int) TO anon, authenticated;
