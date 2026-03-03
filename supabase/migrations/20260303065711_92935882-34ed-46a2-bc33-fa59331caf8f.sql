
-- ═══════════════════════════════════════════════════════
-- Phase 4A: HR Module — Employee Directory, Leave, Attendance
-- ═══════════════════════════════════════════════════════

-- 1. Employee Directory
CREATE TABLE public.employees (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  employee_code TEXT UNIQUE,
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  department TEXT NOT NULL DEFAULT 'General',
  designation TEXT NOT NULL DEFAULT 'Associate',
  date_of_joining DATE,
  date_of_leaving DATE,
  reporting_to UUID REFERENCES public.employees(id) ON DELETE SET NULL,
  employment_type TEXT NOT NULL DEFAULT 'full_time',
  status TEXT NOT NULL DEFAULT 'active',
  photo_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage employees" ON public.employees FOR ALL
  USING (public.is_admin(auth.uid()));

CREATE TRIGGER update_employees_updated_at
  BEFORE UPDATE ON public.employees FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- 2. Leave Types
CREATE TABLE public.leave_types (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  code TEXT NOT NULL UNIQUE,
  default_days INTEGER NOT NULL DEFAULT 0,
  is_paid BOOLEAN NOT NULL DEFAULT true,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.leave_types ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage leave types" ON public.leave_types FOR ALL
  USING (public.is_admin(auth.uid()));

-- 3. Leave Requests
CREATE TABLE public.leave_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  leave_type_id UUID NOT NULL REFERENCES public.leave_types(id),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  days_count NUMERIC(4,1) NOT NULL DEFAULT 1,
  reason TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  approved_by UUID REFERENCES public.employees(id),
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.leave_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage leave requests" ON public.leave_requests FOR ALL
  USING (public.is_admin(auth.uid()));

CREATE TRIGGER update_leave_requests_updated_at
  BEFORE UPDATE ON public.leave_requests FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- 4. Attendance Logs
CREATE TABLE public.attendance_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  log_date DATE NOT NULL,
  check_in TIMESTAMPTZ,
  check_out TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'present',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(employee_id, log_date)
);

ALTER TABLE public.attendance_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage attendance" ON public.attendance_logs FOR ALL
  USING (public.is_admin(auth.uid()));

-- ═══════════════════════════════════════════════════════
-- Phase 4B: Accounts Module — Invoices & Payroll
-- ═══════════════════════════════════════════════════════

-- 5. Invoices
CREATE TABLE public.invoices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_number TEXT NOT NULL UNIQUE,
  contact_id UUID REFERENCES public.crm_contacts(id) ON DELETE SET NULL,
  invoice_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE,
  status TEXT NOT NULL DEFAULT 'draft',
  subtotal NUMERIC(12,2) NOT NULL DEFAULT 0,
  tax_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  total NUMERIC(12,2) NOT NULL DEFAULT 0,
  notes TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage invoices" ON public.invoices FOR ALL
  USING (public.is_admin(auth.uid()));

CREATE TRIGGER update_invoices_updated_at
  BEFORE UPDATE ON public.invoices FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- 6. Invoice Line Items
CREATE TABLE public.invoice_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invoice_id UUID NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  quantity NUMERIC(10,2) NOT NULL DEFAULT 1,
  unit_price NUMERIC(12,2) NOT NULL DEFAULT 0,
  amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  sort_order INTEGER DEFAULT 0
);

ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage invoice items" ON public.invoice_items FOR ALL
  USING (public.is_admin(auth.uid()));

-- 7. Payroll Records
CREATE TABLE public.payroll_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  pay_period TEXT NOT NULL,
  pay_date DATE NOT NULL,
  basic_salary NUMERIC(12,2) NOT NULL DEFAULT 0,
  allowances NUMERIC(12,2) NOT NULL DEFAULT 0,
  deductions NUMERIC(12,2) NOT NULL DEFAULT 0,
  net_pay NUMERIC(12,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'draft',
  notes TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.payroll_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage payroll" ON public.payroll_records FOR ALL
  USING (public.is_admin(auth.uid()));

CREATE TRIGGER update_payroll_records_updated_at
  BEFORE UPDATE ON public.payroll_records FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- 8. Invoice number generator
CREATE OR REPLACE FUNCTION public.generate_invoice_number()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  seq_num INTEGER;
BEGIN
  SELECT COALESCE(MAX(
    CAST(NULLIF(regexp_replace(invoice_number, '[^0-9]', '', 'g'), '') AS INTEGER)
  ), 0) + 1 INTO seq_num FROM public.invoices;
  NEW.invoice_number := 'INV-' || LPAD(seq_num::TEXT, 5, '0');
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_invoice_number
  BEFORE INSERT ON public.invoices
  FOR EACH ROW
  WHEN (NEW.invoice_number IS NULL OR NEW.invoice_number = '')
  EXECUTE FUNCTION public.generate_invoice_number();
