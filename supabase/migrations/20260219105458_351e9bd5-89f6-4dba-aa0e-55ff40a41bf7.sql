
-- ============================================================
-- SERNET CMS: Complete Database Schema
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. ADMIN ROLES SYSTEM (separate table, no privilege escalation)
-- ============================================================

CREATE TYPE public.app_role AS ENUM ('super_admin', 'admin', 'editor');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'editor',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check admin role
CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id
      AND role IN ('super_admin', 'admin', 'editor')
  )
$$;

CREATE POLICY "Admins can view roles" ON public.user_roles
  FOR SELECT USING (public.is_admin(auth.uid()));

CREATE POLICY "Super admins can manage roles" ON public.user_roles
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'super_admin')
  );

-- ============================================================
-- 2. CMS SETTINGS (RSS feeds, content source toggle)
-- ============================================================

CREATE TABLE public.cms_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by UUID REFERENCES auth.users(id)
);

ALTER TABLE public.cms_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read settings" ON public.cms_settings FOR SELECT USING (true);
CREATE POLICY "Admins can manage settings" ON public.cms_settings FOR ALL USING (public.is_admin(auth.uid()));

-- Seed default settings
INSERT INTO public.cms_settings (key, value) VALUES
  ('news_source', '{"type": "cloud", "rss_urls": []}'),
  ('circulars_source', '{"type": "cloud", "rss_urls": []}'),
  ('wordpress_base_url', '{"url": ""}'),
  ('general', '{"site_name": "SERNET India", "tagline": "Your Financial Partner"}');

-- ============================================================
-- 3. ARTICLES (Insights > Articles tab)
-- ============================================================

CREATE TYPE public.article_format AS ENUM ('Text', 'Image', 'Audio', 'Video');
CREATE TYPE public.content_status AS ENUM ('draft', 'published', 'archived');

CREATE TABLE public.articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  excerpt TEXT,
  body TEXT,
  author TEXT NOT NULL DEFAULT 'Research Desk',
  format article_format NOT NULL DEFAULT 'Text',
  category TEXT NOT NULL,
  read_time TEXT,
  media_url TEXT,
  thumbnail_url TEXT,
  status content_status NOT NULL DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published articles" ON public.articles
  FOR SELECT USING (status = 'published');
CREATE POLICY "Admins can manage articles" ON public.articles
  FOR ALL USING (public.is_admin(auth.uid()));

-- ============================================================
-- 4. MARKET ANALYSIS (Insights > Analysis tab)
-- ============================================================

CREATE TABLE public.analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  excerpt TEXT,
  body TEXT,
  author TEXT NOT NULL DEFAULT 'Research Desk',
  category TEXT NOT NULL,
  icon_name TEXT DEFAULT 'TrendingUp',
  status content_status NOT NULL DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

ALTER TABLE public.analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published analyses" ON public.analyses
  FOR SELECT USING (status = 'published');
CREATE POLICY "Admins can manage analyses" ON public.analyses
  FOR ALL USING (public.is_admin(auth.uid()));

-- ============================================================
-- 5. RESEARCH REPORTS (Insights > Reports tab)
-- ============================================================

CREATE TABLE public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  report_type TEXT NOT NULL,
  pages INTEGER DEFAULT 0,
  file_url TEXT,
  status content_status NOT NULL DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published reports" ON public.reports
  FOR SELECT USING (status = 'published');
CREATE POLICY "Admins can manage reports" ON public.reports
  FOR ALL USING (public.is_admin(auth.uid()));

-- ============================================================
-- 6. BULLETIN BOARD (Insights > Bulletin tab)
-- ============================================================

CREATE TYPE public.bulletin_priority AS ENUM ('info', 'important', 'warning', 'success');

CREATE TABLE public.bulletins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  priority bulletin_priority NOT NULL DEFAULT 'info',
  status content_status NOT NULL DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

ALTER TABLE public.bulletins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published bulletins" ON public.bulletins
  FOR SELECT USING (status = 'published');
CREATE POLICY "Admins can manage bulletins" ON public.bulletins
  FOR ALL USING (public.is_admin(auth.uid()));

-- ============================================================
-- 7. NEWS (Updates > News tab — manual + RSS)
-- ============================================================

CREATE TABLE public.news_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  summary TEXT,
  source TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Market News',
  link TEXT,
  is_rss BOOLEAN DEFAULT false,
  rss_feed_url TEXT,
  status content_status NOT NULL DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

ALTER TABLE public.news_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published news" ON public.news_items
  FOR SELECT USING (status = 'published');
CREATE POLICY "Admins can manage news" ON public.news_items
  FOR ALL USING (public.is_admin(auth.uid()));

-- ============================================================
-- 8. CIRCULARS (Updates > Circulars tab — manual + RSS)
-- ============================================================

CREATE TABLE public.circulars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  summary TEXT,
  source TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'SEBI Circulars',
  link TEXT,
  is_rss BOOLEAN DEFAULT false,
  rss_feed_url TEXT,
  status content_status NOT NULL DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

ALTER TABLE public.circulars ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published circulars" ON public.circulars
  FOR SELECT USING (status = 'published');
CREATE POLICY "Admins can manage circulars" ON public.circulars
  FOR ALL USING (public.is_admin(auth.uid()));

-- ============================================================
-- 9. POLLS (Opinions > Polls tab)
-- ============================================================

CREATE TABLE public.polls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'General',
  status TEXT NOT NULL DEFAULT 'active',
  ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

CREATE TABLE public.poll_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  poll_id UUID REFERENCES public.polls(id) ON DELETE CASCADE NOT NULL,
  label TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0
);

CREATE TABLE public.poll_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  poll_id UUID REFERENCES public.polls(id) ON DELETE CASCADE NOT NULL,
  option_id UUID REFERENCES public.poll_options(id) ON DELETE CASCADE NOT NULL,
  voter_fingerprint TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poll_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poll_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active polls" ON public.polls FOR SELECT USING (true);
CREATE POLICY "Public can read poll options" ON public.poll_options FOR SELECT USING (true);
CREATE POLICY "Public can vote" ON public.poll_votes FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can read votes" ON public.poll_votes FOR SELECT USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can manage polls" ON public.polls FOR ALL USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can manage poll options" ON public.poll_options FOR ALL USING (public.is_admin(auth.uid()));

-- ============================================================
-- 10. SURVEYS (Opinions > Surveys tab)
-- ============================================================

CREATE TABLE public.surveys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'General',
  status TEXT NOT NULL DEFAULT 'active',
  estimated_time TEXT DEFAULT '5 mins',
  deadline_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

CREATE TABLE public.survey_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  survey_id UUID REFERENCES public.surveys(id) ON DELETE CASCADE NOT NULL,
  question TEXT NOT NULL,
  question_type TEXT NOT NULL DEFAULT 'text',
  options JSONB DEFAULT '[]',
  sort_order INTEGER DEFAULT 0,
  required BOOLEAN DEFAULT true
);

CREATE TABLE public.survey_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  survey_id UUID REFERENCES public.surveys(id) ON DELETE CASCADE NOT NULL,
  respondent_email TEXT,
  respondent_name TEXT,
  answers JSONB NOT NULL DEFAULT '{}',
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.survey_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.survey_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active surveys" ON public.surveys FOR SELECT USING (true);
CREATE POLICY "Public can read survey questions" ON public.survey_questions FOR SELECT USING (true);
CREATE POLICY "Public can submit responses" ON public.survey_responses FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can read responses" ON public.survey_responses FOR SELECT USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can manage surveys" ON public.surveys FOR ALL USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can manage questions" ON public.survey_questions FOR ALL USING (public.is_admin(auth.uid()));

-- ============================================================
-- 11. REVIEWS (About > Reviews — user submitted, admin approved)
-- ============================================================

CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  occupation TEXT,
  city TEXT,
  country TEXT DEFAULT 'IN',
  rating NUMERIC(3,1) NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review TEXT NOT NULL,
  review_type TEXT DEFAULT 'Client',
  source TEXT DEFAULT 'website',
  has_video BOOLEAN DEFAULT false,
  video_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  status TEXT NOT NULL DEFAULT 'pending',
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  approved_by UUID REFERENCES auth.users(id)
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read approved reviews" ON public.reviews
  FOR SELECT USING (status = 'approved');
CREATE POLICY "Public can submit reviews" ON public.reviews
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can manage reviews" ON public.reviews
  FOR ALL USING (public.is_admin(auth.uid()));

-- ============================================================
-- 12. JOB OPENINGS & APPLICATIONS (About > Careers)
-- ============================================================

CREATE TABLE public.job_openings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  department TEXT NOT NULL,
  location TEXT NOT NULL DEFAULT 'Mumbai',
  job_type TEXT NOT NULL DEFAULT 'Full-time',
  description TEXT,
  requirements TEXT,
  is_featured BOOLEAN DEFAULT false,
  status content_status NOT NULL DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

CREATE TABLE public.job_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES public.job_openings(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  preferred_role TEXT,
  cover_note TEXT,
  resume_url TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  applied_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  reviewed_by UUID REFERENCES auth.users(id),
  notes TEXT
);

ALTER TABLE public.job_openings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published jobs" ON public.job_openings
  FOR SELECT USING (status = 'published');
CREATE POLICY "Public can apply for jobs" ON public.job_applications
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can manage jobs" ON public.job_openings
  FOR ALL USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can manage applications" ON public.job_applications
  FOR ALL USING (public.is_admin(auth.uid()));

-- ============================================================
-- 13. PRESS MENTIONS (About > Press tab)
-- ============================================================

CREATE TABLE public.press_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  source TEXT NOT NULL,
  medium TEXT NOT NULL DEFAULT 'Web',
  link TEXT,
  is_featured BOOLEAN DEFAULT false,
  status content_status NOT NULL DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

ALTER TABLE public.press_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published press items" ON public.press_items
  FOR SELECT USING (status = 'published');
CREATE POLICY "Admins can manage press items" ON public.press_items
  FOR ALL USING (public.is_admin(auth.uid()));

-- ============================================================
-- 14. TEAM MEMBERS (About > Careers)
-- ============================================================

CREATE TABLE public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  position TEXT NOT NULL,
  department TEXT,
  photo_url TEXT,
  bio TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active team members" ON public.team_members
  FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage team" ON public.team_members
  FOR ALL USING (public.is_admin(auth.uid()));

-- ============================================================
-- 15. AUTO-UPDATE updated_at TRIGGER
-- ============================================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON public.articles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_analyses_updated_at BEFORE UPDATE ON public.analyses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_reports_updated_at BEFORE UPDATE ON public.reports FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_bulletins_updated_at BEFORE UPDATE ON public.bulletins FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_news_updated_at BEFORE UPDATE ON public.news_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_circulars_updated_at BEFORE UPDATE ON public.circulars FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_polls_updated_at BEFORE UPDATE ON public.polls FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_surveys_updated_at BEFORE UPDATE ON public.surveys FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON public.reviews FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON public.job_openings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_press_updated_at BEFORE UPDATE ON public.press_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_team_updated_at BEFORE UPDATE ON public.team_members FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- 16. STORAGE BUCKETS for media
-- ============================================================

INSERT INTO storage.buckets (id, name, public) VALUES
  ('cms-media', 'cms-media', true),
  ('cms-reports', 'cms-reports', true),
  ('cms-resumes', 'cms-resumes', false);

CREATE POLICY "Public can read cms-media" ON storage.objects
  FOR SELECT USING (bucket_id = 'cms-media');
CREATE POLICY "Admins can upload cms-media" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'cms-media' AND public.is_admin(auth.uid()));
CREATE POLICY "Admins can update cms-media" ON storage.objects
  FOR UPDATE USING (bucket_id = 'cms-media' AND public.is_admin(auth.uid()));
CREATE POLICY "Admins can delete cms-media" ON storage.objects
  FOR DELETE USING (bucket_id = 'cms-media' AND public.is_admin(auth.uid()));

CREATE POLICY "Public can read cms-reports" ON storage.objects
  FOR SELECT USING (bucket_id = 'cms-reports');
CREATE POLICY "Admins can upload cms-reports" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'cms-reports' AND public.is_admin(auth.uid()));
CREATE POLICY "Admins can update cms-reports" ON storage.objects
  FOR UPDATE USING (bucket_id = 'cms-reports' AND public.is_admin(auth.uid()));
CREATE POLICY "Admins can delete cms-reports" ON storage.objects
  FOR DELETE USING (bucket_id = 'cms-reports' AND public.is_admin(auth.uid()));

CREATE POLICY "Anyone can upload resumes" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'cms-resumes');
CREATE POLICY "Admins can read resumes" ON storage.objects
  FOR SELECT USING (bucket_id = 'cms-resumes' AND public.is_admin(auth.uid()));
