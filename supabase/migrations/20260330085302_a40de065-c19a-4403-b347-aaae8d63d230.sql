
CREATE TABLE public.salary_structures (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  effective_from DATE NOT NULL DEFAULT CURRENT_DATE,
  effective_to DATE,
  ctc_annual NUMERIC NOT NULL DEFAULT 0,
  basic NUMERIC NOT NULL DEFAULT 0,
  hra NUMERIC NOT NULL DEFAULT 0,
  special_allowance NUMERIC NOT NULL DEFAULT 0,
  medical_allowance NUMERIC NOT NULL DEFAULT 0,
  lta NUMERIC NOT NULL DEFAULT 0,
  other_allowance NUMERIC NOT NULL DEFAULT 0,
  is_pf_applicable BOOLEAN NOT NULL DEFAULT true,
  pf_wage_cap NUMERIC NOT NULL DEFAULT 15000,
  is_esi_applicable BOOLEAN NOT NULL DEFAULT false,
  tds_monthly NUMERIC NOT NULL DEFAULT 0,
  regime TEXT NOT NULL DEFAULT 'new',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.salary_structures ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage salary_structures"
  ON public.salary_structures
  FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

CREATE TRIGGER set_salary_structures_updated_at
  BEFORE UPDATE ON public.salary_structures
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
