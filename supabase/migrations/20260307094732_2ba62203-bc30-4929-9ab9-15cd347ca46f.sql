
ALTER TABLE public.attendance_logs
  ADD COLUMN IF NOT EXISTS latitude double precision,
  ADD COLUMN IF NOT EXISTS longitude double precision,
  ADD COLUMN IF NOT EXISTS location_type text NOT NULL DEFAULT 'office',
  ADD COLUMN IF NOT EXISTS address_snapshot text;
