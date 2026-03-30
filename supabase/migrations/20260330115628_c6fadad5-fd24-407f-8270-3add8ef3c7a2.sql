
-- 1. Create department_shifts for per-department timing rules
CREATE TABLE public.department_shifts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  department_name text NOT NULL UNIQUE,
  weekday_start time NOT NULL DEFAULT '10:00',
  weekday_end time NOT NULL DEFAULT '18:00',
  saturday_start time NOT NULL DEFAULT '10:00',
  saturday_end time NOT NULL DEFAULT '15:00',
  grace_minutes integer NOT NULL DEFAULT 15,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.department_shifts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage department shifts"
  ON public.department_shifts FOR ALL TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Employees can read department shifts"
  ON public.department_shifts FOR SELECT TO authenticated
  USING (true);

CREATE TRIGGER set_updated_at_department_shifts
  BEFORE UPDATE ON public.department_shifts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 2. Seed department shifts
INSERT INTO public.department_shifts (department_name, weekday_start, weekday_end, saturday_start, saturday_end, grace_minutes) VALUES
  ('Sales', '10:00', '18:00', '10:00', '15:00', 15),
  ('Dealing', '09:00', '17:00', '10:00', '15:00', 15),
  ('Operations', '09:00', '17:00', '10:00', '15:00', 15),
  ('Research', '10:00', '18:00', '10:00', '15:00', 15),
  ('Compliance', '10:00', '18:00', '10:00', '15:00', 15),
  ('Technology', '10:00', '18:00', '10:00', '15:00', 15),
  ('Finance', '10:00', '18:00', '10:00', '15:00', 15),
  ('Administration', '10:00', '18:00', '10:00', '15:00', 15),
  ('Management', '10:00', '18:00', '10:00', '15:00', 15);

-- 3. Update attendance_policies with correct values
UPDATE public.attendance_policies SET policy_value = '7.5' WHERE policy_key = 'min_full_day_hours';
UPDATE public.attendance_policies SET policy_value = '5' WHERE policy_key = 'half_day_min_hours';

-- 4. Add saturday-specific policy
INSERT INTO public.attendance_policies (policy_key, policy_value, label, description)
VALUES ('saturday_full_day_hours', '5', 'Saturday Full Day Hours', 'Minimum hours on Saturday to count as full day (Saturday is a short working day)')
ON CONFLICT DO NOTHING;

-- 5. Add total_lop column to payroll_runs for tracking
ALTER TABLE public.payroll_runs ADD COLUMN IF NOT EXISTS total_lop_days numeric DEFAULT 0;
