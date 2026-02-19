
-- Add tab_name column to site_pages
ALTER TABLE public.site_pages ADD COLUMN IF NOT EXISTS tab_name text;

-- Add trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_site_pages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

DROP TRIGGER IF EXISTS trg_site_pages_updated_at ON public.site_pages;
CREATE TRIGGER trg_site_pages_updated_at
  BEFORE UPDATE ON public.site_pages
  FOR EACH ROW EXECUTE FUNCTION public.update_site_pages_updated_at();
