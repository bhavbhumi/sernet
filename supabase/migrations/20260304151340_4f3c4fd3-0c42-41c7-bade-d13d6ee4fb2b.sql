
-- Create user_type enum
CREATE TYPE public.portal_user_type AS ENUM ('client', 'partner');

-- Create profiles table
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  user_type portal_user_type NOT NULL DEFAULT 'client',
  full_name text NOT NULL DEFAULT '',
  phone text,
  email text,
  city text,
  state text,
  pan text,
  date_of_birth date,
  gender text,
  tax_status text DEFAULT 'resident_indian',
  kyc_status text NOT NULL DEFAULT 'pending',
  crm_contact_id uuid REFERENCES public.crm_contacts(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'active',
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Users can read/update their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Admins can manage all profiles
CREATE POLICY "Admins can manage profiles"
  ON public.profiles FOR ALL
  TO authenticated
  USING (public.is_admin(auth.uid()));

-- Auto-create profile on signup trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only create profile for non-admin users (admin users use user_roles)
  -- Check if user_type is set in metadata
  IF NEW.raw_user_meta_data->>'user_type' IS NOT NULL THEN
    INSERT INTO public.profiles (user_id, user_type, full_name, email, phone, status)
    VALUES (
      NEW.id,
      (NEW.raw_user_meta_data->>'user_type')::portal_user_type,
      COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', ''),
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'phone', ''),
      CASE 
        WHEN (NEW.raw_user_meta_data->>'user_type') = 'partner' THEN 'pending_approval'
        ELSE 'active'
      END
    );
  END IF;
  RETURN NEW;
END;
$$;

-- Attach trigger to auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Updated_at trigger
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
