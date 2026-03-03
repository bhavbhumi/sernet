
-- Add office_type to contact_branches for company contacts (HO/ZO/RO/BO/INTL/IFSC)
ALTER TABLE public.contact_branches 
  ADD COLUMN IF NOT EXISTS office_type text DEFAULT 'BO',
  ADD COLUMN IF NOT EXISTS address_type text DEFAULT 'domestic',
  ADD COLUMN IF NOT EXISTS ownership text DEFAULT 'own';

-- Create KMP/Escalation contacts matrix for company contacts
CREATE TABLE public.contact_kmp (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id uuid NOT NULL REFERENCES public.crm_contacts(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  designation text NOT NULL DEFAULT '',
  department text DEFAULT '',
  email text DEFAULT '',
  phone text DEFAULT '',
  is_escalation boolean DEFAULT false,
  escalation_level integer DEFAULT 0,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.contact_kmp ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage contact KMP"
  ON public.contact_kmp FOR ALL
  USING (is_admin(auth.uid()));

CREATE POLICY "Public can read KMP"
  ON public.contact_kmp FOR SELECT
  USING (true);
