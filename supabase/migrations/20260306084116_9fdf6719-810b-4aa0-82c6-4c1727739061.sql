
-- Departments master
CREATE TABLE public.departments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  code text NOT NULL UNIQUE,
  description text,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage departments" ON public.departments FOR ALL TO authenticated USING (is_admin(auth.uid()));
CREATE POLICY "Public can read active departments" ON public.departments FOR SELECT USING (is_active = true);

-- Designations master
CREATE TABLE public.designations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL UNIQUE,
  level integer NOT NULL DEFAULT 0,
  department_id uuid REFERENCES public.departments(id) ON DELETE SET NULL,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.designations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage designations" ON public.designations FOR ALL TO authenticated USING (is_admin(auth.uid()));
CREATE POLICY "Public can read active designations" ON public.designations FOR SELECT USING (is_active = true);

-- Locations master
CREATE TABLE public.locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  city text NOT NULL,
  state text,
  pincode text,
  address text,
  location_type text NOT NULL DEFAULT 'branch',
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage locations" ON public.locations FOR ALL TO authenticated USING (is_admin(auth.uid()));
CREATE POLICY "Public can read active locations" ON public.locations FOR SELECT USING (is_active = true);
