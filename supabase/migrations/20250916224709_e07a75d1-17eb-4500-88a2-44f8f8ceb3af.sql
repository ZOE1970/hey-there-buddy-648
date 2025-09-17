-- Fix the security definer view issue by removing SECURITY DEFINER and adjusting the view
DROP VIEW IF EXISTS public.user_stats;

-- Create a simple view without SECURITY DEFINER
CREATE VIEW public.user_stats AS
SELECT 
    COUNT(*) as total_users,
    COUNT(CASE WHEN role = 'vendor' THEN 1 END) as vendor_count,
    COUNT(CASE WHEN role = 'superadmin' THEN 1 END) as admin_count
FROM public.profiles;

-- Add RLS policy for the view access
CREATE POLICY "Superadmins can view user stats" 
ON public.profiles 
FOR SELECT 
USING (is_superadmin());

-- Grant necessary permissions
GRANT SELECT ON public.user_stats TO authenticated;