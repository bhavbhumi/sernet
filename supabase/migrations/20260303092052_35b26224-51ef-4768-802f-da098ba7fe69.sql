
-- Add public-facing columns to employees table
ALTER TABLE public.employees
  ADD COLUMN IF NOT EXISTS bio text,
  ADD COLUMN IF NOT EXISTS sort_order integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS is_public boolean DEFAULT false;

-- Migrate team_members data into employees
INSERT INTO public.employees (full_name, designation, department, photo_url, bio, sort_order, is_public, status, employment_type)
SELECT 
  name, 
  position, 
  COALESCE(department, 'General'),
  photo_url,
  bio,
  sort_order,
  true,  -- mark as public-facing
  'active',
  'full_time'
FROM public.team_members
ON CONFLICT DO NOTHING;
