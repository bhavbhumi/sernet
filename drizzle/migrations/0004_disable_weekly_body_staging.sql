DROP TRIGGER IF EXISTS trg_apply_weekly_body ON public.weekly_body_staging;
REVOKE ALL ON public.weekly_body_staging FROM sandbox_exec;
COMMENT ON TABLE public.weekly_body_staging IS 'DEPRECATED: one-off import helper, unused';