
-- 1. Products master table with parent-child hierarchy
CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  icon_name text,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage products" ON public.products FOR ALL TO authenticated USING (is_admin(auth.uid()));
CREATE POLICY "Public can read active products" ON public.products FOR SELECT USING (is_active = true);

-- 2. Add product_id to pipeline_stages for per-product pipelines
ALTER TABLE public.pipeline_stages ADD COLUMN product_id uuid REFERENCES public.products(id) ON DELETE SET NULL;

-- 3. Add product_id to crm_deals for product linkage
ALTER TABLE public.crm_deals ADD COLUMN product_id uuid REFERENCES public.products(id) ON DELETE SET NULL;

-- 4. Trigger for updated_at on products
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
