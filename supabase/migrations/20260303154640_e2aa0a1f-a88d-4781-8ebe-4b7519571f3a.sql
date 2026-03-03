-- ============================================================
-- SUPPORT CLASSIFICATION ENGINE - Database Schema
-- ============================================================

-- 1. Issue Categories (Tier 2)
CREATE TABLE public.support_issue_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  icon_name text DEFAULT 'HelpCircle',
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.support_issue_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage issue categories" ON public.support_issue_categories FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Public read issue categories" ON public.support_issue_categories FOR SELECT USING (is_active = true);

-- 2. Issue Types (Tier 3) - dynamic per product + category
CREATE TABLE public.support_issue_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid NOT NULL REFERENCES public.support_issue_categories(id) ON DELETE CASCADE,
  product text NOT NULL DEFAULT 'all', -- tickfunds, choicefinx, tushil, all
  issue_code text NOT NULL UNIQUE,
  title text NOT NULL,
  description text,
  priority text NOT NULL DEFAULT 'standard', -- critical, high, standard
  tat_hours integer NOT NULL DEFAULT 48,
  risk_tag text DEFAULT 'operational', -- financial, compliance, operational, reputational
  regulator text, -- SEBI, IRDAI, Exchange, null
  required_documents text[] DEFAULT '{}',
  auto_assign_team text, -- operations, compliance, support, null
  escalation_path jsonb DEFAULT '[]', -- [{level:1,role:"Team Lead",hours:4},{level:2,...}]
  keyword_triggers text[] DEFAULT '{}', -- words that trigger this issue type
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.support_issue_types ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage issue types" ON public.support_issue_types FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Public read issue types" ON public.support_issue_types FOR SELECT USING (is_active = true);

-- 3. Escalation Matrix
CREATE TABLE public.support_escalation_matrix (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  level integer NOT NULL DEFAULT 1, -- L1, L2, L3, L4
  role_title text NOT NULL, -- "Support Agent", "Team Lead", "Manager", "Compliance Head"
  department text NOT NULL DEFAULT 'support',
  tat_breach_hours integer NOT NULL DEFAULT 4, -- hours after which escalation triggers
  notification_channels text[] DEFAULT '{email}', -- email, sms, push
  assigned_user_id uuid,
  product text DEFAULT 'all',
  is_active boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.support_escalation_matrix ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage escalation matrix" ON public.support_escalation_matrix FOR ALL USING (is_admin(auth.uid()));

-- 4. Ticket Escalation Log (audit trail)
CREATE TABLE public.ticket_escalation_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id uuid NOT NULL REFERENCES public.support_tickets(id) ON DELETE CASCADE,
  from_level integer,
  to_level integer NOT NULL,
  reason text NOT NULL DEFAULT 'TAT breach',
  escalated_to_user_id uuid,
  escalated_to_name text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.ticket_escalation_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage escalation log" ON public.ticket_escalation_log FOR ALL USING (is_admin(auth.uid()));

-- 5. Automation Rules
CREATE TABLE public.support_automation_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  trigger_type text NOT NULL DEFAULT 'keyword', -- keyword, category, tat_breach, product
  conditions jsonb NOT NULL DEFAULT '{}', -- {keywords:[], product:"", category_id:""}
  actions jsonb NOT NULL DEFAULT '{}', -- {set_priority:"critical", assign_team:"operations", notify:[]}
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.support_automation_rules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage automation rules" ON public.support_automation_rules FOR ALL USING (is_admin(auth.uid()));

-- 6. Extend support_tickets with classification fields
ALTER TABLE public.support_tickets
  ADD COLUMN IF NOT EXISTS product text DEFAULT 'tickfunds',
  ADD COLUMN IF NOT EXISTS issue_category_id uuid REFERENCES public.support_issue_categories(id),
  ADD COLUMN IF NOT EXISTS issue_type_id uuid REFERENCES public.support_issue_types(id),
  ADD COLUMN IF NOT EXISTS issue_code text,
  ADD COLUMN IF NOT EXISTS risk_tag text DEFAULT 'operational',
  ADD COLUMN IF NOT EXISTS regulator text,
  ADD COLUMN IF NOT EXISTS tat_hours integer DEFAULT 48,
  ADD COLUMN IF NOT EXISTS tat_deadline timestamptz,
  ADD COLUMN IF NOT EXISTS escalation_level integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS auto_assigned boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS documents_submitted text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS documents_required text[] DEFAULT '{}';

-- Trigger for updated_at on issue_types
CREATE TRIGGER update_support_issue_types_updated_at
  BEFORE UPDATE ON public.support_issue_types
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_support_automation_rules_updated_at
  BEFORE UPDATE ON public.support_automation_rules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();