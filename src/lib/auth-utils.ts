/**
 * Get the appropriate base URL for authentication redirects
 * based on the current environment
 */
export const getAuthRedirectUrl = (): string => {
  // Check if we're in development (localhost)
  if (typeof window !== 'undefined') {
    const { hostname, protocol, port } = window.location;
    
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return `${protocol}//${hostname}${port ? `:${port}` : ''}`;
    }
  }
  
  // Production URL
  return 'https://dpovendor.vercel.app';
};

/**
 * Get the complete auth callback URL
 */
export const getAuthCallbackUrl = (): string => {
  return `${getAuthRedirectUrl()}/auth/callback`;
};