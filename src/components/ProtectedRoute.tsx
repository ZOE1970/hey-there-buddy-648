import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'vendor' | 'superadmin' | 'limited_admin' | 'legal';
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          navigate('/login');
          return;
        }

        // If role is required, check user role
        if (requiredRole) {
          try {
            const legalEmails = [
              'legal@run.edu.ng',
              'vc@run.edu.ng',
              'councilaffairs@run.edu.ng',
              'registrar@run.edu.ng'
            ];

            const { data: profile, error } = await supabase
              .from('profiles')
              .select('role')
              .eq('id', session.user.id)
              .maybeSingle();

            // Handle RLS recursion error - default to vendor role
            if (error?.code === '42P17') {
              console.warn('RLS recursion detected, assuming vendor role');
              if (requiredRole !== 'vendor' && !(requiredRole === 'legal' && legalEmails.includes(session.user.email!))) {
                navigate('/login');
                return;
              }
            } else if (error || !hasRequiredRole(profile?.role, requiredRole, session.user.email!, legalEmails)) {
              navigate('/login');
              return;
            }
          } catch (err) {
            console.error('Profile check error:', err);
            // Default to vendor for any profile fetch errors (allow email-based legal access)
            const legalEmails = [
              'legal@run.edu.ng',
              'vc@run.edu.ng',
              'councilaffairs@run.edu.ng',
              'registrar@run.edu.ng'
            ];
            if (requiredRole !== 'vendor' && !hasRequiredRole('vendor', requiredRole, session.user.email!, legalEmails)) {
              navigate('/login');
              return;
            }
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate, requiredRole]);

  // Helper function to check if user has required role
  const hasRequiredRole = (userRole: string | undefined, requiredRole: string, userEmail: string, legalEmails: string[]) => {
    switch (requiredRole) {
      case 'superadmin':
        return userRole === 'superadmin' || userRole === 'limited_admin';
      case 'legal':
        return userRole === 'legal' || legalEmails.includes(userEmail);
      case 'vendor':
        return true; // All authenticated users can access vendor routes
      default:
        return false;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;