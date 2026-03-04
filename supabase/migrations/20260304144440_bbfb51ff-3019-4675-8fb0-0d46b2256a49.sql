
ALTER TABLE public.crm_contacts
  ADD COLUMN IF NOT EXISTS entity_sub_type text,
  ADD COLUMN IF NOT EXISTS tan text,
  ADD COLUMN IF NOT EXISTS cin text,
  ADD COLUMN IF NOT EXISTS gstin text,
  ADD COLUMN IF NOT EXISTS date_of_incorporation date;

-- Update existing 'company' contact_type to 'non_individual'
UPDATE public.crm_contacts SET contact_type = 'non_individual' WHERE contact_type = 'company';
