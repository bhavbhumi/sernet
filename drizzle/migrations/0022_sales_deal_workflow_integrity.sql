CREATE POLICY "Sales module required for deals" ON public.crm_deals AS RESTRICTIVE FOR ALL TO authenticated USING (public.can_work_leads('sales/crm')) WITH CHECK (public.can_work_leads('sales/crm'));
CREATE POLICY "Sales module required for stage history" ON public.crm_stage_history AS RESTRICTIVE FOR ALL TO authenticated USING (public.can_work_leads('sales/crm')) WITH CHECK (public.can_work_leads('sales/crm'));
CREATE OR REPLACE FUNCTION public.guard_sales_deal() RETURNS trigger LANGUAGE plpgsql SET search_path=public AS $$
DECLARE initial_stage text; initial_sub text; req record; field_value text; permitted boolean; approval boolean;
BEGIN
 IF NOT public.can_work_leads('sales/crm') THEN RAISE EXCEPTION 'Sales CRM access required'; END IF;
 IF nullif(trim(NEW.title),'') IS NULL OR length(NEW.title)>200 OR NEW.deal_value<0 OR NEW.probability<0 OR NEW.probability>100 THEN RAISE EXCEPTION 'Enter a title, non-negative value and probability between 0 and 100'; END IF;
 IF TG_OP='INSERT' OR NEW.contact_id IS DISTINCT FROM OLD.contact_id THEN
  IF NEW.contact_id IS NULL OR NOT EXISTS(SELECT 1 FROM public.crm_contacts WHERE id=NEW.contact_id) THEN RAISE EXCEPTION 'Select an existing contact before creating an opportunity'; END IF;
 END IF;
 IF TG_OP='INSERT' OR NEW.product_id IS DISTINCT FROM OLD.product_id THEN
  IF NEW.product_id IS NULL OR NOT EXISTS(SELECT 1 FROM public.products WHERE id=NEW.product_id AND is_active) THEN RAISE EXCEPTION 'Select an active product'; END IF;
  SELECT name INTO NEW.product_interest FROM public.products WHERE id=NEW.product_id;
 END IF;
 IF TG_OP='INSERT' THEN
  SELECT s.stage_key,ss.sub_status_key INTO initial_stage,initial_sub FROM public.pipeline_stages s JOIN public.pipeline_sub_statuses ss ON ss.stage_id=s.id AND ss.is_active WHERE s.pipeline_key='default' AND s.is_active ORDER BY s.sort_order,ss.sort_order LIMIT 1;
  IF initial_stage IS NULL OR NEW.stage::text<>initial_stage OR NEW.sub_status::text<>initial_sub THEN RAISE EXCEPTION 'New opportunities must start at the initial configured stage'; END IF;
  NEW.created_by:=auth.uid(); NEW.assigned_to:=coalesce(NEW.assigned_to,auth.uid());
 END IF;
 IF TG_OP='INSERT' OR NEW.assigned_to IS DISTINCT FROM OLD.assigned_to THEN
  IF NEW.assigned_to IS NULL OR NOT EXISTS(SELECT 1 FROM public.user_roles WHERE user_id=NEW.assigned_to AND (role='super_admin' OR department IS NULL OR department='sales')) THEN RAISE EXCEPTION 'Select a Sales owner'; END IF;
 END IF;
 IF TG_OP='UPDATE' AND (NEW.stage IS DISTINCT FROM OLD.stage OR NEW.sub_status IS DISTINCT FROM OLD.sub_status) THEN
  IF NOT EXISTS(SELECT 1 FROM public.pipeline_stages s JOIN public.pipeline_sub_statuses ss ON ss.stage_id=s.id WHERE s.pipeline_key='default' AND s.is_active AND ss.is_active AND s.stage_key=NEW.stage::text AND ss.sub_status_key=NEW.sub_status::text) THEN RAISE EXCEPTION 'Select an active configured stage and sub-status'; END IF;
  SELECT coalesce(bool_or(true),false),coalesce(bool_or(requires_approval),false) INTO permitted,approval FROM public.crm_transition_rules WHERE is_active AND from_stage=OLD.stage AND (from_sub_status IS NULL OR from_sub_status=OLD.sub_status) AND to_stage=NEW.stage AND to_sub_status=NEW.sub_status;
  IF NOT permitted THEN RAISE EXCEPTION 'This stage transition is not allowed'; END IF;
  IF approval THEN RAISE EXCEPTION 'This transition requires approval; keep its current stage until the approval workflow is available'; END IF;
  FOR req IN SELECT required_field,field_label FROM public.crm_stage_requirements WHERE is_active AND stage=NEW.stage AND (sub_status IS NULL OR sub_status=NEW.sub_status) LOOP
   field_value:=nullif(trim(to_jsonb(NEW)->>req.required_field),'');
   IF field_value IS NULL OR field_value='0' THEN RAISE EXCEPTION '%',req.field_label; END IF;
  END LOOP;
 END IF;
 RETURN NEW;
END $$;
CREATE TRIGGER guard_sales_deal BEFORE INSERT OR UPDATE ON public.crm_deals FOR EACH ROW EXECUTE FUNCTION public.guard_sales_deal();
CREATE OR REPLACE FUNCTION public.record_sales_deal_transition() RETURNS trigger LANGUAGE plpgsql SET search_path=public AS $$ BEGIN
 IF NEW.stage IS DISTINCT FROM OLD.stage OR NEW.sub_status IS DISTINCT FROM OLD.sub_status THEN INSERT INTO public.crm_stage_history(deal_id,from_stage,from_sub_status,to_stage,to_sub_status,changed_by) VALUES(NEW.id,OLD.stage,OLD.sub_status,NEW.stage,NEW.sub_status,auth.uid()); END IF; RETURN NEW; END $$;
CREATE TRIGGER record_sales_deal_transition AFTER UPDATE ON public.crm_deals FOR EACH ROW EXECUTE FUNCTION public.record_sales_deal_transition();
CREATE OR REPLACE FUNCTION public.create_sales_deal(_title text,_contact uuid,_product uuid,_value numeric DEFAULT 0) RETURNS uuid LANGUAGE plpgsql SET search_path=public AS $$
DECLARE initial_stage public.crm_stage; initial_sub public.crm_sub_status; result uuid;
BEGIN
 IF NOT public.can_work_leads('sales/crm') THEN RAISE EXCEPTION 'Sales CRM access required'; END IF;
 SELECT s.stage_key::public.crm_stage,ss.sub_status_key::public.crm_sub_status INTO initial_stage,initial_sub FROM public.pipeline_stages s JOIN public.pipeline_sub_statuses ss ON ss.stage_id=s.id AND ss.is_active WHERE s.pipeline_key='default' AND s.is_active ORDER BY s.sort_order,ss.sort_order LIMIT 1;
 IF initial_stage IS NULL THEN RAISE EXCEPTION 'Configure an active initial stage and sub-status'; END IF;
 INSERT INTO public.crm_deals(title,contact_id,product_id,deal_value,stage,sub_status,assigned_to,created_by) VALUES(trim(_title),_contact,_product,_value,initial_stage,initial_sub,auth.uid(),auth.uid()) RETURNING id INTO result; RETURN result;
END $$;
REVOKE ALL ON FUNCTION public.create_sales_deal(text,uuid,uuid,numeric) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_sales_deal(text,uuid,uuid,numeric) TO authenticated;
CREATE OR REPLACE FUNCTION public.guard_sales_activity() RETURNS trigger LANGUAGE plpgsql SET search_path=public AS $$ BEGIN
 IF NEW.deal_id IS NOT NULL OR (NEW.contact_id IS NOT NULL AND NEW.lead_id IS NULL) THEN
  IF NOT public.can_work_leads('sales/crm') THEN RAISE EXCEPTION 'Sales CRM access required'; END IF;
  IF nullif(trim(NEW.subject),'') IS NULL OR length(NEW.subject)>200 THEN RAISE EXCEPTION 'Activity subject is required, up to 200 characters'; END IF;
  IF NEW.deal_id IS NOT NULL AND NOT EXISTS(SELECT 1 FROM public.crm_deals WHERE id=NEW.deal_id AND contact_id IS NOT DISTINCT FROM NEW.contact_id) THEN RAISE EXCEPTION 'Activity contact must match the opportunity'; END IF;
  IF TG_OP='INSERT' THEN NEW.created_by:=auth.uid(); END IF;
 END IF;
 RETURN NEW; END $$;
CREATE TRIGGER guard_sales_activity BEFORE INSERT OR UPDATE ON public.crm_activities FOR EACH ROW EXECUTE FUNCTION public.guard_sales_activity();