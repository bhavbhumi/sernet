
-- Allow employees to INSERT their own attendance logs
CREATE POLICY "Employees can insert own attendance"
ON public.attendance_logs
FOR INSERT
TO authenticated
WITH CHECK (employee_id = get_employee_id_for_user(auth.uid()));

-- Allow employees to UPDATE their own attendance logs (for check-out)
CREATE POLICY "Employees can update own attendance"
ON public.attendance_logs
FOR UPDATE
TO authenticated
USING (employee_id = get_employee_id_for_user(auth.uid()))
WITH CHECK (employee_id = get_employee_id_for_user(auth.uid()));
