
-- Pipeline configuration: stores stages and sub-statuses as rows instead of enums
CREATE TABLE public.pipeline_stages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pipeline_key text NOT NULL DEFAULT 'default',
  stage_key text NOT NULL,
  stage_label text NOT NULL,
  stage_color text NOT NULL DEFAULT 'bg-blue-500',
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(pipeline_key, stage_key)
);

CREATE TABLE public.pipeline_sub_statuses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  stage_id uuid NOT NULL REFERENCES public.pipeline_stages(id) ON DELETE CASCADE,
  sub_status_key text NOT NULL,
  sub_status_label text NOT NULL,
  color_class text NOT NULL DEFAULT 'bg-gray-100 text-gray-800',
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(stage_id, sub_status_key)
);

-- RLS
ALTER TABLE public.pipeline_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pipeline_sub_statuses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage pipeline stages" ON public.pipeline_stages FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Admins can manage pipeline sub-statuses" ON public.pipeline_sub_statuses FOR ALL USING (is_admin(auth.uid()));

-- Authenticated users can read (needed for pipeline UI)
CREATE POLICY "Authenticated can read pipeline stages" ON public.pipeline_stages FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can read pipeline sub-statuses" ON public.pipeline_sub_statuses FOR SELECT TO authenticated USING (true);

-- Seed default pipeline matching current hardcoded values
INSERT INTO public.pipeline_stages (pipeline_key, stage_key, stage_label, stage_color, sort_order) VALUES
  ('default', 'enquiry', 'Enquiry', 'bg-blue-500', 0),
  ('default', 'qualified', 'Qualified', 'bg-amber-500', 1),
  ('default', 'account', 'Account', 'bg-purple-500', 2),
  ('default', 'status', 'Status', 'bg-emerald-500', 3);

-- Seed sub-statuses
INSERT INTO public.pipeline_sub_statuses (stage_id, sub_status_key, sub_status_label, color_class, sort_order)
SELECT ps.id, v.key, v.label, v.color, v.sort_order
FROM public.pipeline_stages ps
CROSS JOIN (VALUES
  ('enquiry', 'contacted', 'Contacted', 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200', 0),
  ('enquiry', 'not_reachable', 'Not Reachable', 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200', 1),
  ('enquiry', 'not_interested', 'Not Interested', 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200', 2),
  ('enquiry', 'dnd', 'DND', 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200', 3),
  ('qualified', 'cold', 'Cold', 'bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-200', 0),
  ('qualified', 'warm', 'Warm', 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200', 1),
  ('qualified', 'hot', 'Hot', 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200', 2),
  ('account', 'documentation', 'Documentation', 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200', 0),
  ('account', 'kyc', 'KYC', 'bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200', 1),
  ('account', 'profile', 'Profile', 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200', 2),
  ('account', 'mandate', 'Mandate', 'bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900 dark:text-fuchsia-200', 3),
  ('status', 'active', 'Active', 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200', 0),
  ('status', 'dormant', 'Dormant', 'bg-stone-100 text-stone-800 dark:bg-stone-900 dark:text-stone-200', 1)
) AS v(stage, key, label, color, sort_order)
WHERE ps.stage_key = v.stage AND ps.pipeline_key = 'default';

-- Updated_at trigger
CREATE TRIGGER update_pipeline_stages_updated_at
  BEFORE UPDATE ON public.pipeline_stages
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
