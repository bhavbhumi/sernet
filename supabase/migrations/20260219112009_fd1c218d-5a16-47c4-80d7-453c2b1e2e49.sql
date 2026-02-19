-- Drop all existing policies on user_roles (they cause infinite recursion)
DROP POLICY IF EXISTS "Admins can view roles" ON public.user_roles;
DROP POLICY IF EXISTS "Super admins can manage roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can read own role" ON public.user_roles;

-- Create a security definer function to check super_admin (avoids recursion)
CREATE OR REPLACE FUNCTION public.is_super_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id
      AND role = 'super_admin'
  )
$$;

-- Users can always read their own role (needed for AdminGuard)
CREATE POLICY "Users can read own role"
ON public.user_roles
FOR SELECT
USING (user_id = auth.uid());

-- Super admins can manage all roles (INSERT/UPDATE/DELETE) via security definer
CREATE POLICY "Super admins can manage roles"
ON public.user_roles
FOR ALL
USING (public.is_super_admin(auth.uid()))
WITH CHECK (public.is_super_admin(auth.uid()));