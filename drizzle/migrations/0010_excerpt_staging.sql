CREATE TABLE public.excerpt_staging (id uuid PRIMARY KEY, excerpt text NOT NULL);
GRANT ALL ON public.excerpt_staging TO service_role;
ALTER TABLE public.excerpt_staging ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage excerpt staging" ON public.excerpt_staging FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE OR REPLACE FUNCTION public.apply_excerpt_staging() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public' AS $$
BEGIN
  UPDATE public.articles SET excerpt = NEW.excerpt WHERE id = NEW.id;
  RETURN NEW;
END $$;
REVOKE EXECUTE ON FUNCTION public.apply_excerpt_staging() FROM PUBLIC, anon, authenticated;
CREATE TRIGGER apply_excerpt_staging_trg AFTER INSERT ON public.excerpt_staging FOR EACH ROW EXECUTE FUNCTION public.apply_excerpt_staging();