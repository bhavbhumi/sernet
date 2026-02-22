
-- Fix search_path security warning
CREATE OR REPLACE FUNCTION public.validate_newsletter_email()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  IF NEW.email !~* '^[a-zA-Z0-9.!#$%&''*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$' THEN
    RAISE EXCEPTION 'Invalid email address: %', NEW.email;
  END IF;
  NEW.email := lower(trim(NEW.email));
  RETURN NEW;
END;
$$;
