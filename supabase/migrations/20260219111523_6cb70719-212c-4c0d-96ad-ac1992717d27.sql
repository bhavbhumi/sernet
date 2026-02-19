-- Allow users to read their own role entry
-- Without this, the AdminGuard query returns null because the user
-- can't prove they're an admin before reading their own role (chicken-and-egg)
CREATE POLICY "Users can read own role"
ON public.user_roles
FOR SELECT
USING (user_id = auth.uid());