CREATE TABLE IF NOT EXISTS public.internal_config (key text PRIMARY KEY, value text NOT NULL);
GRANT ALL ON public.internal_config TO service_role;
REVOKE ALL ON public.internal_config FROM anon, authenticated;
ALTER TABLE public.internal_config ENABLE ROW LEVEL SECURITY;
INSERT INTO public.internal_config (key, value)
VALUES ('workflow_secret', replace(gen_random_uuid()::text || gen_random_uuid()::text, '-', ''))
ON CONFLICT (key) DO NOTHING;

CREATE OR REPLACE FUNCTION public.fire_workflow_engine()
 RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
DECLARE _payload jsonb; _url text; _anon_key text; _secret text;
BEGIN
  _url := coalesce(nullif(current_setting('app.settings.supabase_url', true), ''), 'https://mmlovfyrjynvofhbnfqq.supabase.co');
  _anon_key := coalesce(nullif(current_setting('app.settings.supabase_anon_key', true), ''), 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1tbG92Znlyanludm9maGJuZnFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0OTQ2MjYsImV4cCI6MjA4NzA3MDYyNn0.FyrwKDoFub590eCNqkJ-qBfctlBJ4FOaZoHxbOvXhww');
  SELECT value INTO _secret FROM public.internal_config WHERE key = 'workflow_secret';
  _payload := jsonb_build_object(
    'entity_type', TG_TABLE_NAME,
    'trigger_event', lower(TG_OP),
    'record', jsonb_build_object('id', NEW.id),
    'old_record', CASE WHEN TG_OP = 'UPDATE' THEN to_jsonb(OLD) ELSE NULL END
  );
  PERFORM net.http_post(
    url := _url || '/functions/v1/workflow-engine',
    headers := jsonb_build_object('Content-Type', 'application/json', 'Authorization', 'Bearer ' || _anon_key, 'x-workflow-secret', coalesce(_secret, '')),
    body := _payload
  );
  RETURN NEW;
END;
$function$;

-- Newsletter: never overwrite or reactivate an existing subscriber from the public form
CREATE OR REPLACE FUNCTION public.subscribe_newsletter(_first_name text, _last_name text, _email text, _preferences jsonb)
 RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
BEGIN
  IF _first_name IS NULL OR length(trim(_first_name)) = 0 OR length(_first_name) > 100 OR length(coalesce(_last_name,'')) > 100 OR length(_email) > 255 THEN
    RAISE EXCEPTION 'Invalid input';
  END IF;
  INSERT INTO newsletter_subscribers (first_name, last_name, email, preferences, status, subscribed_at, unsubscribed_at)
  VALUES (trim(_first_name), nullif(trim(coalesce(_last_name,'')),''), _email, coalesce(_preferences,'[]'::jsonb), 'active', now(), NULL)
  ON CONFLICT (email) DO NOTHING;
END $function$;

-- Profiles: only staff may change account status or user type
CREATE OR REPLACE FUNCTION public.protect_profile_status()
 RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
BEGIN
  IF auth.uid() IS NOT NULL AND NOT public.is_admin(auth.uid())
     AND (NEW.status IS DISTINCT FROM OLD.status OR NEW.user_type IS DISTINCT FROM OLD.user_type OR NEW.user_id IS DISTINCT FROM OLD.user_id) THEN
    RAISE EXCEPTION 'Not allowed to change account status';
  END IF;
  RETURN NEW;
END $function$;
DROP TRIGGER IF EXISTS trg_protect_profile_status ON public.profiles;
CREATE TRIGGER trg_protect_profile_status BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.protect_profile_status();

-- Deal transition check: staff only
CREATE OR REPLACE FUNCTION public.validate_deal_transition(_deal_id uuid, _to_stage crm_stage, _to_sub_status crm_sub_status)
 RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path TO 'public'
AS $function$
DECLARE
  _deal RECORD; _allowed boolean; _requires_approval boolean; _errors text[] := '{}'; _req RECORD; _field_value text;
BEGIN
  IF NOT public.has_department_access(auth.uid(), 'sales') THEN
    RAISE EXCEPTION 'Not authorised';
  END IF;
  SELECT * INTO _deal FROM public.crm_deals WHERE id = _deal_id;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('allowed', false, 'errors', ARRAY['Deal not found']);
  END IF;
  IF _deal.stage = _to_stage AND _deal.sub_status = _to_sub_status THEN
    RETURN jsonb_build_object('allowed', true, 'errors', '{}', 'requires_approval', false);
  END IF;
  SELECT EXISTS (SELECT 1 FROM public.crm_transition_rules WHERE is_active = true AND from_stage = _deal.stage
      AND (from_sub_status IS NULL OR from_sub_status = _deal.sub_status) AND to_stage = _to_stage AND to_sub_status = _to_sub_status) INTO _allowed;
  IF NOT _allowed THEN
    _errors := array_append(_errors, 'Transition from ' || _deal.stage || '/' || _deal.sub_status || ' to ' || _to_stage || '/' || _to_sub_status || ' is not allowed');
  END IF;
  SELECT COALESCE(bool_or(requires_approval), false) INTO _requires_approval FROM public.crm_transition_rules
  WHERE is_active = true AND from_stage = _deal.stage AND (from_sub_status IS NULL OR from_sub_status = _deal.sub_status)
    AND to_stage = _to_stage AND to_sub_status = _to_sub_status;
  FOR _req IN SELECT required_field, field_label FROM public.crm_stage_requirements
    WHERE is_active = true AND stage = _to_stage AND (sub_status IS NULL OR sub_status = _to_sub_status)
  LOOP
    EXECUTE format('SELECT COALESCE(NULLIF(CAST(%I AS text), ''''), NULL) FROM public.crm_deals WHERE id = $1', _req.required_field)
      INTO _field_value USING _deal_id;
    IF _field_value IS NULL OR _field_value = '0' THEN
      _errors := array_append(_errors, _req.field_label);
    END IF;
  END LOOP;
  RETURN jsonb_build_object('allowed', (array_length(_errors, 1) IS NULL), 'errors', _errors, 'requires_approval', _requires_approval);
END;
$function$;
REVOKE EXECUTE ON FUNCTION public.validate_deal_transition(uuid, crm_stage, crm_sub_status) FROM anon, public;