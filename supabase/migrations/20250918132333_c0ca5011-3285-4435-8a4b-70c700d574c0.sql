-- Update legal team members to have the correct 'legal' role
UPDATE public.profiles 
SET role = 'legal' 
WHERE email IN ('legal@run.edu.ng', 'vc@run.edu.ng', 'councilaffairs@run.edu.ng', 'registrar@run.edu.ng');

-- Verify the role assignments
SELECT 'After update:' as status, email, role FROM public.profiles WHERE email IN ('legal@run.edu.ng', 'vc@run.edu.ng', 'councilaffairs@run.edu.ng', 'registrar@run.edu.ng', 'dpo@run.edu.ng') ORDER BY role, email;