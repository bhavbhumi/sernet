
-- Workflow rules table: defines automation triggers, conditions, and actions
CREATE TABLE public.workflow_rules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  entity_type TEXT NOT NULL DEFAULT 'crm_deals', -- which table this monitors
  trigger_event TEXT NOT NULL DEFAULT 'update', -- insert, update, delete
  trigger_field TEXT, -- specific field change to watch (NULL = any change)
  trigger_value TEXT, -- specific value to match (NULL = any value)
  conditions JSONB NOT NULL DEFAULT '[]'::jsonb, -- array of {field, operator, value}
  actions JSONB NOT NULL DEFAULT '[]'::jsonb, -- array of {type, config}
  is_active BOOLEAN NOT NULL DEFAULT true,
  priority INTEGER NOT NULL DEFAULT 0,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Workflow execution logs
CREATE TABLE public.workflow_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  rule_id UUID NOT NULL REFERENCES public.workflow_rules(id) ON DELETE CASCADE,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  trigger_event TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'success', -- success, error, skipped
  actions_executed JSONB NOT NULL DEFAULT '[]'::jsonb,
  error_message TEXT,
  execution_time_ms INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.workflow_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflow_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Admins can manage workflow rules"
  ON public.workflow_rules FOR ALL
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage workflow logs"
  ON public.workflow_logs FOR ALL
  USING (public.is_admin(auth.uid()));

-- Indexes
CREATE INDEX idx_workflow_rules_entity ON public.workflow_rules(entity_type, trigger_event) WHERE is_active = true;
CREATE INDEX idx_workflow_logs_rule ON public.workflow_logs(rule_id);
CREATE INDEX idx_workflow_logs_created ON public.workflow_logs(created_at DESC);

-- Trigger for updated_at
CREATE TRIGGER update_workflow_rules_updated_at
  BEFORE UPDATE ON public.workflow_rules
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
