-- Insights taxonomy: Type (which Insights tab a post appears under) and Tags.
-- Columns were previously created ad hoc; this records them durably and is a no-op where they already exist.
alter table public.articles add column if not exists post_type text;
alter table public.articles add column if not exists tags text[] not null default '{}'::text[];
comment on column public.articles.post_type is 'Insights type tab: Macro & Markets, Investment, Insurance, Trading, Credit, Personal Finance';
comment on column public.articles.tags is 'Free-form tags shown on Insights cards and used for filtering';