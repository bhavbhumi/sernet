
-- 1. Add relationship_type enum
CREATE TYPE public.contact_relationship AS ENUM ('client', 'partner', 'principal');

-- 2. Add columns to crm_contacts
ALTER TABLE public.crm_contacts 
  ADD COLUMN relationship_type public.contact_relationship NOT NULL DEFAULT 'client',
  ADD COLUMN relationship_meta jsonb DEFAULT '{}'::jsonb;

-- 3. Partner Payouts table
CREATE TABLE public.partner_payouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_contact_id uuid REFERENCES public.crm_contacts(id) ON DELETE CASCADE NOT NULL,
  payout_period text NOT NULL,
  gross_revenue numeric NOT NULL DEFAULT 0,
  share_pct numeric NOT NULL DEFAULT 0,
  payout_amount numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  paid_date date,
  reference_number text,
  notes text,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.partner_payouts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage partner payouts" ON public.partner_payouts FOR ALL USING (public.is_admin(auth.uid()));
CREATE TRIGGER update_partner_payouts_updated_at BEFORE UPDATE ON public.partner_payouts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 4. Commission Claims table (from principals)
CREATE TABLE public.commission_claims (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  principal_contact_id uuid REFERENCES public.crm_contacts(id) ON DELETE CASCADE NOT NULL,
  claim_period text NOT NULL,
  product_category text,
  gross_aum numeric DEFAULT 0,
  commission_rate numeric DEFAULT 0,
  claim_amount numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  received_date date,
  reference_number text,
  notes text,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.commission_claims ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage commission claims" ON public.commission_claims FOR ALL USING (public.is_admin(auth.uid()));
CREATE TRIGGER update_commission_claims_updated_at BEFORE UPDATE ON public.commission_claims FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 5. Agreements table (legal)
CREATE TABLE public.agreements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id uuid REFERENCES public.crm_contacts(id) ON DELETE SET NULL,
  agreement_type text NOT NULL DEFAULT 'client_agreement',
  title text NOT NULL,
  status text NOT NULL DEFAULT 'draft',
  start_date date,
  end_date date,
  document_url text,
  terms_summary text,
  auto_renew boolean DEFAULT false,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.agreements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage agreements" ON public.agreements FOR ALL USING (public.is_admin(auth.uid()));
CREATE TRIGGER update_agreements_updated_at BEFORE UPDATE ON public.agreements FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
