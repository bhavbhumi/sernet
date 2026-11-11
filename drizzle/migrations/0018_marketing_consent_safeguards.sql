ALTER TABLE public.newsletter_subscribers ADD COLUMN consent_evidence text, ADD COLUMN consent_recorded_at timestamptz, ADD COLUMN consent_recorded_by uuid;
ALTER TABLE public.newsletter_subscribers ALTER COLUMN preferences SET DEFAULT ARRAY['resources','articles','promotions']::text[];
CREATE OR REPLACE FUNCTION public.guard_newsletter_consent() RETURNS trigger LANGUAGE plpgsql SET search_path=public AS $$
BEGIN
 NEW.preferences := ARRAY(SELECT DISTINCT CASE WHEN p='promotion' THEN 'promotions' ELSE p END FROM unnest(NEW.preferences) p);
 IF TG_OP='INSERT' THEN NEW.subscribed_at:=coalesce(NEW.subscribed_at,now()); END IF;
 IF NEW.status='unsubscribed' THEN
   IF TG_OP='INSERT' THEN NEW.unsubscribed_at:=coalesce(NEW.unsubscribed_at,now());
   ELSIF OLD.status IS DISTINCT FROM NEW.status THEN NEW.unsubscribed_at:=now(); END IF;
 ELSIF NEW.status='active' THEN
   IF TG_OP='INSERT' OR OLD.status IS DISTINCT FROM NEW.status OR OLD.consent_evidence IS DISTINCT FROM NEW.consent_evidence THEN
     IF nullif(trim(NEW.consent_evidence),'') IS NULL THEN RAISE EXCEPTION 'Record subscription permission evidence before activation'; END IF;
     NEW.consent_recorded_at:=now(); NEW.consent_recorded_by:=auth.uid(); NEW.unsubscribed_at:=NULL;
   END IF;
 END IF;
 RETURN NEW;
END $$;
CREATE TRIGGER guard_newsletter_consent BEFORE INSERT OR UPDATE ON public.newsletter_subscribers FOR EACH ROW EXECUTE FUNCTION public.guard_newsletter_consent();
CREATE OR REPLACE FUNCTION public.subscribe_newsletter(_first_name text, _last_name text, _email text, _preferences jsonb) RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE preference_values text[];
BEGIN
 IF _first_name IS NULL OR length(trim(_first_name))=0 OR length(_first_name)>100 OR length(coalesce(_last_name,''))>100 OR _email IS NULL OR length(_email)>255 THEN RAISE EXCEPTION 'Invalid input'; END IF;
 IF _preferences IS NULL OR jsonb_typeof(_preferences)<>'array' OR jsonb_array_length(_preferences)=0 THEN RAISE EXCEPTION 'Choose at least one preference'; END IF;
 SELECT array_agg(DISTINCT CASE WHEN value='promotion' THEN 'promotions' ELSE value END) INTO preference_values FROM jsonb_array_elements_text(_preferences) items(value);
 IF NOT preference_values <@ ARRAY['resources','articles','promotions']::text[] THEN RAISE EXCEPTION 'Invalid preferences'; END IF;
 INSERT INTO public.newsletter_subscribers(first_name,last_name,email,preferences,status,subscribed_at,unsubscribed_at,consent_evidence) VALUES(trim(_first_name),nullif(trim(coalesce(_last_name,'')),''),lower(trim(_email)),preference_values,'active',now(),NULL,'Public newsletter form: submitted selected preferences') ON CONFLICT(email) DO NOTHING;
END $$;
REVOKE INSERT ON public.newsletter_subscribers FROM anon;
DROP POLICY "Anyone can subscribe to newsletter" ON public.newsletter_subscribers;
CREATE POLICY "Admins can insert newsletter subscribers" ON public.newsletter_subscribers FOR INSERT TO authenticated WITH CHECK(public.is_admin(auth.uid()));
CREATE OR REPLACE FUNCTION public.guard_lead_handoff() RETURNS trigger LANGUAGE plpgsql SET search_path=public AS $$
DECLARE evidence text;
BEGIN
 evidence:=nullif(trim(NEW.context->>'contact_permission_evidence'),'');
 IF NEW.contact_permission='permitted' AND (TG_OP='INSERT' OR OLD.contact_permission IS DISTINCT FROM NEW.contact_permission OR OLD.context->>'contact_permission_evidence' IS DISTINCT FROM evidence OR NEW.handoff_status IN ('ready','accepted')) THEN
   IF evidence IS NULL THEN RAISE EXCEPTION 'Contact permission evidence is required'; END IF;
   IF TG_OP='INSERT' OR OLD.contact_permission IS DISTINCT FROM NEW.contact_permission OR OLD.context->>'contact_permission_evidence' IS DISTINCT FROM evidence THEN
     NEW.context:=coalesce(NEW.context,'{}'::jsonb)||jsonb_build_object('contact_permission_recorded_at',now(),'contact_permission_recorded_by',auth.uid());
   END IF;
 END IF;
 IF NEW.handoff_status IN ('ready','accepted') AND (NEW.qualification_status<>'qualified' OR NEW.contact_permission<>'permitted' OR NEW.assigned_to IS NULL OR evidence IS NULL) THEN RAISE EXCEPTION 'Qualification, evidenced contact permission and Sales owner are required'; END IF;
 RETURN NEW;
END $$;