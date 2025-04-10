import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rotas protegidas que requerem autenticação
const protectedRoutes = [
  '/dashboard',
  '/profile',
  '/schedules',
  '/spaces',
  '/evaluations',
  '/athletes',
  '/modalities',
  '/messages',
];

// Rotas de autenticação
const authRoutes = [
  '/login',
  '/register',
  '/forgot-password',
  '/reset-password',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('auth_token')?.value;

  // Verifica se a rota atual precisa de autenticação
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route) || pathname === route
  );

  // Verifica se é uma rota de autenticação
  const isAuthRoute = authRoutes.some(route => 
    pathname.startsWith(route) || pathname === route
  );

  // Se for uma rota protegida e não há token, redireciona para login
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Se for uma rota de autenticação e já está autenticado, redireciona para dashboard
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all routes except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /fonts (inside public)
     * 4. /icons (inside public)
     * 5. /images (inside public)
     * 6. all root files inside public (e.g. favicon.ico)
     */
    '/((?!api|_next|fonts|icons|images|[\\w-]+\\.\\w+).*)',
  ],
}; 