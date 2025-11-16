import { NextRequest } from 'next/server';

// Base64 URL decode function for Edge runtime
function base64UrlDecode(str: string): string {
  // Replace URL-safe characters
  str = str.replace(/-/g, '+').replace(/_/g, '/');
  
  // Add padding if needed
  while (str.length % 4) {
    str += '=';
  }
  
  // Decode using atob (available in Edge runtime)
  try {
    return atob(str);
  } catch (e) {
    return '';
  }
}

export async function getSessionFromRequest(request: NextRequest) {
  // Read the session token from cookies
  // NextAuth v5 uses 'authjs.session-token' cookie name
  const sessionToken = request.cookies.get('authjs.session-token')?.value || 
                       request.cookies.get('__Secure-authjs.session-token')?.value;
  
  if (!sessionToken) {
    return null;
  }
  
  // For Edge runtime, we'll decode the JWT without verification
  // This is a lightweight check for middleware purposes
  try {
    // Decode the JWT without verification (for Edge runtime)
    const parts = sessionToken.split('.');
    if (parts.length !== 3) {
      return null;
    }
    
    // Decode the payload (second part of JWT) using Edge-compatible method
    const decodedPayload = base64UrlDecode(parts[1]);
    if (!decodedPayload) {
      return null;
    }
    
    const payload = JSON.parse(decodedPayload);
    
    // Check if token is expired
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      return null;
    }
    
    return {
      user: {
        id: payload.id || payload.sub || '',
        email: payload.email || '',
        name: payload.name || '',
        role: payload.role || 'customer',
      }
    };
  } catch (error) {
    // If decoding fails, return null
    return null;
  }
}
