-- Update specified legal users to limited_admin role
-- This will promote them from any current role to admin status

-- First, update the specified users to limited_admin role
UPDATE profiles 
SET role = 'limited_admin', updated_at = NOW()
WHERE email IN (
  'legal@run.edu.ng',
  'vc@run.edu.ng', 
  'councilaffairs@run.edu.ng',
  'registrar@run.edu.ng'
);

-- Verify the update worked
SELECT email, role, updated_at 
FROM profiles 
WHERE email IN (
  'legal@run.edu.ng',
  'vc@run.edu.ng', 
  'councilaffairs@run.edu.ng',
  'registrar@run.edu.ng'
);