// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionToken } from "@/lib/auth/service";

// Paths that don't require authentication
const publicPaths = [
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
  "/api/auth/login",
  "/api/auth/register",
];

// Check if a path should be public
const isPublicPath = (path: string) => {
  return publicPaths.some(publicPath => 
    path === publicPath || path.startsWith(`${publicPath}/`)
  );
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Allow access to public paths
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }
  
  // For API routes, check session and return 401 if invalid
  if (pathname.startsWith("/api/")) {
    const sessionCookie = request.cookies.get("session");
    
    if (!sessionCookie?.value) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const user = await verifySessionToken(sessionCookie.value);
    
    if (!user) {
      return NextResponse.json({ error: "Session expired" }, { status: 401 });
    }
    
    return NextResponse.next();
  }
  
  // For regular routes, redirect to login if session is invalid
  const sessionCookie = request.cookies.get("session");
  
  if (!sessionCookie?.value) {
    const url = new URL("/auth/login", request.url);
    url.searchParams.set("returnUrl", encodeURI(pathname));
    return NextResponse.redirect(url);
  }
  
  const user = await verifySessionToken(sessionCookie.value);
  
  if (!user) {
    // Clear invalid cookie
    const response = NextResponse.redirect(
      new URL("/auth/login?expired=true", request.url)
    );
    response.cookies.delete("session");
    return response;
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Add routes that should check for authentication
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};