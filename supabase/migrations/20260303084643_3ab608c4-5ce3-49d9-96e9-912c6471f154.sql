
-- ============================================
-- CRM BLUEPRINT ENFORCEMENT
-- ============================================

-- 1. Allowed transitions: defines which stage+sub_status moves are permitted
CREATE TABLE public.crm_transition_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  from_stage public.crm_stage NOT NULL,
  from_sub_status public.crm_sub_status NULL,  -- NULL = any sub_status in that stage
  to_stage public.crm_stage NOT NULL,
  to_sub_status public.crm_sub_status NOT NULL,
  requires_approval boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.crm_transition_rules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage transition rules" ON public.crm_transition_rules FOR ALL USING (is_admin(auth.uid()));

-- 2. Stage field requirements: mandatory fields to enter a stage
CREATE TABLE public.crm_stage_requirements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stage public.crm_stage NOT NULL,
  sub_status public.crm_sub_status NULL,  -- NULL = applies to entire stage
  required_field text NOT NULL,            -- column name on crm_deals or 'contact_id', 'contact_phone', etc.
  field_label text NOT NULL,               -- human-readable label
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.crm_stage_requirements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage stage requirements" ON public.crm_stage_requirements FOR ALL USING (is_admin(auth.uid()));

-- 3. Seed default transition rules (forward-only + within-stage sub-status moves)
-- Enquiry → Qualified (any sub)
INSERT INTO public.crm_transition_rules (from_stage, from_sub_status, to_stage, to_sub_status) VALUES
  -- Within Enquiry sub-status changes
  ('enquiry', NULL, 'enquiry', 'contacted'),
  ('enquiry', NULL, 'enquiry', 'not_reachable'),
  ('enquiry', NULL, 'enquiry', 'not_interested'),
  ('enquiry', NULL, 'enquiry', 'dnd'),
  -- Enquiry → Qualified (only from contacted)
  ('enquiry', 'contacted', 'qualified', 'cold'),
  ('enquiry', 'contacted', 'qualified', 'warm'),
  ('enquiry', 'contacted', 'qualified', 'hot'),
  -- Within Qualified
  ('qualified', NULL, 'qualified', 'cold'),
  ('qualified', NULL, 'qualified', 'warm'),
  ('qualified', NULL, 'qualified', 'hot'),
  -- Qualified → Account (only from warm/hot)
  ('qualified', 'warm', 'account', 'documentation'),
  ('qualified', 'hot', 'account', 'documentation'),
  -- Within Account (sequential)
  ('account', 'documentation', 'account', 'kyc'),
  ('account', 'kyc', 'account', 'profile'),
  ('account', 'profile', 'account', 'mandate'),
  -- Account → Status (only from mandate)
  ('account', 'mandate', 'status', 'active'),
  -- Within Status
  ('status', 'active', 'status', 'dormant'),
  ('status', 'dormant', 'status', 'active');

-- 4. Seed default field requirements
INSERT INTO public.crm_stage_requirements (stage, sub_status, required_field, field_label) VALUES
  ('qualified', NULL, 'contact_id', 'Contact must be linked'),
  ('account', NULL, 'contact_id', 'Contact must be linked'),
  ('account', NULL, 'deal_value', 'Deal value must be set'),
  ('account', NULL, 'product_interest', 'Product interest must be specified'),
  ('status', 'active', 'contact_id', 'Contact must be linked'),
  ('status', 'active', 'deal_value', 'Deal value must be set');

-- 5. Validation function: checks if a transition is allowed
CREATE OR REPLACE FUNCTION public.validate_deal_transition(
  _deal_id uuid,
  _to_stage public.crm_stage,
  _to_sub_status public.crm_sub_status
)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _deal RECORD;
  _allowed boolean;
  _requires_approval boolean;
  _errors text[] := '{}';
  _req RECORD;
  _field_value text;
BEGIN
  -- Get current deal
  SELECT * INTO _deal FROM public.crm_deals WHERE id = _deal_id;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('allowed', false, 'errors', ARRAY['Deal not found']);
  END IF;

  -- Skip validation if no actual change
  IF _deal.stage = _to_stage AND _deal.sub_status = _to_sub_status THEN
    RETURN jsonb_build_object('allowed', true, 'errors', '{}', 'requires_approval', false);
  END IF;

  -- Check transition rules
  SELECT EXISTS (
    SELECT 1 FROM public.crm_transition_rules
    WHERE is_active = true
      AND from_stage = _deal.stage
      AND (from_sub_status IS NULL OR from_sub_status = _deal.sub_status)
      AND to_stage = _to_stage
      AND to_sub_status = _to_sub_status
  ) INTO _allowed;

  IF NOT _allowed THEN
    _errors := array_append(_errors, 
      'Transition from ' || _deal.stage || '/' || _deal.sub_status || 
      ' to ' || _to_stage || '/' || _to_sub_status || ' is not allowed');
  END IF;

  -- Check if requires approval
  SELECT COALESCE(bool_or(requires_approval), false) INTO _requires_approval
  FROM public.crm_transition_rules
  WHERE is_active = true
    AND from_stage = _deal.stage
    AND (from_sub_status IS NULL OR from_sub_status = _deal.sub_status)
    AND to_stage = _to_stage
    AND to_sub_status = _to_sub_status;

  -- Check field requirements for target stage
  FOR _req IN
    SELECT required_field, field_label
    FROM public.crm_stage_requirements
    WHERE is_active = true
      AND stage = _to_stage
      AND (sub_status IS NULL OR sub_status = _to_sub_status)
  LOOP
    EXECUTE format('SELECT COALESCE(NULLIF(CAST(%I AS text), ''''), NULL) FROM public.crm_deals WHERE id = $1', _req.required_field)
      INTO _field_value USING _deal_id;
    
    IF _field_value IS NULL OR _field_value = '0' THEN
      _errors := array_append(_errors, _req.field_label);
    END IF;
  END LOOP;

  RETURN jsonb_build_object(
    'allowed', (array_length(_errors, 1) IS NULL),
    'errors', _errors,
    'requires_approval', _requires_approval
  );
END;
$$;
