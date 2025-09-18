import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

const RoleBasedRedirect = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      switch (user.role) {
        case 'vendor':
          navigate('/vendor/dashboard');
          break;
        case 'legal':
          navigate('/legal/dashboard');
          break;
        case 'superadmin':
        case 'limited_admin':
          navigate('/admin/dashboard');
          break;
        default:
          navigate('/login');
          break;
      }
    } else if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return null;
};

export default RoleBasedRedirect;