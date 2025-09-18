-- Add legal role to profiles table
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'legal';

-- Update the legal@run.edu.ng user to have the legal role
UPDATE profiles 
SET role = 'legal' 
WHERE email = 'legal@run.edu.ng';