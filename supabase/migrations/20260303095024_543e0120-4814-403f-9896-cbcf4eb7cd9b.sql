
-- 1) Firm Profile (single-row config)
CREATE TABLE public.firm_profile (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  legal_name text NOT NULL DEFAULT '',
  trade_name text DEFAULT '',
  gstin text DEFAULT '',
  pan text DEFAULT '',
  cin text DEFAULT '',
  registered_address text DEFAULT '',
  city text DEFAULT '',
  state text DEFAULT '',
  pincode text DEFAULT '',
  phone text DEFAULT '',
  email text DEFAULT '',
  website text DEFAULT '',
  logo_url text DEFAULT '',
  bank_details jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.firm_profile ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage firm profile" ON public.firm_profile FOR ALL USING (is_admin(auth.uid()));

-- 2) Tax Rates
CREATE TABLE public.tax_rates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  rate numeric NOT NULL DEFAULT 0,
  tax_type text NOT NULL DEFAULT 'GST',
  hsn_sac_code text DEFAULT '',
  description text DEFAULT '',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.tax_rates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage tax rates" ON public.tax_rates FOR ALL USING (is_admin(auth.uid()));

-- 3) Bank Accounts
CREATE TABLE public.bank_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  account_name text NOT NULL,
  bank_name text NOT NULL,
  account_number text NOT NULL,
  ifsc_code text NOT NULL DEFAULT '',
  branch text DEFAULT '',
  account_type text NOT NULL DEFAULT 'current',
  is_primary boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.bank_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage bank accounts" ON public.bank_accounts FOR ALL USING (is_admin(auth.uid()));

-- 4) Payment Terms
CREATE TABLE public.payment_terms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  days integer NOT NULL DEFAULT 0,
  description text DEFAULT '',
  is_default boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.payment_terms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage payment terms" ON public.payment_terms FOR ALL USING (is_admin(auth.uid()));

-- 5) Service Catalog
CREATE TABLE public.service_catalog (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  sac_code text DEFAULT '',
  default_rate numeric NOT NULL DEFAULT 0,
  unit text NOT NULL DEFAULT 'per service',
  tax_rate_id uuid REFERENCES public.tax_rates(id) ON DELETE SET NULL,
  description text DEFAULT '',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.service_catalog ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage service catalog" ON public.service_catalog FOR ALL USING (is_admin(auth.uid()));

-- 6) Salary Components
CREATE TABLE public.salary_components (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  code text NOT NULL UNIQUE,
  component_type text NOT NULL DEFAULT 'earning',
  calculation_type text NOT NULL DEFAULT 'fixed',
  default_value numeric NOT NULL DEFAULT 0,
  is_taxable boolean NOT NULL DEFAULT true,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.salary_components ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage salary components" ON public.salary_components FOR ALL USING (is_admin(auth.uid()));

-- Updated_at triggers
CREATE TRIGGER update_firm_profile_updated_at BEFORE UPDATE ON public.firm_profile FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tax_rates_updated_at BEFORE UPDATE ON public.tax_rates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bank_accounts_updated_at BEFORE UPDATE ON public.bank_accounts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_service_catalog_updated_at BEFORE UPDATE ON public.service_catalog FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
