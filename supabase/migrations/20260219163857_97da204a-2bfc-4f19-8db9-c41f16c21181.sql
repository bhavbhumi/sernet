
-- Site Pages table: stores SEO metadata and maintenance status per page
CREATE TABLE public.site_pages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  path TEXT NOT NULL UNIQUE,
  section TEXT NOT NULL DEFAULT 'Main',
  description TEXT,
  meta_title TEXT,
  meta_description TEXT,
  maintenance_mode BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'live', -- 'live' | 'hidden' | 'coming_soon'
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.site_pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage site pages"
  ON public.site_pages FOR ALL
  USING (is_admin(auth.uid()));

CREATE POLICY "Public can read site pages"
  ON public.site_pages FOR SELECT
  USING (true);

-- Site Settings table: stores branding, logo, favicon, typography settings
CREATE TABLE public.site_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_by UUID
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage site settings"
  ON public.site_settings FOR ALL
  USING (is_admin(auth.uid()));

CREATE POLICY "Public can read site settings"
  ON public.site_settings FOR SELECT
  USING (true);

-- Trigger to update updated_at on site_pages
CREATE OR REPLACE FUNCTION public.update_site_pages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_site_pages_updated_at
  BEFORE UPDATE ON public.site_pages
  FOR EACH ROW EXECUTE FUNCTION public.update_site_pages_updated_at();

-- Seed site_pages with all known routes
INSERT INTO public.site_pages (title, path, section, description, status, sort_order) VALUES
  ('Home', '/', 'Main', 'Hero, Stats, Pricing, Testimonials, Ecosystem', 'live', 1),
  ('Services', '/services', 'Main', 'Trading, Investment, Insurance, Estate Planning, Education, Credit Counselling', 'live', 2),
  ('Pricing', '/pricing', 'Main', 'Zero brokerage pricing plans', 'live', 3),
  ('Open Account', '/open-account', 'Main', 'Account opening flow', 'live', 4),
  ('About – Company', '/about', 'About', 'Company overview, journey, philosophy', 'live', 5),
  ('Careers', '/about?tab=Careers', 'About', 'Job openings & team members', 'live', 6),
  ('Press & Media', '/about?tab=Press', 'About', 'Press mentions & featured coverage', 'live', 7),
  ('Recognition', '/about?tab=Recognition', 'About', 'Awards & achievements', 'live', 8),
  ('Reviews', '/about?tab=Reviews', 'About', 'Client testimonials', 'live', 9),
  ('Network', '/network', 'Network', 'Clients, Partners, Principals', 'live', 10),
  ('Tick Funds', '/tickfunds', 'Network', 'Tick Funds product page', 'live', 11),
  ('Tushil', '/tushil', 'Network', 'Tushil platform page', 'live', 12),
  ('Choice FinX', '/choicefinx', 'Network', 'Choice FinX product page', 'live', 13),
  ('Findemy', '/findemy', 'Network', 'Findemy product page', 'live', 14),
  ('Z-Connect Hub', '/z-connect', 'Insights', 'Articles, Analysis, Reports, Bulletin', 'live', 15),
  ('Updates', '/updates', 'Insights', 'News & Circulars', 'live', 16),
  ('Videos', '/videos', 'Insights', 'Video library', 'live', 17),
  ('Trading Q&A', '/tradingqna', 'Insights', 'Trading questions and answers', 'live', 18),
  ('Calculators Hub', '/calculators', 'Tools', 'All calculators landing page', 'live', 19),
  ('SIP Calculator', '/calculators/sip', 'Tools', 'SIP returns calculator', 'live', 20),
  ('Lumpsum Calculator', '/calculators/lumpsum', 'Tools', 'Lumpsum returns calculator', 'live', 21),
  ('Brokerage Calculator', '/calculators/brokerage', 'Tools', 'Brokerage fee calculator', 'live', 22),
  ('Margin Calculator', '/calculators/margin', 'Tools', 'Margin requirement calculator', 'live', 23),
  ('Market Overview', '/market-overview', 'Tools', 'Live market data widget', 'live', 24),
  ('Calendars', '/calendars', 'Tools', 'Economic & corporate calendars', 'live', 25),
  ('Market Holidays', '/market-holidays', 'Tools', 'Exchange holiday list', 'live', 26),
  ('Economic Calendar', '/economic-calendar', 'Tools', 'Macro economic events', 'live', 27),
  ('Opinions', '/opinions', 'Engagement', 'Polls & Surveys', 'live', 28),
  ('Public Reviews', '/reviews', 'Engagement', 'All public reviews', 'live', 29),
  ('Downloads', '/downloads', 'Engagement', 'Apps & document downloads', 'live', 30),
  ('Contact', '/contact', 'Support', 'Ask Us, Schedule Call, Visit Us', 'live', 31),
  ('Support / Help Desk', '/support', 'Support', 'Help desk & ticket submission', 'live', 32),
  ('Quick Links', '/quick-links', 'Support', 'Broker quick links', 'live', 33),
  ('Schedule a Call', '/schedule-call', 'Support', 'Book a consultation call', 'live', 34),
  ('Fund Transfer', '/fund-transfer', 'Support', 'Fund transfer instructions', 'live', 35),
  ('Lodge a Complaint', '/complaints', 'Support', 'Lodge a complaint', 'live', 36),
  ('Complaint Status', '/complaints/status', 'Support', 'Check complaint status', 'live', 37),
  ('Credit Claim', '/credit-claim', 'Support', 'Credit claim form', 'live', 38),
  ('Terms & Conditions', '/terms', 'Legal', 'Terms of service', 'live', 39),
  ('Privacy Policy', '/privacy', 'Legal', 'Privacy & data handling', 'live', 40),
  ('Policies', '/policies', 'Legal', 'All compliance policies', 'live', 41),
  ('Disclosures', '/disclosure', 'Legal', 'SEBI mandatory disclosures', 'live', 42),
  ('Investor Charter', '/investor-charter', 'Legal', 'SEBI investor charter', 'live', 43),
  ('Sitemap', '/sitemap', 'Legal', 'Full site directory', 'live', 44),
  ('Philosophy', '/about/philosophy', 'Company', 'Investment philosophy', 'live', 45),
  ('Technology', '/tech', 'Company', 'Technology & infrastructure', 'live', 46),
  ('CSR', '/csr', 'Company', 'Corporate social responsibility', 'live', 47),
  ('Media', '/media', 'Company', 'Media & press gallery', 'live', 48);

-- Seed initial site settings keys
INSERT INTO public.site_settings (key, value) VALUES
  ('branding', '{"site_name": "SERNET", "tagline": "Your Trusted Financial Partner", "primary_color": "#1a56db", "secondary_color": "#7e3af2", "accent_color": "#0694a2"}'),
  ('typography', '{"heading_font": "Inter", "body_font": "Inter", "base_font_size": "16px"}'),
  ('identity', '{"logo_url": "", "favicon_url": "", "og_image_url": "", "logo_dark_url": ""}')
ON CONFLICT (key) DO NOTHING;
