CREATE TABLE public.download_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tab text NOT NULL CHECK (tab IN ('invest','insure','trade','other')),
  section text NOT NULL CHECK (section IN ('Apps','Account Opening','Information','Transactions','Service')),
  title text NOT NULL,
  note text,
  href text NOT NULL CHECK (href ~ '^https?://'),
  sort_order integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'published' CHECK (status IN ('draft','published','archived')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.download_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.download_items TO authenticated;
GRANT ALL ON public.download_items TO service_role;
ALTER TABLE public.download_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read published downloads" ON public.download_items FOR SELECT USING (status = 'published');
CREATE POLICY "Admins manage downloads" ON public.download_items FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE TRIGGER download_items_updated_at BEFORE UPDATE ON public.download_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX download_items_tab_idx ON public.download_items (tab, section, sort_order);

INSERT INTO public.download_items (tab, section, title, note, href, sort_order) VALUES
('invest','Apps','Tick Funds Web','Open in browser','https://tickfunds.sernetindia.com/login',1),
('invest','Apps','Tick Funds for Android','Google Play','https://play.google.com/store/apps/details?id=com.tick.funds.app&pcampaignid=web_share',2),
('invest','Apps','Tick Funds for iOS','App Store','https://apps.apple.com/us/app/tickfunds/id1534139413',3),
('invest','Information','Monthly Factsheets','Download from AMFI','https://www.amfiindia.com/online-center/download-factsheets',1),
('invest','Information','MF Scheme Master Documents','Download from SEBI','https://www.sebi.gov.in/filings/mutual-funds.html',2),
('insure','Apps','Tushil Web','Open in browser','https://insure.tushil.sernetindia.com',1),
('trade','Apps','Choice FinX for Android','Google Play','https://play.google.com/store/apps/details?id=com.choiceequitybroking.jiffy&pcampaignid=web_share',1),
('trade','Apps','Choice FinX for iOS','App Store','https://apps.apple.com/in/app/choice-finx-stocks-demat-app/id1327801261',2);

CREATE TABLE public.ticket_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id uuid NOT NULL UNIQUE REFERENCES public.support_tickets(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  rating smallint NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment text CHECK (comment IS NULL OR length(comment) <= 1000),
  follow_up_status text NOT NULL DEFAULT 'none' CHECK (follow_up_status IN ('none','pending','done')),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.ticket_feedback TO authenticated;
GRANT ALL ON public.ticket_feedback TO service_role;
ALTER TABLE public.ticket_feedback ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Clients read own ticket feedback" ON public.ticket_feedback FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Clients rate own closed tickets" ON public.ticket_feedback FOR INSERT TO authenticated WITH CHECK (
  user_id = auth.uid() AND follow_up_status = (CASE WHEN rating <= 3 THEN 'pending' ELSE 'none' END)
  AND EXISTS (SELECT 1 FROM public.support_tickets t WHERE t.id = ticket_id AND t.created_by = auth.uid() AND t.status IN ('resolved','closed'))
);
CREATE POLICY "Admins manage ticket feedback" ON public.ticket_feedback FOR ALL TO authenticated USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

ALTER TABLE public.surveys ADD COLUMN IF NOT EXISTS external_url text;
COMMENT ON TABLE public.polls IS 'DEPRECATED: polls retired from admin and website (Nov 2026); data retained.';