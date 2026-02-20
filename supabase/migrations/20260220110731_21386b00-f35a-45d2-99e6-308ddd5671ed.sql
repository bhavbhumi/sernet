
CREATE TABLE public.calculator_ai_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id text NOT NULL,
  calc_type text NOT NULL,
  turn_count integer NOT NULL DEFAULT 1,
  lead_captured boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.calculator_ai_logs ENABLE ROW LEVEL SECURITY;

-- Public can insert logs (anonymous usage)
CREATE POLICY "Public can insert calculator logs"
ON public.calculator_ai_logs
FOR INSERT
WITH CHECK (true);

-- Only admins can read logs
CREATE POLICY "Admins can read calculator logs"
ON public.calculator_ai_logs
FOR SELECT
USING (is_admin(auth.uid()));

-- Only admins can update/delete logs
CREATE POLICY "Admins can manage calculator logs"
ON public.calculator_ai_logs
FOR ALL
USING (is_admin(auth.uid()));
