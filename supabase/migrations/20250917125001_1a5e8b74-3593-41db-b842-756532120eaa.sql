-- Create a new limited admin role type if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'admin_type') THEN
        CREATE TYPE admin_type AS ENUM ('superadmin', 'limited_admin');
    END IF;
END
$$;

-- Update the user role to limited_admin
UPDATE profiles 
SET role = 'limited_admin' 
WHERE email = 'legal@run.edu.ng';

-- Update the profiles table to allow the new role
ALTER TABLE profiles 
DROP CONSTRAINT IF EXISTS profiles_role_check;

ALTER TABLE profiles 
ADD CONSTRAINT profiles_role_check 
CHECK (role IN ('vendor', 'superadmin', 'limited_admin'));