CREATE OR REPLACE FUNCTION public.guard_sales_contact_write() RETURNS trigger LANGUAGE plpgsql SET search_path=public AS $$ BEGIN
 IF NOT public.can_work_leads('sales/crm') THEN RAISE EXCEPTION 'Sales CRM access required'; END IF;
 IF TG_OP='DELETE' THEN RETURN OLD; END IF;
 IF nullif(trim(NEW.full_name),'') IS NULL OR length(NEW.full_name)>200 THEN RAISE EXCEPTION 'Contact name is required, up to 200 characters'; END IF;
 IF nullif(trim(NEW.email),'') IS NOT NULL AND NEW.email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' THEN RAISE EXCEPTION 'Enter a valid email address'; END IF;
 RETURN NEW; END $$;
CREATE TRIGGER guard_sales_contact_write BEFORE INSERT OR UPDATE OR DELETE ON public.crm_contacts FOR EACH ROW EXECUTE FUNCTION public.guard_sales_contact_write();
CREATE OR REPLACE FUNCTION public.guard_sales_pipeline_config() RETURNS trigger LANGUAGE plpgsql SET search_path=public AS $$ BEGIN
 IF NOT public.is_sales_supervisor() THEN RAISE EXCEPTION 'Sales supervisor access required to configure the pipeline'; END IF;
 IF TG_OP='DELETE' THEN RETURN OLD; END IF;
 IF TG_TABLE_NAME='pipeline_stages' THEN PERFORM NEW.stage_key::public.crm_stage; ELSE PERFORM NEW.sub_status_key::public.crm_sub_status; END IF;
 RETURN NEW; END $$;
CREATE TRIGGER guard_sales_pipeline_config BEFORE INSERT OR UPDATE OR DELETE ON public.pipeline_stages FOR EACH ROW EXECUTE FUNCTION public.guard_sales_pipeline_config();
CREATE TRIGGER guard_sales_substatus_config BEFORE INSERT OR UPDATE OR DELETE ON public.pipeline_sub_statuses FOR EACH ROW EXECUTE FUNCTION public.guard_sales_pipeline_config();