import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const redirectByRole = async (userId: string, userEmail: string | null) => {
      try {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', userId)
          .maybeSingle();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
        }

        if (!profile) {
          await supabase.from('profiles').insert({
            id: userId,
            email: userEmail ?? '',
            role: 'vendor',
          });
        }

        const role = profile?.role ?? 'vendor';
        navigate(role === 'superadmin' ? '/admin/dashboard' : '/vendor/dashboard');
      } catch (err) {
        console.error('Redirect role error:', err);
        navigate('/vendor/dashboard');
      }
    };

    // Listen first to avoid race conditions
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        // Defer any Supabase reads from inside the callback
        setTimeout(() => {
          redirectByRole(session.user.id, session.user.email);
        }, 0);
      } else if (event === 'SIGNED_OUT') {
        navigate('/login');
      }
    });

    // Then check current session (handles provider hash on first load)
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Error getting session:', error);
        navigate('/login');
        return;
      }
      if (session?.user) {
        redirectByRole(session.user.id, session.user.email);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Completing sign in...</p>
      </div>
    </div>
  );
};

export default AuthCallback;