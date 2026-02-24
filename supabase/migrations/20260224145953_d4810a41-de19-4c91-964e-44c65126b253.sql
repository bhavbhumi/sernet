
-- Create awareness table mirroring articles structure
CREATE TABLE public.awareness (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  excerpt TEXT,
  body TEXT,
  author TEXT NOT NULL DEFAULT 'Research Desk',
  category TEXT NOT NULL,
  read_time TEXT,
  media_url TEXT,
  thumbnail_url TEXT,
  status public.content_status NOT NULL DEFAULT 'draft',
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID,
  item_date DATE
);

-- Enable RLS
ALTER TABLE public.awareness ENABLE ROW LEVEL SECURITY;

-- Public can read published awareness content
CREATE POLICY "Public can read published awareness"
  ON public.awareness
  FOR SELECT
  USING (status = 'published');

-- Admins can manage awareness content
CREATE POLICY "Admins can manage awareness"
  ON public.awareness
  FOR ALL
  USING (is_admin(auth.uid()));

-- Create updated_at trigger
CREATE TRIGGER update_awareness_updated_at
  BEFORE UPDATE ON public.awareness
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
