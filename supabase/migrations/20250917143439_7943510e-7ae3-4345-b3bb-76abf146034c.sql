-- Fix the is_superadmin function to check the profiles table instead of JWT metadata
CREATE OR REPLACE FUNCTION public.is_superadmin()
 RETURNS boolean
 LANGUAGE plpgsql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
    user_role text;
BEGIN
    -- Get the role from profiles table
    SELECT role INTO user_role
    FROM public.profiles
    WHERE id = auth.uid();
    
    -- Return true if role is superadmin or limited_admin
    RETURN COALESCE(user_role = 'superadmin' OR user_role = 'limited_admin', false);
EXCEPTION
    WHEN OTHERS THEN
        RETURN false;
END;
$function$;