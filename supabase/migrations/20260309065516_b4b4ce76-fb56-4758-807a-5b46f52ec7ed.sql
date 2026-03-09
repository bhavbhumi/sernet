-- Add useful fields to leave_types for Indian compliance
ALTER TABLE public.leave_types 
  ADD COLUMN IF NOT EXISTS description text DEFAULT '',
  ADD COLUMN IF NOT EXISTS carry_forward boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS max_carry_days integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS encashable boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS applicable_gender text DEFAULT 'all',
  ADD COLUMN IF NOT EXISTS min_service_days integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS sort_order integer DEFAULT 0;