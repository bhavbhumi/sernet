
-- Grant table permissions for ticket submission
GRANT SELECT, INSERT ON public.support_tickets TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.support_tickets TO authenticated;
