-- Update specified users to admin role instead of legal
UPDATE profiles 
SET role = 'limited_admin'
WHERE email IN (
  'legal@run.edu.ng',
  'vc@run.edu.ng', 
  'councilaffairs@run.edu.ng',
  'registrar@run.edu.ng'
);