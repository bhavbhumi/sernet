
-- Drop triggers first if any exist on these tables
DROP TRIGGER IF EXISTS set_updated_at ON public.analyses;
DROP TRIGGER IF EXISTS calc_read_time_analyses ON public.analyses;
DROP TRIGGER IF EXISTS set_updated_at ON public.reports;
DROP TRIGGER IF EXISTS calc_read_time_reports ON public.reports;

-- Drop the legacy tables
DROP TABLE IF EXISTS public.analyses CASCADE;
DROP TABLE IF EXISTS public.reports CASCADE;
