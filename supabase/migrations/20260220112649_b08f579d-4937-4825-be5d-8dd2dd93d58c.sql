
-- Market Holidays table
CREATE TABLE public.market_holidays (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  holiday_date date NOT NULL,
  holiday_name text NOT NULL,
  day_of_week text,
  markets text NOT NULL DEFAULT 'NSE, BSE',
  year integer NOT NULL DEFAULT EXTRACT(YEAR FROM CURRENT_DATE)::integer,
  notes text,
  status text NOT NULL DEFAULT 'published',
  created_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.market_holidays ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage market holidays"
  ON public.market_holidays FOR ALL
  USING (is_admin(auth.uid()));

CREATE POLICY "Public can read published market holidays"
  ON public.market_holidays FOR SELECT
  USING (status = 'published');

-- Economic Events table
CREATE TABLE public.economic_events (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_date date NOT NULL,
  event_time text,
  event_name text NOT NULL,
  country text NOT NULL DEFAULT 'India',
  impact text NOT NULL DEFAULT 'medium' CHECK (impact IN ('high', 'medium', 'low')),
  previous_value text,
  forecast_value text,
  actual_value text,
  category text NOT NULL DEFAULT 'General',
  description text,
  status text NOT NULL DEFAULT 'published',
  created_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.economic_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage economic events"
  ON public.economic_events FOR ALL
  USING (is_admin(auth.uid()));

CREATE POLICY "Public can read published economic events"
  ON public.economic_events FOR SELECT
  USING (status = 'published');

-- Corporate Events table
CREATE TABLE public.corporate_events (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_date date NOT NULL,
  company_name text NOT NULL,
  ticker text,
  event_type text NOT NULL DEFAULT 'board' CHECK (event_type IN ('board', 'dividend', 'agm', 'bonus', 'split', 'buyback', 'rights', 'other')),
  event_details text,
  ex_date date,
  record_date date,
  amount text,
  status text NOT NULL DEFAULT 'published',
  created_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.corporate_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage corporate events"
  ON public.corporate_events FOR ALL
  USING (is_admin(auth.uid()));

CREATE POLICY "Public can read published corporate events"
  ON public.corporate_events FOR SELECT
  USING (status = 'published');

-- Triggers for updated_at
CREATE TRIGGER update_market_holidays_updated_at
  BEFORE UPDATE ON public.market_holidays
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_economic_events_updated_at
  BEFORE UPDATE ON public.economic_events
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_corporate_events_updated_at
  BEFORE UPDATE ON public.corporate_events
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
