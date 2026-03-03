
-- 1. Contact branches table for storing AMC branch offices
CREATE TABLE public.contact_branches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id uuid NOT NULL REFERENCES public.crm_contacts(id) ON DELETE CASCADE,
  branch_city text NOT NULL,
  address_line1 text,
  address_line2 text,
  address_line3 text,
  pincode text,
  phone text,
  is_head_office boolean DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE public.contact_branches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage contact branches"
  ON public.contact_branches FOR ALL
  USING (is_admin(auth.uid()));

CREATE POLICY "Public can read principal branches"
  ON public.contact_branches FOR SELECT
  USING (true);

-- Index for fast lookups
CREATE INDEX idx_contact_branches_contact_id ON public.contact_branches(contact_id);
CREATE INDEX idx_contact_branches_city ON public.contact_branches(branch_city);

-- 2. Add ARN number to firm_profile
ALTER TABLE public.firm_profile ADD COLUMN IF NOT EXISTS arn_number text DEFAULT '';
ALTER TABLE public.firm_profile ADD COLUMN IF NOT EXISTS amfi_registration text DEFAULT '';
