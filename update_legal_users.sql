-- Update specific users to legal role
UPDATE profiles 
SET role = 'legal' 
WHERE email IN (
  'legal@run.edu.ng',
  'vc@run.edu.ng', 
  'councilaffairs@run.edu.ng',
  'registrar@run.edu.ng'
);

-- Verify the update
SELECT email, role FROM profiles 
WHERE email IN (
  'legal@run.edu.ng',
  'vc@run.edu.ng', 
  'councilaffairs@run.edu.ng',
  'registrar@run.edu.ng'
);