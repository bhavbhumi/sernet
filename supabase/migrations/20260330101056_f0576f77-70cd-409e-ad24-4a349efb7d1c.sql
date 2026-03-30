
-- 1. Expense Claims table
CREATE TABLE public.expense_claims (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  claim_date date NOT NULL DEFAULT CURRENT_DATE,
  category text NOT NULL DEFAULT 'travel',
  description text NOT NULL,
  amount numeric NOT NULL DEFAULT 0,
  receipt_url text,
  status text NOT NULL DEFAULT 'pending',
  approved_by uuid REFERENCES public.employees(id),
  approved_at timestamptz,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.expense_claims ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage expense claims" ON public.expense_claims FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Employees can read own expense claims" ON public.expense_claims FOR SELECT TO authenticated USING (employee_id = get_employee_id_for_user(auth.uid()));
CREATE POLICY "Employees can insert own expense claims" ON public.expense_claims FOR INSERT TO authenticated WITH CHECK (employee_id = get_employee_id_for_user(auth.uid()));

-- 2. Employee Documents table
CREATE TABLE public.employee_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  document_type text NOT NULL DEFAULT 'other',
  title text NOT NULL,
  file_url text,
  uploaded_by uuid,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.employee_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage employee documents" ON public.employee_documents FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Employees can read own documents" ON public.employee_documents FOR SELECT TO authenticated USING (employee_id = get_employee_id_for_user(auth.uid()));

-- 3. Employee Loans / Advances table
CREATE TABLE public.employee_loans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  loan_type text NOT NULL DEFAULT 'salary_advance',
  principal_amount numeric NOT NULL DEFAULT 0,
  emi_amount numeric NOT NULL DEFAULT 0,
  total_emis integer NOT NULL DEFAULT 1,
  emis_paid integer NOT NULL DEFAULT 0,
  outstanding numeric NOT NULL DEFAULT 0,
  disbursed_on date,
  status text NOT NULL DEFAULT 'active',
  approved_by uuid REFERENCES public.employees(id),
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.employee_loans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage employee loans" ON public.employee_loans FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Employees can read own loans" ON public.employee_loans FOR SELECT TO authenticated USING (employee_id = get_employee_id_for_user(auth.uid()));

-- 4. Increment Letters table
CREATE TABLE public.increment_letters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  effective_date date NOT NULL,
  old_ctc numeric NOT NULL DEFAULT 0,
  new_ctc numeric NOT NULL DEFAULT 0,
  increment_pct numeric,
  letter_html text,
  status text NOT NULL DEFAULT 'draft',
  issued_by uuid,
  issued_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.increment_letters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage increment letters" ON public.increment_letters FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Employees can read own increment letters" ON public.increment_letters FOR SELECT TO authenticated USING (employee_id = get_employee_id_for_user(auth.uid()));

-- 5. Employee Exits / FnF table
CREATE TABLE public.employee_exits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  resignation_date date,
  last_working_day date,
  exit_type text NOT NULL DEFAULT 'resignation',
  reason text,
  notice_period_days integer DEFAULT 30,
  leave_encashment_amount numeric DEFAULT 0,
  gratuity_amount numeric DEFAULT 0,
  pending_salary numeric DEFAULT 0,
  deductions numeric DEFAULT 0,
  fnf_total numeric DEFAULT 0,
  handover_notes text,
  status text NOT NULL DEFAULT 'initiated',
  processed_by uuid,
  processed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.employee_exits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage employee exits" ON public.employee_exits FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Employees can read own exit" ON public.employee_exits FOR SELECT TO authenticated USING (employee_id = get_employee_id_for_user(auth.uid()));

-- 6. Salary Register view-helper: Payroll history page uses payroll_runs + payroll_entries, no new table needed.
