import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Check for OAuth errors in URL params first
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');
        
        if (error) {
          console.error('OAuth Error:', error, errorDescription);
          
          // Handle specific error cases
          if (error === 'server_error' && errorDescription?.includes('Database error saving new user')) {
            // This happens when user already exists or there's a constraint violation
            // Try to get the current session and handle accordingly
            const { data: { session }, error: sessionError } = await supabase.auth.getSession();
            
            if (sessionError) {
              console.error('Session error:', sessionError);
              navigate('/login?error=auth_failed');
              return;
            }
            
            if (session?.user) {
              // User exists, just redirect them
              await redirectByRole(session.user.id, session.user.email);
              return;
            }
          }
          
          // For other errors, redirect to login with error message
          navigate(`/login?error=${error}&description=${encodeURIComponent(errorDescription || 'Authentication failed')}`);
          return;
        }

        // Let Supabase handle the OAuth callback automatically
        // Just wait a moment for the auth state to update
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Check current session after OAuth callback
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          navigate('/login?error=session_failed');
          return;
        }
        
        if (session?.user) {
          await redirectByRole(session.user.id, session.user.email);
        } else {
          // If no session after callback, likely an auth issue
          navigate('/login?error=no_session');
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        navigate('/login?error=callback_failed');
      }
    };

    const redirectByRole = async (userId: string, userEmail: string | null) => {
      try {
        let userRole = 'vendor'; // default role
        
        // Give a moment for the trigger to complete
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Check if profile exists
        const { data: existingProfile, error: fetchError } = await supabase
          .from('profiles')
          .select('role, id')
          .eq('id', userId)
          .maybeSingle();

        if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is "not found"
          console.error('Error fetching profile:', fetchError);
        }

        if (!existingProfile) {
          // Profile doesn't exist, create it manually
          console.log('Creating profile manually for user:', userId);
          try {
            // Get user data from auth
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            
            // Determine role based on email or other criteria
            let newUserRole = 'vendor';
            const email = userEmail || user?.email || '';
            
            // Check if this email should be a superadmin (you can customize this logic)
            // For example, specific email domains or addresses
            if (email === 'admin@redeemer.ca' || email.endsWith('@admin.redeemer.ca')) {
              newUserRole = 'superadmin';
            }
            
            const profileData = {
              id: userId,
              email: email,
              role: newUserRole,
              first_name: user?.user_metadata?.first_name || user?.user_metadata?.given_name || '',
              last_name: user?.user_metadata?.last_name || user?.user_metadata?.family_name || '',
              avatar_url: user?.user_metadata?.avatar_url || user?.user_metadata?.picture || null,
              created_at: new Date().toISOString(),
            };

            const { data: newProfile, error: insertError } = await supabase
              .from('profiles')
              .insert(profileData)
              .select('role')
              .single();

            if (insertError) {
              console.error('Error creating profile manually:', insertError);
              
              // If it's a unique violation, the user might already exist
              if (insertError.code === '23505') { // unique violation
                // Try to fetch the existing profile again
                const { data: retryProfile } = await supabase
                  .from('profiles')
                  .select('role')
                  .eq('id', userId)
                  .single();
                
                userRole = retryProfile?.role || 'vendor';
              } else {
                // For other errors, use default role and continue
                userRole = 'vendor';
              }
            } else {
              userRole = newProfile?.role || 'vendor';
            }
          } catch (createError) {
            console.error('Profile creation failed:', createError);
            userRole = 'vendor'; // fallback
          }
        } else {
          userRole = existingProfile.role;
        }

        // Redirect based on role
        console.log('Redirecting user with role:', userRole);
        if (userRole === 'superadmin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/vendor/dashboard');
        }
      } catch (err) {
        console.error('Redirect role error:', err);
        // Always redirect somewhere, never leave user hanging
        navigate('/vendor/dashboard');
      }
    };

    handleAuthCallback();
  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <div className="space-y-2">
          <p className="text-muted-foreground">Completing sign in...</p>
          <p className="text-xs text-muted-foreground">This may take a moment</p>
        </div>
      </div>
    </div>
  );
};

export default AuthCallback;