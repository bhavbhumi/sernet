CREATE TABLE public.weekly_body_staging (id uuid PRIMARY KEY, body text NOT NULL);
GRANT INSERT, SELECT ON public.weekly_body_staging TO sandbox_exec;
GRANT ALL ON public.weekly_body_staging TO service_role;
ALTER TABLE public.weekly_body_staging ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sandbox insert" ON public.weekly_body_staging FOR INSERT TO sandbox_exec WITH CHECK (true);
CREATE POLICY "sandbox select" ON public.weekly_body_staging FOR SELECT TO sandbox_exec USING (true);
CREATE OR REPLACE FUNCTION public.apply_weekly_body_staging() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
BEGIN
  UPDATE public.articles SET body = NEW.body WHERE id = NEW.id AND content_type IS NOT NULL;
  RETURN NEW;
END $$;
CREATE TRIGGER trg_apply_weekly_body AFTER INSERT ON public.weekly_body_staging FOR EACH ROW EXECUTE FUNCTION public.apply_weekly_body_staging();