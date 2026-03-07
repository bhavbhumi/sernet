
-- Fix search_path for new functions
ALTER FUNCTION public.calc_read_time() SET search_path = public;
ALTER FUNCTION public.set_updated_at_fn() SET search_path = public;
