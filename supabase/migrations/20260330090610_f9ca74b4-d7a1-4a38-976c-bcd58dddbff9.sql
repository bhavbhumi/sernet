
CREATE POLICY "Employees can view own payroll entries"
  ON public.payroll_entries
  FOR SELECT
  TO authenticated
  USING (employee_id = public.get_employee_id_for_user(auth.uid()));

CREATE POLICY "Employees can view own payroll runs"
  ON public.payroll_runs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.payroll_entries pe
      WHERE pe.payroll_run_id = id
        AND pe.employee_id = public.get_employee_id_for_user(auth.uid())
    )
  );
