-- Create a generic function that fires the workflow-engine edge function via pg_net
-- whenever a relevant table row is inserted or updated.
CREATE OR REPLACE FUNCTION public.fire_workflow_engine()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  _payload jsonb;
  _url text;
  _anon_key text;
BEGIN
  _url := current_setting('app.settings.supabase_url', true);
  _anon_key := current_setting('app.settings.supabase_anon_key', true);

  -- If settings not available, use hardcoded project URL
  IF _url IS NULL OR _url = '' THEN
    _url := 'https://mmlovfyrjynvofhbnfqq.supabase.co';
  END IF;
  IF _anon_key IS NULL OR _anon_key = '' THEN
    _anon_key := 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1tbG92Znlyanludm9maGJuZnFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0OTQ2MjYsImV4cCI6MjA4NzA3MDYyNn0.FyrwKDoFub590eCNqkJ-qBfctlBJ4FOaZoHxbOvXhww';
  END IF;

  _payload := jsonb_build_object(
    'entity_type', TG_TABLE_NAME,
    'trigger_event', lower(TG_OP),
    'record', to_jsonb(NEW),
    'old_record', CASE WHEN TG_OP = 'UPDATE' THEN to_jsonb(OLD) ELSE NULL END
  );

  PERFORM net.http_post(
    url := _url || '/functions/v1/workflow-engine',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || _anon_key
    ),
    body := _payload
  );

  RETURN NEW;
END;
$$;

-- Wire triggers for entities that have workflow rules
-- CRM Deals (5 rules)
CREATE TRIGGER trg_workflow_crm_deals
  AFTER INSERT OR UPDATE ON public.crm_deals
  FOR EACH ROW
  EXECUTE FUNCTION public.fire_workflow_engine();

-- Support Tickets (2 rules)
CREATE TRIGGER trg_workflow_support_tickets
  AFTER INSERT OR UPDATE ON public.support_tickets
  FOR EACH ROW
  EXECUTE FUNCTION public.fire_workflow_engine();

-- Portal Profiles (1 rule)
CREATE TRIGGER trg_workflow_profiles
  AFTER INSERT OR UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.fire_workflow_engine();