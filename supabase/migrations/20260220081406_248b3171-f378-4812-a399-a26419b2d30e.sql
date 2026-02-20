
CREATE TABLE public.calculator_leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  goal_text TEXT NOT NULL,
  product_type TEXT NOT NULL DEFAULT 'sip',
  calculated_result JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.calculator_leads ENABLE ROW LEVEL SECURITY;

-- Anyone can submit a lead
CREATE POLICY "Public can submit calculator leads"
  ON public.calculator_leads
  FOR INSERT
  WITH CHECK (true);

-- Only admins can read leads
CREATE POLICY "Admins can read calculator leads"
  ON public.calculator_leads
  FOR SELECT
  USING (is_admin(auth.uid()));

CREATE POLICY "Admins can manage calculator leads"
  ON public.calculator_leads
  FOR ALL
  USING (is_admin(auth.uid()));
