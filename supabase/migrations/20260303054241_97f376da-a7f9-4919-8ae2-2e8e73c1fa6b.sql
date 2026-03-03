
-- Create department enum
CREATE TYPE public.department AS ENUM ('marketing', 'sales', 'hr', 'accounts', 'support', 'legal');

-- Add department column to user_roles (nullable = full access for super_admin)
ALTER TABLE public.user_roles
ADD COLUMN department public.department NULL;

-- Security definer function: check if user has access to a specific department
CREATE OR REPLACE FUNCTION public.has_department_access(_user_id uuid, _dept public.department)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id
      AND (
        role = 'super_admin'              -- super admins have access to all departments
        OR department IS NULL             -- NULL department = all departments (legacy rows)
        OR department = _dept             -- explicit department match
      )
  )
$$;

-- Comment for documentation
COMMENT ON COLUMN public.user_roles.department IS 'NULL means all-department access (super_admin). Set to specific department for scoped access.';
