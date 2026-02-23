INSERT INTO public.legal_pages (slug, title, body, updated_at)
VALUES ('investor-charter', 'Investor Charter', '', now())
ON CONFLICT (slug) DO NOTHING;