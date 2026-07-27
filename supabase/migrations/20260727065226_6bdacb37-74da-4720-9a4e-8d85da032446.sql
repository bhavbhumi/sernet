DO $$
DECLARE r record;
BEGIN
  FOR r IN
    SELECT c.relname AS tbl, p.polname AS pol
    FROM pg_policy p
    JOIN pg_class c ON c.oid = p.polrelid
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public'
      AND p.polroles = '{0}'::oid[]
      AND (coalesce(pg_get_expr(p.polqual, p.polrelid), '') || ' ' || coalesce(pg_get_expr(p.polwithcheck, p.polrelid), '')) ~* '(is_admin|is_super_admin)\('
  LOOP
    EXECUTE format('ALTER POLICY %I ON public.%I TO authenticated', r.pol, r.tbl);
  END LOOP;
END;
$$;