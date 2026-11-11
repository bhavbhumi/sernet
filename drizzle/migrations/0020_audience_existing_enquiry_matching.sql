CREATE OR REPLACE FUNCTION public.create_audience_enquiry(_kind text,_id uuid,_interest text,_evidence text,_phone text DEFAULT NULL) RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE n text; em text; ph text; linked uuid; result uuid; matches integer;
BEGIN
 IF NOT public.can_work_leads('marketing/campaigns') THEN RAISE EXCEPTION 'Marketing access required'; END IF;
 IF length(trim(coalesce(_interest,'')))<3 OR length(_interest)>1000 OR length(trim(coalesce(_evidence,'')))<10 OR length(_evidence)>2000 THEN RAISE EXCEPTION 'Record the explicit enquiry and contact permission evidence'; END IF;
 IF _kind='event' THEN SELECT name,email,phone,lead_id INTO n,em,ph,linked FROM public.event_registrations WHERE id=_id FOR UPDATE;
 ELSIF _kind='newsletter' THEN SELECT trim(first_name||' '||coalesce(last_name,'')),email,nullif(trim(_phone),''),lead_id INTO n,em,ph,linked FROM public.newsletter_subscribers WHERE id=_id FOR UPDATE;
 ELSE RAISE EXCEPTION 'Invalid audience source'; END IF;
 IF n IS NULL THEN RAISE EXCEPTION 'Audience record not found'; END IF;
 IF linked IS NOT NULL THEN RETURN linked; END IF;
 IF ph IS NULL OR length(ph)>40 OR length(n)>200 THEN RAISE EXCEPTION 'Record a contact phone'; END IF;
 PERFORM pg_advisory_xact_lock(hashtextextended('audience-enquiry-matching',0));
 SELECT count(*),(array_agg(id ORDER BY created_at))[1] INTO matches,result FROM public.leads l WHERE l.status NOT IN ('lost') AND l.qualification_status NOT IN ('spam','duplicate','not_suitable') AND lower(trim(l.name))=lower(trim(n)) AND l.source<>'referral' AND ((nullif(trim(em),'') IS NOT NULL AND lower(trim(l.email))=lower(trim(em))) OR regexp_replace(l.phone,'[^0-9]','','g')=regexp_replace(ph,'[^0-9]','','g'));
 IF matches>1 THEN RAISE EXCEPTION 'Multiple matching enquiries; review them before linking'; END IF;
 IF matches=0 THEN INSERT INTO public.leads(name,email,phone,source,lead_type,context,contact_permission) VALUES(n,em,ph,_kind,'enquiry',jsonb_build_object('audience_kind',_kind,'audience_id',_id,'interest',trim(_interest),'contact_permission_evidence',trim(_evidence)),'permitted') RETURNING id INTO result; END IF;
 INSERT INTO public.crm_activities(lead_id,activity_type,subject,description,created_by) VALUES(result,'note','Explicit audience enquiry',trim(_interest)||E'\nContact permission: '||trim(_evidence),auth.uid());
 IF _kind='event' THEN UPDATE public.event_registrations SET lead_id=result WHERE id=_id; ELSE UPDATE public.newsletter_subscribers SET lead_id=result WHERE id=_id; END IF;
 INSERT INTO public.audit_logs(user_id,action,entity_type,entity_id,details,source) VALUES(auth.uid(),'create_enquiry',_kind,_id::text,jsonb_build_object('lead_id',result,'linked_existing',matches=1),'shared_lead_workflow');
 RETURN result;
END $$;
COMMENT ON TABLE public.calculator_leads IS 'DEPRECATED: calculator enquiries are captured and reported through public.leads with source calculator; retained for earlier deployments.';