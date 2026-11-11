CREATE SEQUENCE public.support_ticket_number_seq;

GRANT ALL ON SEQUENCE public.support_ticket_number_seq TO service_role;

SELECT setval(
  'public.support_ticket_number_seq',
  COALESCE(MAX(CAST(NULLIF(regexp_replace(ticket_number, '[^0-9]', '', 'g'), '') AS INTEGER)), 1),
  COUNT(*) > 0
) FROM public.support_tickets;

CREATE OR REPLACE FUNCTION public.generate_ticket_number()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  NEW.ticket_number := 'TKT-' || LPAD(nextval('public.support_ticket_number_seq')::TEXT, 5, '0');
  RETURN NEW;
END;
$$;

COMMENT ON SEQUENCE public.support_ticket_number_seq IS 'Monotonic support ticket numbers; independent of RLS and retained after ticket deletion.';