CREATE OR REPLACE FUNCTION public.subscribe_newsletter(_first_name text, _last_name text, _email text, _preferences jsonb)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path TO public AS $function$
DECLARE preference_values text[];
BEGIN
  IF _first_name IS NULL OR length(trim(_first_name)) = 0 OR length(_first_name) > 100 OR length(coalesce(_last_name,'')) > 100 OR _email IS NULL OR length(_email) > 255 THEN
    RAISE EXCEPTION 'Invalid input';
  END IF;
  IF _preferences IS NOT NULL AND jsonb_typeof(_preferences) <> 'array' THEN
    RAISE EXCEPTION 'Invalid preferences';
  END IF;
  SELECT coalesce(array_agg(value), ARRAY[]::text[]) INTO preference_values FROM jsonb_array_elements_text(coalesce(_preferences,'[]'::jsonb)) AS items(value);
  INSERT INTO public.newsletter_subscribers (first_name, last_name, email, preferences, status, subscribed_at, unsubscribed_at)
  VALUES (trim(_first_name), nullif(trim(coalesce(_last_name,'')),''), lower(trim(_email)), preference_values, 'active', now(), NULL)
  ON CONFLICT (email) DO NOTHING;
END $function$;