
-- =============================================
-- FIX: Convert all RESTRICTIVE policies to PERMISSIVE
-- Root cause: All policies were created as RESTRICTIVE (using CREATE POLICY ... AS RESTRICTIVE)
-- PostgreSQL requires at least one PERMISSIVE policy for access; restrictive only narrows.
-- =============================================

-- ANALYSES
DROP POLICY IF EXISTS "Admins can manage analyses" ON public.analyses;
DROP POLICY IF EXISTS "Public can read published analyses" ON public.analyses;
CREATE POLICY "Admins can manage analyses" ON public.analyses FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Public can read published analyses" ON public.analyses FOR SELECT USING (status = 'published'::content_status);

-- ARTICLES
DROP POLICY IF EXISTS "Admins can manage articles" ON public.articles;
DROP POLICY IF EXISTS "Public can read published articles" ON public.articles;
CREATE POLICY "Admins can manage articles" ON public.articles FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Public can read published articles" ON public.articles FOR SELECT USING (status = 'published'::content_status);

-- ARTICLE_LIKES
DROP POLICY IF EXISTS "Public can like articles" ON public.article_likes;
DROP POLICY IF EXISTS "Public can read like counts" ON public.article_likes;
DROP POLICY IF EXISTS "Public can unlike own" ON public.article_likes;
CREATE POLICY "Public can like articles" ON public.article_likes FOR INSERT WITH CHECK ((fingerprint IS NOT NULL) AND (length(fingerprint) > 0) AND (EXISTS (SELECT 1 FROM articles a WHERE a.id = article_likes.article_id AND a.status = 'published'::content_status)));
CREATE POLICY "Public can read like counts" ON public.article_likes FOR SELECT USING (true);
CREATE POLICY "Public can unlike own" ON public.article_likes FOR DELETE USING (true);

-- ARTICLE_SHARES
DROP POLICY IF EXISTS "Public can read share counts" ON public.article_shares;
DROP POLICY IF EXISTS "Public can record shares" ON public.article_shares;
CREATE POLICY "Public can read share counts" ON public.article_shares FOR SELECT USING (true);
CREATE POLICY "Public can record shares" ON public.article_shares FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM articles a WHERE a.id = article_shares.article_id AND a.status = 'published'::content_status));

-- AUDIT_LOGS
DROP POLICY IF EXISTS "Admins can insert audit logs" ON public.audit_logs;
DROP POLICY IF EXISTS "Super admins can read audit logs" ON public.audit_logs;
CREATE POLICY "Admins can insert audit logs" ON public.audit_logs FOR INSERT WITH CHECK (is_admin(auth.uid()));
CREATE POLICY "Super admins can read audit logs" ON public.audit_logs FOR SELECT USING (is_super_admin(auth.uid()));

-- BULLETINS
DROP POLICY IF EXISTS "Admins can manage bulletins" ON public.bulletins;
DROP POLICY IF EXISTS "Public can read published bulletins" ON public.bulletins;
CREATE POLICY "Admins can manage bulletins" ON public.bulletins FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Public can read published bulletins" ON public.bulletins FOR SELECT USING (status = 'published'::content_status);

-- CALCULATOR_AI_LOGS
DROP POLICY IF EXISTS "Admins can manage calculator logs" ON public.calculator_ai_logs;
DROP POLICY IF EXISTS "Admins can read calculator logs" ON public.calculator_ai_logs;
DROP POLICY IF EXISTS "Public can insert calculator logs" ON public.calculator_ai_logs;
CREATE POLICY "Admins can manage calculator logs" ON public.calculator_ai_logs FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Public can insert calculator logs" ON public.calculator_ai_logs FOR INSERT WITH CHECK ((lead_captured = false) AND (turn_count >= 1) AND (turn_count <= 100));

-- CALCULATOR_LEADS
DROP POLICY IF EXISTS "Admins can manage calculator leads" ON public.calculator_leads;
DROP POLICY IF EXISTS "Admins can read calculator leads" ON public.calculator_leads;
DROP POLICY IF EXISTS "Public can submit calculator leads" ON public.calculator_leads;
CREATE POLICY "Admins can manage calculator leads" ON public.calculator_leads FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Public can submit calculator leads" ON public.calculator_leads FOR INSERT WITH CHECK (product_type = ANY (ARRAY['sip','lumpsum','goal','insurance','brokerage','margin']));

-- CIRCULARS
DROP POLICY IF EXISTS "Admins can manage circulars" ON public.circulars;
DROP POLICY IF EXISTS "Public can read published circulars" ON public.circulars;
CREATE POLICY "Admins can manage circulars" ON public.circulars FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Public can read published circulars" ON public.circulars FOR SELECT USING (status = 'published'::content_status);

-- CMS_SETTINGS
DROP POLICY IF EXISTS "Admins can manage settings" ON public.cms_settings;
DROP POLICY IF EXISTS "Public can read settings" ON public.cms_settings;
CREATE POLICY "Admins can manage settings" ON public.cms_settings FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Public can read settings" ON public.cms_settings FOR SELECT USING (true);

-- CONTENT_SUMMARIES
DROP POLICY IF EXISTS "Public can read summaries" ON public.content_summaries;
DROP POLICY IF EXISTS "Service role can manage summaries" ON public.content_summaries;
CREATE POLICY "Public can read summaries" ON public.content_summaries FOR SELECT USING (true);
CREATE POLICY "Service role can manage summaries" ON public.content_summaries FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

-- CORPORATE_EVENTS
DROP POLICY IF EXISTS "Admins can manage corporate events" ON public.corporate_events;
DROP POLICY IF EXISTS "Public can read published corporate events" ON public.corporate_events;
CREATE POLICY "Admins can manage corporate events" ON public.corporate_events FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Public can read published corporate events" ON public.corporate_events FOR SELECT USING (status = 'published');

-- ECONOMIC_EVENTS
DROP POLICY IF EXISTS "Admins can manage economic events" ON public.economic_events;
DROP POLICY IF EXISTS "Public can read published economic events" ON public.economic_events;
CREATE POLICY "Admins can manage economic events" ON public.economic_events FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Public can read published economic events" ON public.economic_events FOR SELECT USING (status = 'published');

-- JOB_APPLICATIONS
DROP POLICY IF EXISTS "Admins can manage applications" ON public.job_applications;
DROP POLICY IF EXISTS "Public can apply for jobs" ON public.job_applications;
CREATE POLICY "Admins can manage applications" ON public.job_applications FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Public can apply for jobs" ON public.job_applications FOR INSERT WITH CHECK ((status = 'new') AND (reviewed_by IS NULL) AND (notes IS NULL));

-- JOB_OPENINGS
DROP POLICY IF EXISTS "Admins can manage jobs" ON public.job_openings;
DROP POLICY IF EXISTS "Public can read published jobs" ON public.job_openings;
CREATE POLICY "Admins can manage jobs" ON public.job_openings FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Public can read published jobs" ON public.job_openings FOR SELECT USING (status = 'published'::content_status);

-- LEADS
DROP POLICY IF EXISTS "Admins can manage leads" ON public.leads;
DROP POLICY IF EXISTS "Public can submit leads" ON public.leads;
CREATE POLICY "Admins can manage leads" ON public.leads FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Public can submit leads" ON public.leads FOR INSERT WITH CHECK ((status = 'new') AND (source = ANY (ARRAY['website','schedule-call','ask-us','tieup','referral','calculator'])) AND (assigned_to IS NULL) AND (notes IS NULL));

-- LEGAL_PAGES
DROP POLICY IF EXISTS "Admins insert legal_pages" ON public.legal_pages;
DROP POLICY IF EXISTS "Admins update legal_pages" ON public.legal_pages;
DROP POLICY IF EXISTS "Public read legal_pages" ON public.legal_pages;
CREATE POLICY "Admins insert legal_pages" ON public.legal_pages FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role = ANY (ARRAY['admin'::app_role, 'super_admin'::app_role])));
CREATE POLICY "Admins update legal_pages" ON public.legal_pages FOR UPDATE USING (EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role = ANY (ARRAY['admin'::app_role, 'super_admin'::app_role])));
CREATE POLICY "Public read legal_pages" ON public.legal_pages FOR SELECT USING (true);

-- MARKET_HOLIDAYS
DROP POLICY IF EXISTS "Admins can manage market holidays" ON public.market_holidays;
DROP POLICY IF EXISTS "Public can read published market holidays" ON public.market_holidays;
CREATE POLICY "Admins can manage market holidays" ON public.market_holidays FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Public can read published market holidays" ON public.market_holidays FOR SELECT USING (status = 'published');

-- NEWS_ITEMS
DROP POLICY IF EXISTS "Admins can manage news" ON public.news_items;
DROP POLICY IF EXISTS "Public can read published news" ON public.news_items;
CREATE POLICY "Admins can manage news" ON public.news_items FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Public can read published news" ON public.news_items FOR SELECT USING (status = 'published'::content_status);

-- NEWSLETTER_SUBSCRIBERS
DROP POLICY IF EXISTS "Admins can delete newsletter subscribers" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Admins can update newsletter subscribers" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Admins can view newsletter subscribers" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Anyone can subscribe to newsletter" ON public.newsletter_subscribers;
DROP POLICY IF EXISTS "Public can resubscribe" ON public.newsletter_subscribers;
CREATE POLICY "Admins can delete newsletter subscribers" ON public.newsletter_subscribers FOR DELETE USING (is_admin(auth.uid()));
CREATE POLICY "Admins can update newsletter subscribers" ON public.newsletter_subscribers FOR UPDATE USING (is_admin(auth.uid()));
CREATE POLICY "Admins can view newsletter subscribers" ON public.newsletter_subscribers FOR SELECT USING (is_admin(auth.uid()));
CREATE POLICY "Anyone can subscribe to newsletter" ON public.newsletter_subscribers FOR INSERT WITH CHECK ((status = 'active') AND (unsubscribed_at IS NULL));
CREATE POLICY "Public can resubscribe" ON public.newsletter_subscribers FOR UPDATE USING (true) WITH CHECK ((status = 'active') AND (unsubscribed_at IS NULL));

-- NEWSLETTERS
DROP POLICY IF EXISTS "Admins can manage newsletters" ON public.newsletters;
CREATE POLICY "Admins can manage newsletters" ON public.newsletters FOR ALL USING (is_admin(auth.uid()));

-- POLLS
DROP POLICY IF EXISTS "Admins can manage polls" ON public.polls;
DROP POLICY IF EXISTS "Public can read active polls" ON public.polls;
CREATE POLICY "Admins can manage polls" ON public.polls FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Public can read active polls" ON public.polls FOR SELECT USING (status = 'active');

-- POLL_OPTIONS
DROP POLICY IF EXISTS "Admins can manage poll options" ON public.poll_options;
DROP POLICY IF EXISTS "Public can read poll options" ON public.poll_options;
CREATE POLICY "Admins can manage poll options" ON public.poll_options FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Public can read poll options" ON public.poll_options FOR SELECT USING (true);

-- POLL_VOTES
DROP POLICY IF EXISTS "Admins can read votes" ON public.poll_votes;
DROP POLICY IF EXISTS "Public can read vote counts" ON public.poll_votes;
DROP POLICY IF EXISTS "Public can vote on polls" ON public.poll_votes;
CREATE POLICY "Admins can read votes" ON public.poll_votes FOR SELECT USING (is_admin(auth.uid()));
CREATE POLICY "Public can read vote counts" ON public.poll_votes FOR SELECT USING (true);
CREATE POLICY "Public can vote on polls" ON public.poll_votes FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM polls p WHERE p.id = poll_votes.poll_id AND p.status = 'active'));

-- POLL_LIKES
DROP POLICY IF EXISTS "Public can like polls" ON public.poll_likes;
DROP POLICY IF EXISTS "Public can read poll likes" ON public.poll_likes;
DROP POLICY IF EXISTS "Public can unlike polls" ON public.poll_likes;
CREATE POLICY "Public can like polls" ON public.poll_likes FOR INSERT WITH CHECK ((fingerprint IS NOT NULL) AND (length(fingerprint) > 0));
CREATE POLICY "Public can read poll likes" ON public.poll_likes FOR SELECT USING (true);
CREATE POLICY "Public can unlike polls" ON public.poll_likes FOR DELETE USING (true);

-- PRESS_ITEMS
DROP POLICY IF EXISTS "Admins can manage press" ON public.press_items;
DROP POLICY IF EXISTS "Public can read published press" ON public.press_items;
CREATE POLICY "Admins can manage press" ON public.press_items FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Public can read published press" ON public.press_items FOR SELECT USING (status = 'published'::content_status);

-- REPORTS
DROP POLICY IF EXISTS "Admins can manage reports" ON public.reports;
DROP POLICY IF EXISTS "Public can read published reports" ON public.reports;
CREATE POLICY "Admins can manage reports" ON public.reports FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Public can read published reports" ON public.reports FOR SELECT USING (status = 'published'::content_status);

-- REVIEWS
DROP POLICY IF EXISTS "Admins can manage reviews" ON public.reviews;
DROP POLICY IF EXISTS "Public can read approved reviews" ON public.reviews;
DROP POLICY IF EXISTS "Public can submit reviews" ON public.reviews;
CREATE POLICY "Admins can manage reviews" ON public.reviews FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Public can read approved reviews" ON public.reviews FOR SELECT USING (status = 'approved');
CREATE POLICY "Public can submit reviews" ON public.reviews FOR INSERT WITH CHECK ((status = 'pending') AND (approved_by IS NULL) AND (is_featured IS NOT TRUE));

-- SITE_PAGES
DROP POLICY IF EXISTS "Admins can manage site pages" ON public.site_pages;
DROP POLICY IF EXISTS "Public can read site pages" ON public.site_pages;
CREATE POLICY "Admins can manage site pages" ON public.site_pages FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Public can read site pages" ON public.site_pages FOR SELECT USING (true);

-- SITE_SETTINGS
DROP POLICY IF EXISTS "Admins can manage site settings" ON public.site_settings;
DROP POLICY IF EXISTS "Public can read site settings" ON public.site_settings;
CREATE POLICY "Admins can manage site settings" ON public.site_settings FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Public can read site settings" ON public.site_settings FOR SELECT USING (true);

-- SURVEYS
DROP POLICY IF EXISTS "Admins can manage surveys" ON public.surveys;
DROP POLICY IF EXISTS "Public can read active surveys" ON public.surveys;
CREATE POLICY "Admins can manage surveys" ON public.surveys FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Public can read active surveys" ON public.surveys FOR SELECT USING (status = 'active');

-- SURVEY_QUESTIONS
DROP POLICY IF EXISTS "Admins can manage survey questions" ON public.survey_questions;
DROP POLICY IF EXISTS "Public can read survey questions" ON public.survey_questions;
CREATE POLICY "Admins can manage survey questions" ON public.survey_questions FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Public can read survey questions" ON public.survey_questions FOR SELECT USING (true);

-- SURVEY_RESPONSES
DROP POLICY IF EXISTS "Admins can read survey responses" ON public.survey_responses;
DROP POLICY IF EXISTS "Public can submit survey responses" ON public.survey_responses;
CREATE POLICY "Admins can read survey responses" ON public.survey_responses FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Public can submit survey responses" ON public.survey_responses FOR INSERT WITH CHECK (true);

-- SURVEY_LIKES
DROP POLICY IF EXISTS "Public can like surveys" ON public.survey_likes;
DROP POLICY IF EXISTS "Public can read survey likes" ON public.survey_likes;
DROP POLICY IF EXISTS "Public can unlike surveys" ON public.survey_likes;
CREATE POLICY "Public can like surveys" ON public.survey_likes FOR INSERT WITH CHECK ((fingerprint IS NOT NULL) AND (length(fingerprint) > 0));
CREATE POLICY "Public can read survey likes" ON public.survey_likes FOR SELECT USING (true);
CREATE POLICY "Public can unlike surveys" ON public.survey_likes FOR DELETE USING (true);

-- TEAM_MEMBERS
DROP POLICY IF EXISTS "Admins can manage team members" ON public.team_members;
DROP POLICY IF EXISTS "Public can read active team members" ON public.team_members;
CREATE POLICY "Admins can manage team members" ON public.team_members FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Public can read active team members" ON public.team_members FOR SELECT USING (is_active = true);

-- USER_ROLES
DROP POLICY IF EXISTS "Admins can manage user roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can read own role" ON public.user_roles;
CREATE POLICY "Admins can manage user roles" ON public.user_roles FOR ALL USING (is_super_admin(auth.uid()));
CREATE POLICY "Users can read own role" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
