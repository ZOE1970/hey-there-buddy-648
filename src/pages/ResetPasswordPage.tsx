import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Lock, AlertCircle, Check } from "lucide-react";
import { supabase } from '../lib/superbase';
import cdpoLogo from "@/assets/cdpo-logo.jpeg";

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordReset, setPasswordReset] = useState(false);
  const [validLink, setValidLink] = useState(true);
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    password: "",
    confirmPassword: "",
    general: ""
  });

  useEffect(() => {
    // Check URL parameters for various possible formats
    const token = searchParams.get('token') || searchParams.get('access_token');
    const type = searchParams.get('type');
    const refreshToken = searchParams.get('refresh_token');
    
    // Debug: Log all parameters
    console.log('URL Parameters:', {
      token,
      type,
      refreshToken,
      allParams: Object.fromEntries(searchParams.entries())
    });

    // Supabase typically uses 'recovery' type and includes access_token
    const isValidResetLink = (type === 'recovery' || type === 'password_recovery') && 
                            (token || refreshToken);
    
    if (!isValidResetLink) {
      setValidLink(false);
    } else {
      // If we have tokens, set the session
      if (token && refreshToken) {
        supabase.auth.setSession({
          access_token: token,
          refresh_token: refreshToken
        });
      }
    }
  }, [searchParams]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: "", general: "" }));
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { 
      password: "", 
      confirmPassword: "",
      general: "" 
    };

    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setErrors({ ...errors, general: "" });
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: formData.password
      });

      if (error) {
        throw error;
      }

      setPasswordReset(true);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error: unknown) {
      console.error('Password reset error:', error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Failed to reset password. Please try again.";
      
      setErrors(prev => ({ 
        ...prev, 
        general: errorMessage
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  // If it's not a valid password reset link
  if (!validLink) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4 md:p-6">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 p-4 md:p-6">
            <div className="flex justify-center mb-2 md:mb-4">
              <img src={cdpoLogo} alt="CDPO Logo" className="h-12 w-12 md:h-16 md:w-16" />
            </div>
            <CardTitle className="text-xl md:text-2xl font-bold text-center">
              Invalid Reset Link
            </CardTitle>
            <CardDescription className="text-center text-xs md:text-sm">
              This password reset link is invalid or has expired.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            <div className="space-y-4">
              <div className="flex justify-center">
                <AlertCircle className="w-12 h-12 text-destructive" />
              </div>
              <p className="text-center text-sm text-muted-foreground">
                Please request a new password reset link from the login page.
              </p>
              <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
                Debug Info: Check browser console for URL parameters
              </div>
              <Button 
                onClick={handleBackToLogin}
                className="w-full text-xs md:text-sm"
              >
                Back to Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (passwordReset) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4 md:p-6">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 p-4 md:p-6">
            <div className="flex justify-center mb-2 md:mb-4">
              <img src={cdpoLogo} alt="CDPO Logo" className="h-12 w-12 md:h-16 md:w-16" />
            </div>
            <CardTitle className="text-xl md:text-2xl font-bold text-center">
              Password Reset Successful
            </CardTitle>
            <CardDescription className="text-center text-xs md:text-sm">
              Your password has been successfully updated.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <p className="text-center text-sm text-muted-foreground">
                You will be redirected to the login page shortly.
              </p>
              <Button 
                onClick={handleBackToLogin}
                className="w-full text-xs md:text-sm"
              >
                Go to Login Now
              </Button>
            </div>
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
            <img src={cdpoLogo} alt="CDPO Logo" className="h-12 w-12 md:h-16 md:w-16" />
          </div>
          <CardTitle className="text-xl md:text-2xl font-bold text-center">
            Reset Your Password
          </CardTitle>
          <CardDescription className="text-center text-xs md:text-sm">
            Enter your new password below
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs md:text-sm">New Password</Label>
              <div className="relative">
                <Lock className="absolute left-2 md:left-3 top-2.5 md:top-3 h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your new password"
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
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-xs md:text-sm">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-2 md:left-3 top-2.5 md:top-3 h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your new password"
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
              {loading ? "Resetting Password..." : "Reset Password"}
            </Button>
            
            <Button 
              type="button"
              variant="link" 
              className="w-full text-xs md:text-sm" 
              onClick={handleBackToLogin}
            >
              Back to Sign In
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPasswordPage;