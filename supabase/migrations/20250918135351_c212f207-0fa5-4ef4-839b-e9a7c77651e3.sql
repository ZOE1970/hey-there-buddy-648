-- Update names for specific users with their proper titles
UPDATE profiles 
SET first_name = CASE 
  WHEN email = 'legal@run.edu.ng' THEN 'Legal Officer'
  WHEN email = 'vc@run.edu.ng' THEN 'Vice-Chancellor'
  WHEN email = 'councilaffairs@run.edu.ng' THEN 'Council Affairs'
  WHEN email = 'registrar@run.edu.ng' THEN 'Registrar'
END,
updated_at = NOW()
WHERE email IN (
  'legal@run.edu.ng',
  'vc@run.edu.ng', 
  'councilaffairs@run.edu.ng',
  'registrar@run.edu.ng'
);

-- Verify the update
SELECT email, first_name, role, updated_at 
FROM profiles 
WHERE email IN (
  'legal@run.edu.ng',
  'vc@run.edu.ng', 
  'councilaffairs@run.edu.ng',
  'registrar@run.edu.ng'
) 
ORDER BY email;