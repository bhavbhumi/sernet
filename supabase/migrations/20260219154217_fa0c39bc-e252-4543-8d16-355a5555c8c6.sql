
-- Add item_date to articles table (the actual date the article was written/released)
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS item_date date NULL;

-- Add item_date to analyses table
ALTER TABLE public.analyses ADD COLUMN IF NOT EXISTS item_date date NULL;
