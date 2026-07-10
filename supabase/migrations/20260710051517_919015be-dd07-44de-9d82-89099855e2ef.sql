
-- These helpers are invoked inside RLS policies; the calling user needs EXECUTE.
GRANT EXECUTE ON FUNCTION public.is_admin(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_super_admin(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_department_access(uuid, department) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_employee_id_for_user(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.validate_deal_transition(uuid, crm_stage, crm_sub_status) TO authenticated;
