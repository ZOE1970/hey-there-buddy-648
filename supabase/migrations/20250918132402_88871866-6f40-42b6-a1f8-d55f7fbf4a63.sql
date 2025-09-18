-- Drop the existing constraint and add a new one that includes 'legal' role
ALTER TABLE public.profiles DROP CONSTRAINT profiles_role_check;

-- Add the new constraint with vendor, legal, and superadmin roles
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check 
CHECK (role = ANY (ARRAY['vendor'::text, 'legal'::text, 'superadmin'::text]));

-- Update legal team members to have the correct 'legal' role
UPDATE public.profiles 
SET role = 'legal' 
WHERE email IN ('legal@run.edu.ng', 'vc@run.edu.ng', 'councilaffairs@run.edu.ng', 'registrar@run.edu.ng');