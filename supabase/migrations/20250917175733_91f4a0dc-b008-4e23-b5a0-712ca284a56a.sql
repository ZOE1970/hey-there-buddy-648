-- Fix Google OAuth signup failure: user_profiles constraint and RLS recursion
BEGIN;

-- 1) Ensure email column exists and safe format constraint
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'user_profiles' AND column_name = 'email'
  ) THEN
    ALTER TABLE public.user_profiles ADD COLUMN email text;
  END IF;
END $$;

-- Drop old strict/invalid constraint and recreate forgiving one
ALTER TABLE public.user_profiles DROP CONSTRAINT IF EXISTS valid_email_format;
ALTER TABLE public.user_profiles
  ADD CONSTRAINT valid_email_format CHECK (
    email IS NULL OR email ~* '^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$'
  );

-- 2) Update signup hook to also store email
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, first_name, last_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', NULL),
    COALESCE(NEW.raw_user_meta_data->>'last_name', NULL),
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Create the trigger on auth.users if it doesn't exist yet
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created'
  ) THEN
    CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
  END IF;
END;
$$;

-- 3) Replace recursive RLS policies on user_profiles with safe function-based checks
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies on user_profiles
DO $$ DECLARE pol RECORD;
BEGIN
  FOR pol IN SELECT policyname FROM pg_policies WHERE schemaname='public' AND tablename='user_profiles'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.user_profiles', pol.policyname);
  END LOOP;
END $$;

-- Helper function to fetch current user's role without recursion
CREATE OR REPLACE FUNCTION public.get_current_user_role_user_profiles()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.user_profiles WHERE id = auth.uid();
$$;

-- Minimal, non-recursive policies
CREATE POLICY "Users can view own profile"
ON public.user_profiles
FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON public.user_profiles
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "Superadmins can view all profiles"
ON public.user_profiles
FOR SELECT
USING (public.get_current_user_role_user_profiles() = 'superadmin');

CREATE POLICY "Superadmins can insert profiles"
ON public.user_profiles
FOR INSERT
WITH CHECK (public.get_current_user_role_user_profiles() = 'superadmin');

CREATE POLICY "Superadmins can update all profiles"
ON public.user_profiles
FOR UPDATE
USING (public.get_current_user_role_user_profiles() = 'superadmin');

CREATE POLICY "Superadmins can delete profiles"
ON public.user_profiles
FOR DELETE
USING (public.get_current_user_role_user_profiles() = 'superadmin' AND id <> auth.uid());

COMMIT;