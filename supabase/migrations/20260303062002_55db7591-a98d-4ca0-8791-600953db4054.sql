
-- CRM Pipeline Stage enum
CREATE TYPE public.crm_stage AS ENUM ('enquiry', 'qualified', 'account', 'status');

-- CRM Sub-Status enum matching your Zoho lifecycle
CREATE TYPE public.crm_sub_status AS ENUM (
  'contacted', 'not_reachable', 'not_interested', 'dnd',
  'cold', 'warm', 'hot',
  'documentation', 'kyc', 'profile', 'mandate',
  'active', 'dormant'
);

-- CRM activity type
CREATE TYPE public.crm_activity_type AS ENUM ('call', 'email', 'meeting', 'note', 'task', 'follow_up');

-- Contacts / Accounts (individuals or companies)
CREATE TABLE public.crm_contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_type text NOT NULL DEFAULT 'individual', -- individual / company
  full_name text NOT NULL,
  company_name text,
  email text,
  phone text,
  alternate_phone text,
  pan text,
  city text,
  state text,
  source text DEFAULT 'direct', -- direct, referral, website, walk-in, campaign
  tags text[] DEFAULT '{}',
  notes text,
  assigned_to uuid,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.crm_contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage crm_contacts" ON public.crm_contacts
  FOR ALL USING (is_admin(auth.uid()));

-- Trigger for updated_at
CREATE TRIGGER update_crm_contacts_updated_at
  BEFORE UPDATE ON public.crm_contacts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Deals / Opportunities moving through the pipeline
CREATE TABLE public.crm_deals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id uuid REFERENCES public.crm_contacts(id) ON DELETE SET NULL,
  lead_id uuid, -- optional link to existing leads table
  title text NOT NULL,
  stage crm_stage NOT NULL DEFAULT 'enquiry',
  sub_status crm_sub_status NOT NULL DEFAULT 'contacted',
  deal_value numeric DEFAULT 0,
  product_interest text, -- MF, Insurance, Trading, PMS, etc.
  probability integer DEFAULT 10, -- 0-100
  expected_close_date date,
  assigned_to uuid,
  lost_reason text,
  won_date timestamptz,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.crm_deals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage crm_deals" ON public.crm_deals
  FOR ALL USING (is_admin(auth.uid()));

CREATE TRIGGER update_crm_deals_updated_at
  BEFORE UPDATE ON public.crm_deals
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Index for pipeline views
CREATE INDEX idx_crm_deals_stage ON public.crm_deals(stage);
CREATE INDEX idx_crm_deals_sub_status ON public.crm_deals(sub_status);
CREATE INDEX idx_crm_deals_assigned ON public.crm_deals(assigned_to);

-- Activities (call logs, notes, follow-ups, tasks)
CREATE TABLE public.crm_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id uuid REFERENCES public.crm_deals(id) ON DELETE CASCADE,
  contact_id uuid REFERENCES public.crm_contacts(id) ON DELETE CASCADE,
  activity_type crm_activity_type NOT NULL DEFAULT 'note',
  subject text NOT NULL,
  description text,
  due_date timestamptz,
  completed_at timestamptz,
  is_completed boolean NOT NULL DEFAULT false,
  outcome text, -- connected, no_answer, voicemail, callback, etc.
  duration_minutes integer,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.crm_activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage crm_activities" ON public.crm_activities
  FOR ALL USING (is_admin(auth.uid()));

CREATE TRIGGER update_crm_activities_updated_at
  BEFORE UPDATE ON public.crm_activities
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_crm_activities_deal ON public.crm_activities(deal_id);
CREATE INDEX idx_crm_activities_due ON public.crm_activities(due_date) WHERE is_completed = false;

-- Stage transition history (audit trail for pipeline movement)
CREATE TABLE public.crm_stage_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id uuid REFERENCES public.crm_deals(id) ON DELETE CASCADE NOT NULL,
  from_stage crm_stage,
  from_sub_status crm_sub_status,
  to_stage crm_stage NOT NULL,
  to_sub_status crm_sub_status NOT NULL,
  changed_by uuid,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.crm_stage_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage crm_stage_history" ON public.crm_stage_history
  FOR ALL USING (is_admin(auth.uid()));

CREATE INDEX idx_crm_stage_history_deal ON public.crm_stage_history(deal_id);
