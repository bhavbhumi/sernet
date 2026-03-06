
-- Update sort_order for existing departments
UPDATE public.departments SET sort_order = 1 WHERE code = 'ADMIN';
UPDATE public.departments SET sort_order = 2 WHERE code = 'HR';
UPDATE public.departments SET sort_order = 3 WHERE code = 'SALES';
UPDATE public.departments SET sort_order = 4 WHERE code = 'MARKETING';
UPDATE public.departments SET sort_order = 5 WHERE code = 'SUPPORT';
UPDATE public.departments SET sort_order = 6 WHERE code = 'ACCOUNTS';
UPDATE public.departments SET sort_order = 7 WHERE code = 'LEGAL';

-- Add missing departments found in employees table
INSERT INTO public.departments (name, code, sort_order, is_active, description)
VALUES
  ('Leadership', 'LEADERSHIP', 0, true, 'Founders, Directors & Key Decision Makers'),
  ('Operations', 'OPS', 8, true, 'Operational processes and execution'),
  ('Technology', 'TECHNOLOGY', 9, true, 'IT, development, and systems'),
  ('Finance & Accounts', 'FIN', 10, true, 'Financial planning, accounting, and compliance')
ON CONFLICT DO NOTHING;

-- Seed designations from existing employee data
INSERT INTO public.designations (title, level, is_active, sort_order)
VALUES
  ('Founder & Promoter', 1, true, 1),
  ('Strategy & Technology', 2, true, 2),
  ('Partner in Prosperity', 3, true, 3),
  ('Client Relationship Manager', 4, true, 4),
  ('Dealer', 5, true, 5),
  ('Research Intern', 6, true, 6),
  ('Client Support Executive', 7, true, 7),
  ('Executive Assistant', 8, true, 8),
  ('Office Admin', 9, true, 9)
ON CONFLICT DO NOTHING;

-- Seed locations from existing job_openings data
INSERT INTO public.locations (name, city, state, location_type, is_active, sort_order)
VALUES
  ('Mumbai Head Office', 'Mumbai', 'Maharashtra', 'head_office', true, 1)
ON CONFLICT DO NOTHING;
