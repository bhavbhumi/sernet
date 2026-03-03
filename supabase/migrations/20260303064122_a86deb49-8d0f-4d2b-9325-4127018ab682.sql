
-- ============================================================
-- Phase 3: Support Desk (Zoho Desk replacement)
-- ============================================================

-- 1. Ticket priority enum
CREATE TYPE public.ticket_priority AS ENUM ('low', 'medium', 'high', 'urgent');

-- 2. Ticket status enum
CREATE TYPE public.ticket_status AS ENUM ('open', 'in_progress', 'waiting_on_customer', 'resolved', 'closed');

-- 3. Ticket channel enum
CREATE TYPE public.ticket_channel AS ENUM ('phone', 'walk_in', 'website', 'email', 'portal');

-- ============================================================
-- TICKETS
-- ============================================================
CREATE TABLE public.support_tickets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_number TEXT NOT NULL UNIQUE,
  subject TEXT NOT NULL,
  description TEXT,
  priority ticket_priority NOT NULL DEFAULT 'medium',
  status ticket_status NOT NULL DEFAULT 'open',
  channel ticket_channel NOT NULL DEFAULT 'website',
  contact_id UUID REFERENCES public.crm_contacts(id) ON DELETE SET NULL,
  -- For public submissions without CRM link
  contact_name TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  assigned_to UUID,
  department TEXT DEFAULT 'support',
  tags TEXT[] DEFAULT '{}',
  resolved_at TIMESTAMPTZ,
  closed_at TIMESTAMPTZ,
  first_response_at TIMESTAMPTZ,
  due_date TIMESTAMPTZ,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

-- Auto-generate ticket number
CREATE OR REPLACE FUNCTION public.generate_ticket_number()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  seq_num INTEGER;
BEGIN
  SELECT COALESCE(MAX(
    CAST(NULLIF(regexp_replace(ticket_number, '[^0-9]', '', 'g'), '') AS INTEGER)
  ), 0) + 1 INTO seq_num FROM public.support_tickets;
  NEW.ticket_number := 'TKT-' || LPAD(seq_num::TEXT, 5, '0');
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_ticket_number
  BEFORE INSERT ON public.support_tickets
  FOR EACH ROW
  WHEN (NEW.ticket_number IS NULL OR NEW.ticket_number = '')
  EXECUTE FUNCTION public.generate_ticket_number();

-- Update timestamps
CREATE TRIGGER update_support_tickets_updated_at
  BEFORE UPDATE ON public.support_tickets
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- RLS policies
CREATE POLICY "Admins can manage tickets"
  ON public.support_tickets FOR ALL
  USING (is_admin(auth.uid()));

CREATE POLICY "Public can submit tickets"
  ON public.support_tickets FOR INSERT
  WITH CHECK (
    status = 'open'
    AND channel = 'website'
    AND assigned_to IS NULL
    AND created_by IS NULL
    AND resolved_at IS NULL
    AND closed_at IS NULL
    AND first_response_at IS NULL
  );

CREATE POLICY "Public can read own tickets by email"
  ON public.support_tickets FOR SELECT
  USING (
    contact_email IS NOT NULL
    AND contact_email = current_setting('request.headers', true)::json->>'x-ticket-email'
  );

-- ============================================================
-- TICKET REPLIES
-- ============================================================
CREATE TABLE public.ticket_replies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_id UUID NOT NULL REFERENCES public.support_tickets(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  is_internal BOOLEAN NOT NULL DEFAULT false,
  reply_by_name TEXT,
  reply_by_email TEXT,
  reply_by_user_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.ticket_replies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage replies"
  ON public.ticket_replies FOR ALL
  USING (is_admin(auth.uid()));

CREATE POLICY "Public can add replies to own tickets"
  ON public.ticket_replies FOR INSERT
  WITH CHECK (
    is_internal = false
    AND reply_by_user_id IS NULL
  );

CREATE POLICY "Public can read non-internal replies"
  ON public.ticket_replies FOR SELECT
  USING (is_internal = false);

-- ============================================================
-- KNOWLEDGE BASE
-- ============================================================
CREATE TABLE public.kb_articles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  body TEXT,
  category TEXT NOT NULL DEFAULT 'General',
  tags TEXT[] DEFAULT '{}',
  is_featured BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  helpful_count INTEGER DEFAULT 0,
  status content_status NOT NULL DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.kb_articles ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER update_kb_articles_updated_at
  BEFORE UPDATE ON public.kb_articles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE POLICY "Admins can manage KB articles"
  ON public.kb_articles FOR ALL
  USING (is_admin(auth.uid()));

CREATE POLICY "Public can read published KB articles"
  ON public.kb_articles FOR SELECT
  USING (status = 'published');

-- ============================================================
-- CANNED RESPONSES
-- ============================================================
CREATE TABLE public.canned_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  shortcode TEXT NOT NULL UNIQUE,
  body TEXT NOT NULL,
  category TEXT DEFAULT 'General',
  is_active BOOLEAN DEFAULT true,
  usage_count INTEGER DEFAULT 0,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.canned_responses ENABLE ROW LEVEL SECURITY;

CREATE TRIGGER update_canned_responses_updated_at
  BEFORE UPDATE ON public.canned_responses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE POLICY "Admins can manage canned responses"
  ON public.canned_responses FOR ALL
  USING (is_admin(auth.uid()));

-- Indexes
CREATE INDEX idx_tickets_status ON public.support_tickets(status);
CREATE INDEX idx_tickets_priority ON public.support_tickets(priority);
CREATE INDEX idx_tickets_contact_id ON public.support_tickets(contact_id);
CREATE INDEX idx_tickets_assigned_to ON public.support_tickets(assigned_to);
CREATE INDEX idx_tickets_created_at ON public.support_tickets(created_at DESC);
CREATE INDEX idx_ticket_replies_ticket_id ON public.ticket_replies(ticket_id);
CREATE INDEX idx_kb_articles_category ON public.kb_articles(category);
CREATE INDEX idx_kb_articles_slug ON public.kb_articles(slug);
