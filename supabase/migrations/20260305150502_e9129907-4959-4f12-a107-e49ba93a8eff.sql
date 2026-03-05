
-- Campaigns table
CREATE TABLE public.campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  campaign_type text NOT NULL DEFAULT 'email',
  status text NOT NULL DEFAULT 'draft',
  description text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  start_date date,
  end_date date,
  budget numeric DEFAULT 0,
  target_audience text,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage campaigns" ON public.campaigns FOR ALL USING (is_admin(auth.uid()));

-- Events table
CREATE TABLE public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  event_type text NOT NULL DEFAULT 'webinar',
  status text NOT NULL DEFAULT 'draft',
  description text,
  venue text,
  meeting_link text,
  event_date date NOT NULL,
  event_time text,
  duration_minutes integer DEFAULT 60,
  capacity integer,
  speaker text,
  campaign_id uuid REFERENCES public.campaigns(id) ON DELETE SET NULL,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage events" ON public.events FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Public can read published events" ON public.events FOR SELECT USING (status = 'published');

-- Event registrations
CREATE TABLE public.event_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  email text,
  phone text NOT NULL,
  company text,
  status text NOT NULL DEFAULT 'registered',
  attended boolean DEFAULT false,
  lead_id uuid REFERENCES public.leads(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage event registrations" ON public.event_registrations FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Public can register for events" ON public.event_registrations FOR INSERT WITH CHECK (status = 'registered');

-- Updated_at triggers
CREATE TRIGGER trg_campaigns_updated_at BEFORE UPDATE ON public.campaigns FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_events_updated_at BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
