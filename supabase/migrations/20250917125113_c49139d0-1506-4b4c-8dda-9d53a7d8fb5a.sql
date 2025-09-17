-- First, remove the existing check constraint
ALTER TABLE profiles 
DROP CONSTRAINT IF EXISTS profiles_role_check;

-- Add the new constraint that includes limited_admin
ALTER TABLE profiles 
ADD CONSTRAINT profiles_role_check 
CHECK (role IN ('vendor', 'superadmin', 'limited_admin'));

-- Now update the user role
UPDATE profiles 
SET role = 'limited_admin' 
WHERE email = 'legal@run.edu.ng';