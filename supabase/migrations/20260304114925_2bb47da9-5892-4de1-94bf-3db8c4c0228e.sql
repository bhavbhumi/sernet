
ALTER TABLE public.kb_articles
ADD COLUMN IF NOT EXISTS first_response_sla_hours numeric DEFAULT NULL,
ADD COLUMN IF NOT EXISTS resolution_sla_hours numeric DEFAULT NULL,
ADD COLUMN IF NOT EXISTS escalation_trigger text DEFAULT NULL;
