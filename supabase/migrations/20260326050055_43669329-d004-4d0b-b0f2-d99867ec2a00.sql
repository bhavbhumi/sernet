
-- Security definer function to get employee_id for a user
CREATE OR REPLACE FUNCTION public.get_employee_id_for_user(_user_id uuid)
RETURNS uuid
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM public.employees WHERE user_id = _user_id AND status = 'active' LIMIT 1
$$;

-- Employees can read their own record
CREATE POLICY "Employees can read own record"
ON public.employees
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Employees can read their own attendance
CREATE POLICY "Employees can read own attendance"
ON public.attendance_logs
FOR SELECT
TO authenticated
USING (employee_id = public.get_employee_id_for_user(auth.uid()));

-- Employees can read their own leave requests
CREATE POLICY "Employees can read own leave requests"
ON public.leave_requests
FOR SELECT
TO authenticated
USING (employee_id = public.get_employee_id_for_user(auth.uid()));

-- Employees can read leave types (needed for joins)
CREATE POLICY "Authenticated can read leave types"
ON public.leave_types
FOR SELECT
TO authenticated
USING (is_active = true);
