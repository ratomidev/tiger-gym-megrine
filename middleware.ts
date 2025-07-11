// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionToken } from "@/lib/auth/service";

// Define public paths that don't require authentication
const PUBLIC_PATHS = [
  "/auth/login",
  "/auth/register",
  "/register",
  "/api/auth/login",
  "/api/auth/register",
  "/api/register",
  "/api/upload/photo",
  "/landing",
  "/about",
  "/",
  "/api/cron/daily", // Daily cron job API
];

// Define owner-only paths
const OWNER_ONLY_PATHS = ["/home", "/users"];

// Static assets should also be public
const isStaticAsset = (path: string) => {
  return (
    path.startsWith("/_next") ||
    path.startsWith("/favicon.ico") ||
    path.includes(".") // Files with extensions are typically static assets
  );
};

// Check if a path is public and doesn't require authentication
const isPublicPath = (path: string) => {
  return (
    PUBLIC_PATHS.some(
      (publicPath) => path === publicPath || path.startsWith(`${publicPath}/`)
    ) || isStaticAsset(path)
  );
};

// Check if a path requires owner role
const isOwnerOnlyPath = (path: string) => {
  return OWNER_ONLY_PATHS.some(
    (ownerPath) => path === ownerPath || path.startsWith(`${ownerPath}/`)
  );
};

// Check if request to /api/adherents is a POST request (which should be public)
const isPublicAdherentRequest = (request: NextRequest) => {
  return (
    request.nextUrl.pathname === "/api/adherents" && request.method === "POST"
  );
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for public paths or POST requests to /api/adherents
  if (isPublicPath(pathname) || isPublicAdherentRequest(request)) {
    return NextResponse.next();
  }

  // Get the session cookie from the request object
  // Note: In middleware, cookies are accessible synchronously from the request
  const sessionCookie = request.cookies.get("session");

  // If no session cookie exists, redirect to login
  if (!sessionCookie?.value) {
    const loginUrl = new URL("/auth/login", request.url);
    // Store the original URL to redirect back after login
    loginUrl.searchParams.set("callbackUrl", encodeURIComponent(request.url));
    return NextResponse.redirect(loginUrl);
  }

  try {
    // Verify the session token
    const user = await verifySessionToken(sessionCookie.value);

    // If token verification fails (expired or invalid), redirect to login
    if (!user) {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("expired", "true");

      // Create response that clears the invalid cookie and redirects
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete("session");
      return response;
    }

    // Check if the path requires owner role
    if (isOwnerOnlyPath(pathname)) {
      if (user.role !== "OWNER") {
        // Redirect non-owners to a different page (e.g., adherents list or unauthorized page)
        const redirectUrl = new URL("/list-adherent", request.url);
        return NextResponse.redirect(redirectUrl);
      }
    }

    // User is authenticated and has proper role, allow request to proceed
    return NextResponse.next();
  } catch (error) {
    console.error("Authentication error:", error);
    // Handle any errors during verification
    const loginUrl = new URL("/auth/login", request.url);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete("session");
    return response;
  }
}

// Configure which routes this middleware applies to
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /api/auth/* (authentication API routes)
     * 2. /_next/* (Next.js internals)
     * 3. /fonts/* (static font assets)
     * 4. /favicon.ico, /logo.png, etc (static assets)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
