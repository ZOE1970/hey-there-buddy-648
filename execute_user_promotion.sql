-- Execute the SQL to promote legal users to admin role
UPDATE profiles 
SET role = 'limited_admin', updated_at = NOW()
WHERE email IN (
  'legal@run.edu.ng',
  'vc@run.edu.ng', 
  'councilaffairs@run.edu.ng',
  'registrar@run.edu.ng'
);

-- Verify the update
SELECT email, role, updated_at 
FROM profiles 
WHERE email IN (
  'legal@run.edu.ng',
  'vc@run.edu.ng', 
  'councilaffairs@run.edu.ng',
  'registrar@run.edu.ng'
) 
ORDER BY email;