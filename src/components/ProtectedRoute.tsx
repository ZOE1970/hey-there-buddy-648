import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'vendor' | 'superadmin';
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
            const { data: profile, error } = await supabase
              .from('profiles')
              .select('role')
              .eq('id', session.user.id)
              .single();

            // Handle RLS recursion error - default to vendor role
            if (error?.code === '42P17') {
              console.warn('RLS recursion detected, assuming vendor role');
              if (requiredRole !== 'vendor') {
                navigate('/login');
                return;
              }
            } else if (error || profile?.role !== requiredRole) {
              navigate('/login');
              return;
            }
          } catch (err) {
            console.error('Profile check error:', err);
            // Default to vendor for any profile fetch errors
            if (requiredRole !== 'vendor') {
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