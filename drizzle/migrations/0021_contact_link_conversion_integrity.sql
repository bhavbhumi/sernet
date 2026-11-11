CREATE OR REPLACE FUNCTION public.guard_converted_contact_link() RETURNS trigger LANGUAGE plpgsql SET search_path=public AS $$
DECLARE n text; ph text; em text;
BEGIN
 IF NEW.converted_contact_id IS NOT NULL AND (TG_OP='INSERT' OR NEW.converted_contact_id IS DISTINCT FROM OLD.converted_contact_id OR NEW.status IS DISTINCT FROM OLD.status) THEN
  IF NOT public.can_work_leads('sales/crm') OR NEW.handoff_status<>'accepted' OR NEW.qualification_status<>'qualified' OR NEW.contact_permission<>'permitted' OR NEW.assigned_to IS NULL OR nullif(trim(NEW.context->>'contact_permission_evidence'),'') IS NULL OR (auth.uid() IS DISTINCT FROM NEW.assigned_to AND NOT public.is_sales_supervisor()) THEN RAISE EXCEPTION 'An accepted, qualified and permitted lead with authorised Sales owner is required'; END IF;
  IF NEW.source='referral' THEN n:=NEW.context->>'referee_name'; ph:=NEW.context->>'referee_phone'; em:=NEW.context->>'referee_email'; ELSE n:=NEW.name; ph:=NEW.phone; em:=NEW.email; END IF;
  IF NOT EXISTS(SELECT 1 FROM public.crm_contacts c WHERE c.id=NEW.converted_contact_id AND (c.lead_id=NEW.id OR (lower(trim(c.full_name))=lower(trim(n)) AND ((nullif(trim(em),'') IS NOT NULL AND lower(trim(c.email))=lower(trim(em))) OR regexp_replace(c.phone,'[^0-9]','','g')=regexp_replace(ph,'[^0-9]','','g'))))) THEN RAISE EXCEPTION 'The linked contact must match this prospect'; END IF;
 END IF;
 RETURN NEW;
END $$;
CREATE TRIGGER guard_converted_contact_link BEFORE INSERT OR UPDATE ON public.leads FOR EACH ROW EXECUTE FUNCTION public.guard_converted_contact_link();