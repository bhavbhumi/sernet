
CREATE TABLE public.statutory_challans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  challan_type TEXT NOT NULL,
  month INTEGER NOT NULL,
  year INTEGER NOT NULL,
  amount NUMERIC NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending',
  filed_on DATE,
  filed_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(challan_type, month, year)
);

ALTER TABLE public.statutory_challans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage statutory_challans"
  ON public.statutory_challans FOR ALL TO authenticated
  USING (public.is_admin(auth.uid()))
  WITH CHECK (public.is_admin(auth.uid()));

CREATE TRIGGER set_statutory_challans_updated_at
  BEFORE UPDATE ON public.statutory_challans
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
