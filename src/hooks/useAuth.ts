import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AuthUser {
  id: string;
  email: string;
  role: 'vendor' | 'superadmin' | 'limited_admin' | 'legal';
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
            .maybeSingle();
          
          if (profile) {
            setUser({
              id: profile.id,
              email: profile.email,
              role: profile.role as 'vendor' | 'superadmin' | 'limited_admin' | 'legal',
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

  const getPermissions = (role: string) => {
    switch (role) {
      case 'superadmin':
        return {
          manage_users: true,
          delete_users: true,
          view_all_data: true,
          export_data: true,
          system_settings: true,
          approve_forms: true,
          print_certificate: true,
          download_data: true,
        };
      case 'limited_admin':
        return {
          manage_users: true,
          delete_users: false,
          view_all_data: true,
          export_data: true,
          system_settings: false,
          approve_forms: false,
          print_certificate: false,
          download_data: false,
        };
      case 'legal':
        return {
          manage_users: false,
          delete_users: false,
          view_all_data: true,
          export_data: true,
          system_settings: false,
          approve_forms: false,
          print_certificate: true,
          download_data: true,
        };
      case 'vendor':
        return {
          manage_users: false,
          delete_users: false,
          view_own_data: true,
          upload_documents: true,
          view_all_data: false,
          export_data: false,
          system_settings: false,
          approve_forms: false,
          print_certificate: false,
          download_data: false,
        };
      default:
        return {};
    }
  };

  const hasPermission = (permission: string) => {
    if (!user) return false;
    
    const permissions = getPermissions(user.role);
    return permissions[permission as keyof typeof permissions] || false;
  };

  return {
    user,
    loading,
    hasPermission,
    isAdmin: user?.role === 'superadmin' || user?.role === 'limited_admin',
    isSuperAdmin: user?.role === 'superadmin',
    isLimitedAdmin: user?.role === 'limited_admin',
    isLegal: user?.role === 'legal'
  };
};