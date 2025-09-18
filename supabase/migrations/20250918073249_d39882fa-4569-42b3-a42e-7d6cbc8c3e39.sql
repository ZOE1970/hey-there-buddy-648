-- Update the DPO user to have superadmin role
UPDATE profiles 
SET role = 'superadmin', 
    updated_at = NOW() 
WHERE email = 'dpo@run.edu.ng';