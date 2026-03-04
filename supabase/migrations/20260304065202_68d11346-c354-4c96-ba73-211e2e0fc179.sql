
ALTER TABLE public.kb_articles
  ADD COLUMN IF NOT EXISTS issue_code text,
  ADD COLUMN IF NOT EXISTS category_code text,
  ADD COLUMN IF NOT EXISTS product text DEFAULT 'all',
  ADD COLUMN IF NOT EXISTS sub_product text,
  ADD COLUMN IF NOT EXISTS issue_type text,
  ADD COLUMN IF NOT EXISTS issue_short_description text,
  ADD COLUMN IF NOT EXISTS priority text DEFAULT 'standard',
  ADD COLUMN IF NOT EXISTS owner_team text DEFAULT 'support',
  ADD COLUMN IF NOT EXISTS escalation_level integer DEFAULT 1,
  ADD COLUMN IF NOT EXISTS regulatory_tag text,
  ADD COLUMN IF NOT EXISTS impact_type text DEFAULT 'operational',
  ADD COLUMN IF NOT EXISTS question_variants text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS short_summary text,
  ADD COLUMN IF NOT EXISTS possible_reasons text,
  ADD COLUMN IF NOT EXISTS what_to_check text,
  ADD COLUMN IF NOT EXISTS resolution_steps text,
  ADD COLUMN IF NOT EXISTS documents_required text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS resolution_timeline text,
  ADD COLUMN IF NOT EXISTS when_to_raise_ticket text,
  ADD COLUMN IF NOT EXISTS internal_escalation_note text,
  ADD COLUMN IF NOT EXISTS search_keywords text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS suggested_article_group text,
  ADD COLUMN IF NOT EXISTS visibility text DEFAULT 'public';

CREATE INDEX IF NOT EXISTS idx_kb_articles_product ON public.kb_articles(product);
CREATE INDEX IF NOT EXISTS idx_kb_articles_issue_code ON public.kb_articles(issue_code);
CREATE INDEX IF NOT EXISTS idx_kb_articles_suggested_group ON public.kb_articles(suggested_article_group);
