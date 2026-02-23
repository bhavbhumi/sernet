
-- Legal pages table for CMS-managed legal content
CREATE TABLE public.legal_pages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  body TEXT,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_by UUID REFERENCES auth.users(id),
  published_at TIMESTAMP WITH TIME ZONE
);

-- Seed default entries
INSERT INTO public.legal_pages (slug, title, body) VALUES
  ('terms', 'Terms & Conditions', ''),
  ('privacy', 'Privacy Policy', ''),
  ('policies', 'Policies & Procedures', ''),
  ('disclosures', 'Disclosures', '');

-- RLS
ALTER TABLE public.legal_pages ENABLE ROW LEVEL SECURITY;

-- Anyone can read
CREATE POLICY "Public read legal_pages" ON public.legal_pages
  FOR SELECT USING (true);

-- Only admins can update
CREATE POLICY "Admins update legal_pages" ON public.legal_pages
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

CREATE POLICY "Admins insert legal_pages" ON public.legal_pages
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin'))
  );
