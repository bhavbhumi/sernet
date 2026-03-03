-- Attach the generate_ticket_number trigger to support_tickets table
CREATE TRIGGER trg_generate_ticket_number
  BEFORE INSERT ON public.support_tickets
  FOR EACH ROW
  WHEN (NEW.ticket_number IS NULL OR NEW.ticket_number = '')
  EXECUTE FUNCTION public.generate_ticket_number();

-- Also attach update_updated_at triggers for support tables
CREATE TRIGGER trg_support_tickets_updated_at
  BEFORE UPDATE ON public.support_tickets
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_support_issue_types_updated_at
  BEFORE UPDATE ON public.support_issue_types
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Make ticket_number have a default so inserts without it don't fail
ALTER TABLE public.support_tickets ALTER COLUMN ticket_number SET DEFAULT '';