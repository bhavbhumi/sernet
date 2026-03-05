
-- Permission presets (role templates per department)
CREATE TABLE public.permission_presets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  department text NOT NULL,
  module_keys text[] NOT NULL DEFAULT '{}',
  is_default boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.permission_presets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage presets" ON public.permission_presets
  FOR ALL TO authenticated
  USING (public.is_admin(auth.uid()));

-- Staff permissions (per-user module access)
CREATE TABLE public.staff_permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  allowed_modules text[] NOT NULL DEFAULT '{}',
  preset_id uuid REFERENCES public.permission_presets(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.staff_permissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own permissions" ON public.staff_permissions
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can manage permissions" ON public.staff_permissions
  FOR ALL TO authenticated
  USING (public.is_admin(auth.uid()));

-- Seed default presets
INSERT INTO public.permission_presets (name, department, module_keys, is_default) VALUES
('Marketing Full', 'marketing', ARRAY['marketing/content-studio','marketing/news-updates','marketing/engagement','marketing/press-media','marketing/calendars','marketing/website'], true),
('Sales Full', 'sales', ARRAY['sales/crm','sales/website-leads','sales/calculator-leads'], true),
('HR Full', 'hr', ARRAY['hr/recruitment','hr/personnel'], true),
('Accounts Full', 'accounts', ARRAY['accounts/masters','accounts/invoices','accounts/payroll','accounts/partner-payouts','accounts/commission-claims'], true),
('Support Full', 'support', ARRAY['support/tickets','support/classification','support/knowledge-base','support/documents','support/canned-responses'], true),
('Legal Full', 'legal', ARRAY['legal/legal-pages','legal/investor-charter','legal/agreements'], true);
