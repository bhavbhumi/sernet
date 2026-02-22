
-- Newsletters table for composing and scheduling
CREATE TABLE public.newsletters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  subject TEXT NOT NULL,
  body TEXT,
  preview_text TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  target_preferences TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'draft',
  scheduled_at TIMESTAMP WITH TIME ZONE,
  sent_at TIMESTAMP WITH TIME ZONE,
  recipient_count INTEGER DEFAULT 0,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.newsletters ENABLE ROW LEVEL SECURITY;

-- Admin-only access
CREATE POLICY "Admins can manage newsletters"
  ON public.newsletters
  FOR ALL
  USING (is_admin(auth.uid()));
