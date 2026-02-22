
-- Validation trigger to reject invalid email formats
CREATE OR REPLACE FUNCTION public.validate_newsletter_email()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- RFC-compliant email regex
  IF NEW.email !~* '^[a-zA-Z0-9.!#$%&''*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$' THEN
    RAISE EXCEPTION 'Invalid email address: %', NEW.email;
  END IF;
  
  -- Normalize email to lowercase
  NEW.email := lower(trim(NEW.email));
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_validate_newsletter_email
  BEFORE INSERT OR UPDATE ON public.newsletter_subscribers
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_newsletter_email();
