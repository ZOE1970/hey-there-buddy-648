// Add this useEffect to your LoginPage component after the existing useEffects

import { useEffect } from "react";

useEffect(() => {
  // Handle error parameters from auth callback
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

function setErrors(arg0: (prev: any) => any) {
  throw new Error("Function not implemented.");
}
