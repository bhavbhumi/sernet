
-- 1. Storage: drop overly-broad SELECT listing policies on public buckets (CDN still serves files by URL)
DROP POLICY IF EXISTS "Public can read cms-media" ON storage.objects;
DROP POLICY IF EXISTS "Public read access for cms-media" ON storage.objects;
DROP POLICY IF EXISTS "Public can read cms-reports" ON storage.objects;
DROP POLICY IF EXISTS "Public can read support documents" ON storage.objects;

-- 2. Storage: drop non-admin write policies on cms-media
DROP POLICY IF EXISTS "Authenticated users can upload to cms-media" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update cms-media" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete from cms-media" ON storage.objects;

-- 3. Revoke EXECUTE from anon/authenticated on internal SECURITY DEFINER helpers
REVOKE EXECUTE ON FUNCTION public.is_admin(uuid) FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.is_super_admin(uuid) FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.has_department_access(uuid, department) FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.get_employee_id_for_user(uuid) FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.validate_deal_transition(uuid, crm_stage, crm_sub_status) FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.fire_workflow_engine() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.generate_ticket_number() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.generate_invoice_number() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.calc_read_time() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.calculate_read_time() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.validate_newsletter_email() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.set_updated_at_fn() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.update_site_pages_updated_at() FROM anon, authenticated, public;

-- search_content is intentionally public (used by anonymous visitors); keep executable.
