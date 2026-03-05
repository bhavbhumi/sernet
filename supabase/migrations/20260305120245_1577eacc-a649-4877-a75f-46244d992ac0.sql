-- Performance indexes on frequently queried columns

-- Content tables: status + published_at
CREATE INDEX IF NOT EXISTS idx_awareness_status ON public.awareness(status);
CREATE INDEX IF NOT EXISTS idx_awareness_published_at ON public.awareness(published_at DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_articles_status ON public.articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON public.articles(published_at DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_analyses_status ON public.analyses(status);
CREATE INDEX IF NOT EXISTS idx_analyses_published_at ON public.analyses(published_at DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_bulletins_status ON public.bulletins(status);
CREATE INDEX IF NOT EXISTS idx_bulletins_published_at ON public.bulletins(published_at DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_circulars_status ON public.circulars(status);
CREATE INDEX IF NOT EXISTS idx_circulars_published_at ON public.circulars(published_at DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_news_items_status ON public.news_items(status);
CREATE INDEX IF NOT EXISTS idx_news_items_published_at ON public.news_items(published_at DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_reports_status ON public.reports(status);
CREATE INDEX IF NOT EXISTS idx_press_items_status ON public.press_items(status);
CREATE INDEX IF NOT EXISTS idx_job_openings_status ON public.job_openings(status);

-- CRM & operational tables
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_crm_contacts_relationship ON public.crm_contacts(relationship_type);
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_status ON public.profiles(status);
CREATE INDEX IF NOT EXISTS idx_profiles_user_type ON public.profiles(user_type);

-- Support tables
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON public.support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_support_tickets_created_at ON public.support_tickets(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_support_tickets_contact ON public.support_tickets(contact_id);
CREATE INDEX IF NOT EXISTS idx_kb_articles_status ON public.kb_articles(status);

-- Calendar tables
CREATE INDEX IF NOT EXISTS idx_corporate_events_date ON public.corporate_events(event_date);
CREATE INDEX IF NOT EXISTS idx_economic_events_date ON public.economic_events(event_date);
CREATE INDEX IF NOT EXISTS idx_market_holidays_date ON public.market_holidays(holiday_date);
CREATE INDEX IF NOT EXISTS idx_market_holidays_year ON public.market_holidays(year);

-- Workflow tables
CREATE INDEX IF NOT EXISTS idx_workflow_rules_entity ON public.workflow_rules(entity_type);
CREATE INDEX IF NOT EXISTS idx_workflow_rules_active ON public.workflow_rules(is_active);
CREATE INDEX IF NOT EXISTS idx_workflow_logs_rule ON public.workflow_logs(rule_id);
CREATE INDEX IF NOT EXISTS idx_workflow_logs_created ON public.workflow_logs(created_at DESC);

-- Remove duplicate triggers
DROP TRIGGER IF EXISTS trg_site_pages_updated_at ON public.site_pages;
DROP TRIGGER IF EXISTS trg_generate_ticket_number ON public.support_tickets;
DROP TRIGGER IF EXISTS trg_support_tickets_updated_at ON public.support_tickets;
DROP TRIGGER IF EXISTS trg_support_issue_types_updated_at ON public.support_issue_types;