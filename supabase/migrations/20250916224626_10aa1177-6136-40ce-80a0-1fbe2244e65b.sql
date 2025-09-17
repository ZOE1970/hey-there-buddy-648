-- Add user count and user management functionality
-- Create a view to get user statistics
CREATE OR REPLACE VIEW public.user_stats AS
SELECT 
    COUNT(*) as total_users,
    COUNT(CASE WHEN role = 'vendor' THEN 1 END) as vendor_count,
    COUNT(CASE WHEN role = 'superadmin' THEN 1 END) as admin_count
FROM public.profiles;

-- Add RLS policy for superadmin to delete users
CREATE POLICY "Superadmins can delete users" 
ON public.profiles 
FOR DELETE 
USING (is_superadmin());

-- Create function to safely delete user and related data
CREATE OR REPLACE FUNCTION public.delete_user_and_data(user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
    -- Check if current user is superadmin
    IF NOT public.is_superadmin() THEN
        RAISE EXCEPTION 'Permission denied: Only superadmins can delete users';
    END IF;
    
    -- Delete user's compliance submissions first (due to foreign key)
    DELETE FROM public.compliance_submissions WHERE vendor_email = (
        SELECT email FROM public.profiles WHERE id = user_id
    );
    
    -- Delete user profile
    DELETE FROM public.profiles WHERE id = user_id;
    
    -- Delete from auth.users (this will cascade)
    DELETE FROM auth.users WHERE id = user_id;
    
    RETURN TRUE;
EXCEPTION
    WHEN OTHERS THEN
        RETURN FALSE;
END;
$$;