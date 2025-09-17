import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AuthUser {
  id: string;
  email: string;
  role: 'vendor' | 'superadmin' | 'limited_admin';
  first_name?: string;
  last_name?: string;
  company?: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (profile) {
            setUser({
              id: profile.id,
              email: profile.email,
              role: profile.role as 'vendor' | 'superadmin' | 'limited_admin',
              first_name: profile.first_name,
              last_name: profile.last_name,
              company: profile.company
            });
          }
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        setUser(null);
      } else if (session?.user) {
        // Refetch user profile on auth state change
        getUser();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const hasPermission = (permission: string) => {
    if (!user) return false;
    
    switch (permission) {
      case 'download_data':
        return user.role === 'superadmin';
      case 'approve_forms':
        return user.role === 'superadmin';
      case 'view_all':
        return user.role === 'superadmin' || user.role === 'limited_admin';
      case 'manage_users':
        return user.role === 'superadmin';
      default:
        return false;
    }
  };

  return {
    user,
    loading,
    hasPermission,
    isAdmin: user?.role === 'superadmin' || user?.role === 'limited_admin',
    isSuperAdmin: user?.role === 'superadmin',
    isLimitedAdmin: user?.role === 'limited_admin'
  };
};