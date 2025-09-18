import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Mail, Lock, AlertCircle, User, Phone, Building, Check, Loader2 } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import runLogo from "@/assets/run-university-logo.png";

const LoginPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phone: "",
    company: "",
    rememberMe: false
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phone: "",
    company: "",
    general: ""
  });

  // Load remembered credentials on component mount
  useEffect(() => {
    const savedCredentials = localStorage.getItem('cdpo_remembered_credentials');
    if (savedCredentials) {
      try {
        const parsed = JSON.parse(savedCredentials);
        setFormData(prev => ({
          ...prev,
          email: parsed.email || '',
          rememberMe: true
        }));
      } catch (error) {
        console.error('Error loading saved credentials:', error);
        localStorage.removeItem('cdpo_remembered_credentials');
      }
    }
  }, []);

  // Handle error parameters from auth callback
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');
    const description = urlParams.get('description');
    
    if (error) {
      let errorMessage = 'Authentication failed. Please try again.';
      
      switch (error) {
        case 'server_error':
          if (description?.includes('Database error saving new user')) {
            errorMessage = 'Account setup failed. Please try signing in again or contact support.';
          }
          break;
        case 'auth_failed':
          errorMessage = 'Authentication failed. Please check your credentials.';
          break;
        case 'exchange_failed':
          errorMessage = 'Login verification failed. Please try again.';
          break;
        case 'session_failed':
          errorMessage = 'Session could not be established. Please try again.';
          break;
        case 'callback_failed':
          errorMessage = 'Login process failed. Please try again.';
          break;
        case 'no_session':
          errorMessage = 'Login session not found. Please try again.';
          break;
        default:
          if (description) {
            errorMessage = decodeURIComponent(description);
          }
      }
      
      setErrors(prev => ({ 
        ...prev, 
        general: errorMessage
      }));
      
      // Clear the error parameters from URL
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }
  }, []);

  // Listen for auth state changes to handle non-OAuth logins only
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      // Only handle auth changes if not coming from OAuth callback
      if (window.location.pathname === '/auth/callback') {
        return; // Let AuthCallback component handle OAuth redirects
      }
      
      if (event === 'SIGNED_IN' && session?.user) {
        console.log('User signed in:', session.user);
        
        // Only handle non-OAuth logins (email/password)
        if (session.user.app_metadata.provider !== 'google') {
          await redirectBasedOnRole(session.user.id, session.user.email!);
        }
      } else if (event === 'SIGNED_OUT') {
        console.log('User signed out');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save or remove credentials based on remember me checkbox
  const handleRememberMe = (email: string, remember: boolean) => {
    if (remember && email) {
      localStorage.setItem('cdpo_remembered_credentials', JSON.stringify({ email }));
    } else {
      localStorage.removeItem('cdpo_remembered_credentials');
    }
  };

  // Create user profile if it doesn't exist
  const createUserProfile = async (userId: string, email: string, additionalData?: any) => {
    try {
      const profileData = { 
        id: userId, 
        email: email,
        role: 'vendor',
        first_name: additionalData?.firstName || formData.firstName || '',
        last_name: additionalData?.lastName || formData.lastName || '',
        phone: additionalData?.phone || formData.phone || '',
        company: additionalData?.company || formData.company || '',
        avatar_url: additionalData?.avatar_url || null,
        created_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('profiles')
        .insert([profileData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating profile:', error);
      throw error;
    }
  };

  // Safe profile fetch that handles empty results
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId);
      
      if (error) {
        if (error.code === '42P17') {
          console.warn('RLS recursion detected');
          return { profile: null, error: null };
        }
        throw error;
      }
      
      return { profile: data && data.length > 0 ? data[0] : null, error: null };
    } catch (error) {
      console.error('Error fetching profile:', error);
      return { profile: null, error };
    }
  };

  // Check if user is already logged in
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        redirectBasedOnRole(session.user.id, session.user.email!);
      }
    };
    
    checkUser();
  }, []);

  const redirectBasedOnRole = async (userId: string, userEmail: string) => {
    try {
      const { profile, error: profileError } = await fetchUserProfile(userId);

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        navigate('/vendor/dashboard');
        return;
      }

      if (!profile) {
        try {
          const newProfile = await createUserProfile(userId, userEmail);
          if (newProfile?.role === 'superadmin') {
            navigate('/admin/dashboard');
          } else if (['legal@run.edu.ng','vc@run.edu.ng','councilaffairs@run.edu.ng','registrar@run.edu.ng'].includes(userEmail)) {
            navigate('/legal/dashboard');
          } else {
            navigate('/vendor/dashboard');
          }
        } catch (error) {
          console.error('Error creating profile during redirect:', error);
          navigate('/vendor/dashboard');
        }
        return;
      }

      if (profile?.role === 'superadmin') {
        navigate('/admin/dashboard');
      } else if (profile?.role === 'legal' || ['legal@run.edu.ng','vc@run.edu.ng','councilaffairs@run.edu.ng','registrar@run.edu.ng'].includes(userEmail)) {
        navigate('/legal/dashboard');
      } else {
        navigate('/vendor/dashboard');
      }
    } catch (error) {
      console.error('Error redirecting:', error);
      navigate('/vendor/dashboard');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
    
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: "", general: "" }));
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { 
      email: "", 
      password: "", 
      confirmPassword: "", 
      firstName: "", 
      lastName: "", 
      phone: "", 
      company: "",
      general: "" 
    };

    if (!formData.email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
      isValid = false;
    }

    if (!showForgotPassword && !formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (!showForgotPassword && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    if (isSignUp) {
      if (!formData.firstName) {
        newErrors.firstName = "First name is required";
        isValid = false;
      }
      
      if (!formData.lastName) {
        newErrors.lastName = "Last name is required";
        isValid = false;
      }
      
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
        isValid = false;
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setErrors({ ...errors, general: "" });
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        handleRememberMe(formData.email, formData.rememberMe);
        await redirectBasedOnRole(data.user.id, data.user.email!);
      }
    } catch (error: unknown) {
      console.error('Login error:', error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Failed to sign in. Please check your credentials.";
      
      setErrors(prev => ({ 
        ...prev, 
        general: errorMessage
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setErrors({ ...errors, general: "" });
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            role: 'vendor',
            first_name: formData.firstName,
            last_name: formData.lastName,
            phone: formData.phone,
            company: formData.company,
            created_at: new Date().toISOString(),
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        }
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        alert('Please check your email for verification instructions. You will be redirected to your dashboard after verification.');
        setIsSignUp(false);
        setFormData(prev => ({ ...prev, password: "", confirmPassword: "" }));
      }
    } catch (error: unknown) {
      console.error('Signup error:', error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Failed to create account. Please try again.";
      
      setErrors(prev => ({ 
        ...prev, 
        general: errorMessage
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email) {
      setErrors(prev => ({ ...prev, email: "Email is required", general: "" }));
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setErrors(prev => ({ ...prev, email: "Email is invalid", general: "" }));
      return;
    }
    
    setLoading(true);
    setErrors({ ...errors, general: "", email: "" });
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(formData.email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) {
        throw error;
      }

      setResetEmailSent(true);
    } catch (error: unknown) {
      console.error('Password reset error:', error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Failed to send password reset email. Please try again.";
      
      setErrors(prev => ({ 
        ...prev, 
        general: errorMessage
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setErrors({ ...errors, general: "" });
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
          // Add additional scopes if needed
          scopes: 'openid email profile'
        }
      });

      if (error) {
        throw error;
      }
      
      // Don't set loading to false here as the redirect will happen
      // The loading state will be reset when the component unmounts or user returns
    } catch (error: unknown) {
      console.error('Google login error:', error);
      let errorMessage = "Failed to sign in with Google. Please try again.";
      
      if (error instanceof Error) {
        // Handle specific Google OAuth errors
        if (error.message.includes('popup')) {
          errorMessage = "Please allow popups and try again, or check if you have popup blockers enabled.";
        } else if (error.message.includes('network')) {
          errorMessage = "Network error. Please check your connection and try again.";
        } else {
          errorMessage = error.message;
        }
      }
      
      setErrors(prev => ({ 
        ...prev, 
        general: errorMessage
      }));
      setGoogleLoading(false);
    }
  };

  const toggleSignUpMode = () => {
    setIsSignUp(!isSignUp);
    setShowForgotPassword(false);
    setResetEmailSent(false);
    setErrors({ 
      email: "", 
      password: "", 
      confirmPassword: "", 
      firstName: "", 
      lastName: "", 
      phone: "", 
      company: "",
      general: "" 
    });
  };

  const toggleForgotPassword = () => {
    setShowForgotPassword(!showForgotPassword);
    setResetEmailSent(false);
    setErrors({ 
      email: "", 
      password: "", 
      confirmPassword: "", 
      firstName: "", 
      lastName: "", 
      phone: "", 
      company: "",
      general: "" 
    });
  };

  const backToLogin = () => {
    setShowForgotPassword(false);
    setResetEmailSent(false);
    setErrors({ 
      email: "", 
      password: "", 
      confirmPassword: "", 
      firstName: "", 
      lastName: "", 
      phone: "", 
      company: "",
      general: "" 
    });
  };

  // Render forgot password form
  if (showForgotPassword) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4 md:p-6">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 p-4 md:p-6">
            <div className="flex justify-center mb-2 md:mb-4">
              <img src={runLogo} alt="Redeemer's University Logo" className="h-12 w-auto md:h-16 object-contain" />
            </div>
            <CardTitle className="text-xl md:text-2xl font-bold text-center">
              {resetEmailSent ? "Check Your Email" : "Reset Password"}
            </CardTitle>
            <CardDescription className="text-center text-xs md:text-sm">
              {resetEmailSent 
                ? "We've sent a password reset link to your email address"
                : "Enter your email address to receive a password reset link"
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            {resetEmailSent ? (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="w-8 h-8 text-green-600" />
                  </div>
                </div>
                <p className="text-center text-sm text-muted-foreground">
                  If an account with <strong>{formData.email}</strong> exists, you will receive a password reset email shortly.
                </p>
                <p className="text-center text-xs text-muted-foreground">
                  Don't see the email? Check your spam folder or try again.
                </p>
                <div className="space-y-2">
                  <Button 
                    onClick={() => setResetEmailSent(false)}
                    variant="outline" 
                    className="w-full text-xs md:text-sm"
                  >
                    Send Another Email
                  </Button>
                  <Button 
                    onClick={backToLogin}
                    variant="link" 
                    className="w-full text-xs md:text-sm"
                  >
                    Back to Sign In
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs md:text-sm">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-2 md:left-3 top-2.5 md:top-3 h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="name@company.com"
                      className="pl-7 md:pl-9 text-xs md:text-sm"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                      <AlertCircle className="h-3 w-3" /> {errors.email}
                    </p>
                  )}
                </div>

                {errors.general && (
                  <div className="bg-destructive/15 text-destructive text-xs md:text-sm p-2 md:p-3 rounded-md flex items-center gap-2">
                    <AlertCircle className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
                    {errors.general}
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full text-xs md:text-sm" 
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </Button>

                <Button 
                  type="button"
                  variant="link" 
                  className="w-full text-xs md:text-sm" 
                  onClick={backToLogin}
                >
                  Back to Sign In
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4 md:p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 p-4 md:p-6">
          <div className="flex justify-center mb-2 md:mb-4">
            <img src={runLogo} alt="Redeemer's University Logo" className="h-16 w-auto md:h-20 object-contain drop-shadow-lg" />
          </div>
          <CardTitle className="text-xl md:text-2xl font-bold text-center">
            {isSignUp ? "Create Account" : "DPO Vendor Compliance"}
          </CardTitle>
          <CardDescription className="text-center text-xs md:text-sm">
            {isSignUp ? "Create your vendor account to get started" : "Sign in to your account to continue"}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          <form onSubmit={isSignUp ? handleSignUp : handleLogin} className="space-y-3 md:space-y-4">
            {isSignUp && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-xs md:text-sm">First Name</Label>
                    <div className="relative">
                      <User className="absolute left-2 md:left-3 top-2.5 md:top-3 h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
                      <Input
                        id="firstName"
                        name="firstName"
                        type="text"
                        placeholder="Ayinla"
                        className="pl-7 md:pl-9 text-xs md:text-sm"
                        value={formData.firstName}
                        onChange={handleInputChange}
                      />
                    </div>
                    {errors.firstName && (
                      <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                        <AlertCircle className="h-3 w-3" /> {errors.firstName}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-xs md:text-sm">Last Name</Label>
                    <div className="relative">
                      <User className="absolute left-2 md:left-3 top-2.5 md:top-3 h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
                      <Input
                        id="lastName"
                        name="lastName"
                        type="text"
                        placeholder="Olaolu"
                        className="pl-7 md:pl-9 text-xs md:text-sm"
                        value={formData.lastName}
                        onChange={handleInputChange}
                      />
                    </div>
                    {errors.lastName && (
                      <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                        <AlertCircle className="h-3 w-3" /> {errors.lastName}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="company" className="text-xs md:text-sm">Company</Label>
                  <div className="relative">
                    <Building className="absolute left-2 md:left-3 top-2.5 md:top-3 h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
                    <Input
                      id="company"
                      name="company"
                      type="text"
                      placeholder="Your Company Name"
                      className="pl-7 md:pl-9 text-xs md:text-sm"
                      value={formData.company}
                      onChange={handleInputChange}
                    />
                  </div>
                  {errors.company && (
                    <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                      <AlertCircle className="h-3 w-3" /> {errors.company}
                    </p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-xs md:text-sm">Phone (Optional)</Label>
                  <div className="relative">
                    <Phone className="absolute left-2 md:left-3 top-2.5 md:top-3 h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+234 1234567890"
                      className="pl-7 md:pl-9 text-xs md:text-sm"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                      <AlertCircle className="h-3 w-3" /> {errors.phone}
                    </p>
                  )}
                </div>
              </>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs md:text-sm">Email</Label>
              <div className="relative">
                <Mail className="absolute left-2 md:left-3 top-2.5 md:top-3 h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@company.com"
                  className="pl-7 md:pl-9 text-xs md:text-sm"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                  <AlertCircle className="h-3 w-3" /> {errors.email}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs md:text-sm">Password</Label>
              <div className="relative">
                <Lock className="absolute left-2 md:left-3 top-2.5 md:top-3 h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={isSignUp ? "Create a password" : "Enter your password"}
                  className="pl-7 md:pl-9 pr-7 md:pr-9 text-xs md:text-sm"
                  value={formData.password}
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  className="absolute right-2 md:right-3 top-2.5 md:top-3 text-muted-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-3 w-3 md:h-4 md:w-4" />
                  ) : (
                    <Eye className="h-3 w-3 md:h-4 md:w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                  <AlertCircle className="h-3 w-3" /> {errors.password}
                </p>
              )}
            </div>
            
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-xs md:text-sm">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-2 md:left-3 top-2.5 md:top-3 h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    className="pl-7 md:pl-9 pr-7 md:pr-9 text-xs md:text-sm"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                  />
                  <button
                    type="button"
                    className="absolute right-2 md:right-3 top-2.5 md:top-3 text-muted-foreground"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-3 w-3 md:h-4 md:w-4" />
                    ) : (
                      <Eye className="h-3 w-3 md:h-4 md:w-4" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                    <AlertCircle className="h-3 w-3" /> {errors.confirmPassword}
                  </p>
                )}
              </div>
            )}
            
            {!isSignUp && (
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center space-x-2">
                  <input
                    id="rememberMe"
                    name="rememberMe"
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    className="h-3 w-3 md:h-4 md:w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <Label htmlFor="rememberMe" className="text-xs md:text-sm">Remember me</Label>
                </div>
                <Button 
                  variant="link" 
                  className="p-0 h-auto text-xs md:text-sm" 
                  type="button"
                  onClick={toggleForgotPassword}
                >
                  Forgot password?
                </Button>
              </div>
            )}
            
            {errors.general && (
              <div className="bg-destructive/15 text-destructive text-xs md:text-sm p-2 md:p-3 rounded-md flex items-center gap-2">
                <AlertCircle className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
                {errors.general}
              </div>
            )}
            
            <Button 
              type="submit" 
              className="w-full text-xs md:text-sm" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-3 w-3 md:h-4 md:w-4 mr-2 animate-spin" />
                  {isSignUp ? "Creating Account..." : "Signing in..."}
                </>
              ) : (
                <>
                  {isSignUp ? "Create Account" : "Sign in"}
                </>
              )}
            </Button>
          </form>
          
          <div className="relative my-4 md:my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground text-xs">Or continue with</span>
            </div>
          </div>
          
          <div className="grid gap-3 md:gap-4">
            <Button 
              variant="outline" 
              type="button" 
              disabled={loading || googleLoading}
              onClick={handleGoogleLogin}
              className="w-full text-xs md:text-sm"
            >
              {googleLoading ? (
                <>
                  <Loader2 className="h-3 w-3 md:h-4 md:w-4 mr-2 animate-spin" />
                  Signing in with Google...
                </>
              ) : (
                <>
                  <svg className="h-3 w-3 md:h-4 md:w-4 mr-2" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Continue with Google
                </>
              )}
            </Button>
          </div>
          
          <p className="mt-4 md:mt-6 text-center text-xs md:text-sm text-muted-foreground">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <Button 
              variant="link" 
              className="p-0 h-auto text-xs md:text-sm font-medium" 
              type="button" 
              onClick={toggleSignUpMode}
              disabled={loading || googleLoading}
            >
              {isSignUp ? "Sign in" : "Sign up"}
            </Button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;