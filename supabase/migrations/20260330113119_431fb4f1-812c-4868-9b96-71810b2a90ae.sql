
-- Attendance policy configuration table
CREATE TABLE public.attendance_policies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  policy_key text NOT NULL UNIQUE,
  policy_value text NOT NULL,
  label text NOT NULL,
  description text,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.attendance_policies ENABLE ROW LEVEL SECURITY;

-- Admin full access
CREATE POLICY "Admins manage attendance policies"
ON public.attendance_policies FOR ALL TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

-- All authenticated can read policies (needed for employee portal)
CREATE POLICY "Authenticated can read attendance policies"
ON public.attendance_policies FOR SELECT TO authenticated
USING (true);

-- Seed default policies
INSERT INTO public.attendance_policies (policy_key, policy_value, label, description) VALUES
  ('office_start_time', '10:00', 'Office Start Time', 'Expected check-in time (HH:MM, 24h format)'),
  ('grace_period_minutes', '15', 'Grace Period (minutes)', 'Buffer minutes after start time before marking late'),
  ('half_day_after_time', '12:00', 'Half Day After Time', 'Check-in after this time counts as half day'),
  ('min_full_day_hours', '7', 'Minimum Full Day Hours', 'Minimum hours worked to count as full day'),
  ('half_day_min_hours', '3', 'Half Day Minimum Hours', 'Minimum hours for half day (below = absent)'),
  ('auto_absent_if_no_checkin', 'true', 'Auto-mark Absent', 'Automatically treat no check-in as absent'),
  ('week_off_days', '0', 'Weekly Off Days', 'Day numbers (0=Sunday, 6=Saturday) comma separated');
