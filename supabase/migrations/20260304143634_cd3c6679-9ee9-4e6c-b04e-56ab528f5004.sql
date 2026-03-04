
ALTER TABLE public.crm_contacts
  ADD COLUMN IF NOT EXISTS gender text,
  ADD COLUMN IF NOT EXISTS date_of_birth date,
  ADD COLUMN IF NOT EXISTS tax_status text DEFAULT 'resident_indian',
  ADD COLUMN IF NOT EXISTS aadhaar text,
  ADD COLUMN IF NOT EXISTS ckyc_number text;
