
-- Create a unified leads table for all lead sources across the website
CREATE TABLE public.leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  -- Contact info
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  -- Lead metadata
  source TEXT NOT NULL DEFAULT 'website', -- 'calculator', 'referral', 'tieup', 'service', 'contact', 'open_account'
  lead_type TEXT NOT NULL DEFAULT 'self', -- 'self', 'referral_client', 'referral_partner', 'tieup'
  status TEXT NOT NULL DEFAULT 'new', -- 'new', 'contacted', 'qualified', 'converted', 'lost'
  -- Contextual data (flexible JSON payload per source)
  context JSONB DEFAULT '{}'::jsonb,
  -- Notes from admin
  notes TEXT,
  assigned_to UUID,
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public can submit leads"
  ON public.leads FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can manage leads"
  ON public.leads FOR ALL
  USING (is_admin(auth.uid()));

-- Auto-update timestamp
CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Migrate existing calculator_leads into unified leads table
INSERT INTO public.leads (name, phone, email, source, lead_type, context, created_at)
SELECT 
  name,
  phone,
  email,
  'calculator' AS source,
  'self' AS lead_type,
  jsonb_build_object(
    'goal_text', goal_text,
    'product_type', product_type,
    'calculated_result', calculated_result
  ) AS context,
  created_at
FROM public.calculator_leads;
