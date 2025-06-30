// middleware.ts (create this file in your project root)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // If it's the root path, redirect to login
  if (request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: '/',
};