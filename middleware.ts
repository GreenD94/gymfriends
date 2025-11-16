import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSessionFromRequest } from '@/lib/auth-edge';
import { getAllowedRoutes, getDashboardUrl, getLoginUrlByName } from '@/features/core/config/role.config';
import { RoleName, getRoleId } from '@/features/core/constants/roles.constants';

const publicRoutes = ['/login', '/register', '/admin/login', '/trainer/login'];

function getLoginUrlForRoute(pathname: string): string {
  // Check if pathname starts with any of the role routes
  if (pathname.startsWith('/admin')) {
    return getLoginUrlByName('admin');
  }
  if (pathname.startsWith('/trainer')) {
    return getLoginUrlByName('trainer');
  }
  // Default to customer login
  return getLoginUrlByName('customer');
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Allow public routes
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Allow API routes
  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // Check authentication using edge-compatible method
  const session = await getSessionFromRequest(request);
  
  if (!session?.user) {
    // Redirect to role-specific login page based on the route being accessed
    const loginUrl = getLoginUrlForRoute(pathname);
    const redirectUrl = new URL(loginUrl, request.url);
    redirectUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  const userRoleName = session.user.role as RoleName;
  
  // Convert role name to RoleId for config functions
  const userRoleId = getRoleId(userRoleName);
  
  // Check role-based access using centralized config
  const allowedRoutes = getAllowedRoutes(userRoleId);
  const hasAccess = allowedRoutes.some(route => pathname.startsWith(route));
  
  if (!hasAccess) {
    // Redirect to appropriate dashboard based on role using centralized config
    const dashboardUrl = getDashboardUrl(userRoleId);
    return NextResponse.redirect(new URL(dashboardUrl || '/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

