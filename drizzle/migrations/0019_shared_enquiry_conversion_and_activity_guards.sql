ALTER TABLE public.leads ADD COLUMN converted_contact_id uuid REFERENCES public.crm_contacts(id);
ALTER TABLE public.crm_activities ADD COLUMN lead_id uuid REFERENCES public.leads(id);
ALTER TABLE public.newsletter_subscribers ADD COLUMN lead_id uuid REFERENCES public.leads(id);
CREATE INDEX crm_activities_lead_idx ON public.crm_activities(lead_id);
CREATE OR REPLACE FUNCTION public.can_work_leads(_module text) RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public AS $$
 SELECT auth.uid() IS NOT NULL AND EXISTS(SELECT 1 FROM public.user_roles r WHERE r.user_id=auth.uid() AND (r.role='super_admin' OR (EXISTS(SELECT 1 FROM public.staff_permissions p WHERE p.user_id=r.user_id AND _module=ANY(p.allowed_modules))) OR (NOT EXISTS(SELECT 1 FROM public.staff_permissions p WHERE p.user_id=r.user_id) AND (r.department IS NULL OR r.department::text=split_part(_module,'/',1)))));
$$;
REVOKE ALL ON FUNCTION public.can_work_leads(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.can_work_leads(text) TO authenticated;
CREATE OR REPLACE FUNCTION public.is_sales_supervisor() RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path=public AS $$ SELECT EXISTS(SELECT 1 FROM public.user_roles WHERE user_id=auth.uid() AND (role='super_admin' OR (role='admin' AND (department IS NULL OR department='sales')))) AND public.can_work_leads('sales/crm'); $$;
REVOKE ALL ON FUNCTION public.is_sales_supervisor() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_sales_supervisor() TO authenticated;
CREATE OR REPLACE FUNCTION public.guard_lead_handoff() RETURNS trigger LANGUAGE plpgsql SET search_path=public AS $$
DECLARE evidence text;
BEGIN
 evidence:=nullif(trim(NEW.context->>'contact_permission_evidence'),'');
 IF TG_OP='INSERT' AND auth.uid() IS NULL AND (NEW.converted_contact_id IS NOT NULL OR NEW.status<>'new' OR NEW.handoff_status<>'marketing') THEN RAISE EXCEPTION 'Public enquiries cannot be promoted'; END IF;
 IF TG_OP='UPDATE' AND (NEW.handoff_status IS DISTINCT FROM OLD.handoff_status OR NEW.qualification_status IS DISTINCT FROM OLD.qualification_status OR NEW.contact_permission IS DISTINCT FROM OLD.contact_permission OR NEW.assigned_to IS DISTINCT FROM OLD.assigned_to) THEN
  IF NOT (public.can_work_leads('marketing/campaigns') OR public.can_work_leads('sales/crm')) THEN RAISE EXCEPTION 'Lead workflow access required'; END IF;
  IF NEW.handoff_status='accepted' AND OLD.handoff_status IS DISTINCT FROM NEW.handoff_status THEN
   IF OLD.handoff_status<>'ready' OR NOT public.can_work_leads('sales/crm') OR (auth.uid() IS DISTINCT FROM OLD.assigned_to AND NOT public.is_sales_supervisor()) THEN RAISE EXCEPTION 'Only assigned Sales owner or Sales supervisor may accept a ready handoff'; END IF;
   IF NEW.assigned_to IS DISTINCT FROM OLD.assigned_to THEN RAISE EXCEPTION 'Save owner changes before accepting'; END IF;
  END IF;
  IF OLD.handoff_status='accepted' AND NEW.handoff_status='marketing' THEN RAISE EXCEPTION 'Return the lead explicitly rather than resetting an accepted handoff'; END IF;
  IF NEW.handoff_status='ready' AND OLD.handoff_status IS DISTINCT FROM NEW.handoff_status THEN NEW.handoff_at:=now(); END IF;
 END IF;
 IF TG_OP='UPDATE' AND OLD.handoff_status='accepted' AND NEW.handoff_status='accepted' AND NEW.assigned_to IS DISTINCT FROM OLD.assigned_to THEN RAISE EXCEPTION 'Return the lead before changing its accepted owner'; END IF;
 IF NEW.contact_permission='permitted' THEN
  IF evidence IS NULL THEN RAISE EXCEPTION 'Contact permission evidence is required'; END IF;
  IF TG_OP='INSERT' OR OLD.contact_permission IS DISTINCT FROM NEW.contact_permission OR OLD.context->>'contact_permission_evidence' IS DISTINCT FROM evidence THEN NEW.context:=coalesce(NEW.context,'{}'::jsonb)||jsonb_build_object('contact_permission_recorded_at',now(),'contact_permission_recorded_by',auth.uid()); END IF;
 END IF;
 IF NEW.handoff_status IN ('ready','accepted') AND (NEW.qualification_status<>'qualified' OR NEW.contact_permission<>'permitted' OR NEW.assigned_to IS NULL OR evidence IS NULL) THEN RAISE EXCEPTION 'Qualification, evidenced contact permission and Sales owner are required'; END IF;
 IF NEW.status='converted' AND NEW.converted_contact_id IS NULL AND (TG_OP='INSERT' OR OLD.status IS DISTINCT FROM NEW.status) THEN RAISE EXCEPTION 'Convert through the guarded contact action'; END IF;
 RETURN NEW;
END $$;
CREATE OR REPLACE FUNCTION public.convert_shared_lead(_lead uuid,_relationship public.contact_relationship DEFAULT 'client',_pan text DEFAULT NULL,_city text DEFAULT NULL) RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE l public.leads%ROWTYPE; n text; ph text; em text; contact uuid; matches integer;
BEGIN
 IF NOT public.can_work_leads('sales/crm') THEN RAISE EXCEPTION 'Sales CRM access required'; END IF;
 SELECT * INTO l FROM public.leads WHERE id=_lead FOR UPDATE;
 IF NOT FOUND THEN RAISE EXCEPTION 'Lead not found'; END IF;
 IF l.handoff_status<>'accepted' OR l.qualification_status<>'qualified' OR l.contact_permission<>'permitted' OR nullif(trim(l.context->>'contact_permission_evidence'),'') IS NULL OR l.assigned_to IS NULL THEN RAISE EXCEPTION 'Accept a qualified, permitted and assigned lead before conversion'; END IF;
 IF auth.uid() IS DISTINCT FROM l.assigned_to AND NOT public.is_sales_supervisor() THEN RAISE EXCEPTION 'Only assigned owner or Sales supervisor may convert'; END IF;
 IF length(coalesce(_city,''))>150 OR (nullif(_pan,'') IS NOT NULL AND upper(_pan)!~'^[A-Z]{5}[0-9]{4}[A-Z]$') THEN RAISE EXCEPTION 'Invalid PAN or city'; END IF;
 IF l.converted_contact_id IS NOT NULL THEN RETURN l.converted_contact_id; END IF;
 IF l.source='referral' THEN n:=nullif(trim(l.context->>'referee_name'),'');ph:=nullif(trim(l.context->>'referee_phone'),'');em:=nullif(lower(trim(l.context->>'referee_email')),''); ELSE n:=l.name;ph:=l.phone;em:=nullif(lower(trim(l.email)),''); END IF;
 IF n IS NULL OR ph IS NULL THEN RAISE EXCEPTION 'Prospect name and phone are required; do not convert the referrer'; END IF;
 PERFORM pg_advisory_xact_lock(hashtextextended('shared-contact-conversion',0));
 SELECT count(*),(array_agg(id ORDER BY created_at))[1] INTO matches,contact FROM public.crm_contacts WHERE lead_id=l.id OR (relationship_type=_relationship AND ( (nullif(_pan,'') IS NOT NULL AND upper(pan)=upper(_pan)) OR (em IS NOT NULL AND lower(trim(email))=em) OR (regexp_replace(phone,'[^0-9]','','g')=regexp_replace(ph,'[^0-9]','','g') AND lower(trim(full_name))=lower(trim(n))) ));
 IF matches>1 THEN RAISE EXCEPTION 'Multiple matching contacts; review duplicates before converting'; END IF;
 IF matches=0 THEN INSERT INTO public.crm_contacts(full_name,phone,email,pan,city,relationship_type,source,lead_id,assigned_to,created_by) VALUES(n,ph,em,nullif(upper(_pan),''),nullif(trim(_city),''),_relationship,'lead_conversion',l.id,l.assigned_to,auth.uid()) RETURNING id INTO contact; END IF;
 UPDATE public.leads SET status='converted',converted_contact_id=contact WHERE id=l.id;
 INSERT INTO public.audit_logs(user_id,action,entity_type,entity_id,details,source) VALUES(auth.uid(),'convert','leads',l.id::text,jsonb_build_object('contact_id',contact,'reused',matches=1),'shared_lead_workflow');
 RETURN contact;
END $$;
REVOKE ALL ON FUNCTION public.convert_shared_lead(uuid,public.contact_relationship,text,text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.convert_shared_lead(uuid,public.contact_relationship,text,text) TO authenticated;
CREATE OR REPLACE FUNCTION public.guard_lead_contact_insert() RETURNS trigger LANGUAGE plpgsql SET search_path=public AS $$ BEGIN
 IF NEW.lead_id IS NOT NULL AND NOT EXISTS(SELECT 1 FROM public.leads l WHERE l.id=NEW.lead_id AND l.handoff_status='accepted' AND l.qualification_status='qualified' AND l.contact_permission='permitted' AND l.assigned_to IS NOT NULL AND nullif(trim(l.context->>'contact_permission_evidence'),'') IS NOT NULL AND public.can_work_leads('sales/crm') AND (l.assigned_to=auth.uid() OR public.is_sales_supervisor()) AND (l.source<>'referral' OR (NEW.full_name=l.context->>'referee_name' AND NEW.phone=l.context->>'referee_phone'))) THEN RAISE EXCEPTION 'Use accepted prospect details and authorised Sales conversion'; END IF;
 IF NEW.lead_id IS NOT NULL AND EXISTS(SELECT 1 FROM public.crm_contacts WHERE lead_id=NEW.lead_id AND id<>NEW.id) THEN RAISE EXCEPTION 'This lead already has a contact'; END IF;
 RETURN NEW; END $$;
CREATE TRIGGER guard_lead_contact_insert BEFORE INSERT OR UPDATE OF lead_id ON public.crm_contacts FOR EACH ROW EXECUTE FUNCTION public.guard_lead_contact_insert();
CREATE OR REPLACE FUNCTION public.guard_lead_activity() RETURNS trigger LANGUAGE plpgsql SET search_path=public AS $$ BEGIN IF NEW.lead_id IS NOT NULL THEN IF NOT (public.can_work_leads('marketing/campaigns') OR public.can_work_leads('sales/crm')) THEN RAISE EXCEPTION 'Lead activity access required'; END IF; NEW.created_by:=auth.uid(); END IF; RETURN NEW; END $$;
CREATE TRIGGER guard_lead_activity BEFORE INSERT OR UPDATE ON public.crm_activities FOR EACH ROW EXECUTE FUNCTION public.guard_lead_activity();
CREATE OR REPLACE FUNCTION public.create_audience_enquiry(_kind text,_id uuid,_interest text,_evidence text,_phone text DEFAULT NULL) RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE n text; em text; ph text; linked uuid; result uuid;
BEGIN
 IF NOT public.can_work_leads('marketing/campaigns') THEN RAISE EXCEPTION 'Marketing access required'; END IF;
 IF length(trim(coalesce(_interest,'')))<3 OR length(_interest)>1000 OR length(trim(coalesce(_evidence,'')))<10 OR length(_evidence)>2000 THEN RAISE EXCEPTION 'Record the explicit enquiry and contact permission evidence'; END IF;
 IF _kind='event' THEN SELECT name,email,phone,lead_id INTO n,em,ph,linked FROM public.event_registrations WHERE id=_id FOR UPDATE;
 ELSIF _kind='newsletter' THEN SELECT trim(first_name||' '||coalesce(last_name,'')),email,nullif(trim(_phone),''),lead_id INTO n,em,ph,linked FROM public.newsletter_subscribers WHERE id=_id FOR UPDATE;
 ELSE RAISE EXCEPTION 'Invalid audience source'; END IF;
 IF n IS NULL THEN RAISE EXCEPTION 'Audience record not found'; END IF;
 IF linked IS NOT NULL THEN RETURN linked; END IF;
 IF ph IS NULL OR length(ph)>40 OR length(n)>200 THEN RAISE EXCEPTION 'Record a contact phone'; END IF;
 INSERT INTO public.leads(name,email,phone,source,lead_type,context,contact_permission) VALUES(n,em,ph,_kind,'enquiry',jsonb_build_object('audience_kind',_kind,'audience_id',_id,'interest',trim(_interest),'contact_permission_evidence',trim(_evidence)),'permitted') RETURNING id INTO result;
 IF _kind='event' THEN UPDATE public.event_registrations SET lead_id=result WHERE id=_id; ELSE UPDATE public.newsletter_subscribers SET lead_id=result WHERE id=_id; END IF;
 INSERT INTO public.audit_logs(user_id,action,entity_type,entity_id,details,source) VALUES(auth.uid(),'create_enquiry',_kind,_id::text,jsonb_build_object('lead_id',result),'shared_lead_workflow');
 RETURN result;
END $$;
REVOKE ALL ON FUNCTION public.create_audience_enquiry(text,uuid,text,text,text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_audience_enquiry(text,uuid,text,text,text) TO authenticated;