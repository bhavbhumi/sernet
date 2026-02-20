
-- Drop the default first, then change type, then set new default
ALTER TABLE public.market_holidays ALTER COLUMN holiday_type DROP DEFAULT;

ALTER TABLE public.market_holidays 
  ALTER COLUMN holiday_type TYPE text[] 
  USING ARRAY[holiday_type];

ALTER TABLE public.market_holidays 
  ALTER COLUMN holiday_type SET DEFAULT ARRAY['Market']::text[];

ALTER TABLE public.market_holidays 
  ALTER COLUMN holiday_type SET NOT NULL;
