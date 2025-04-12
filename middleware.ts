import { auth } from "./auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// List of public routes that don't require authentication
const publicRoutes = [
  "/",
  "/login",
  "/signup",
  "/about",
  "/blog",
  "/contact",
  "/docs",
  "/features",
  "/pricing",
  "/privacy",
  "/services",
  "/solutions",
  "/terms",
];

// Define auth routes separately for clarity
const authRoutes = ["/login", "/signup"];

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  // Check if the route is public or auth-related
  const isPublicRoute = publicRoutes.some(
    (route) =>
      nextUrl.pathname === route || nextUrl.pathname.startsWith(`${route}/`)
  );
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  // Allow access to static files and NextAuth's own API routes
  if (
    nextUrl.pathname.startsWith("/_next") ||
    nextUrl.pathname.startsWith("/api/auth") ||
    nextUrl.pathname.match(/\.(ico|png|jpg|jpeg|svg)$/)
  ) {
    return NextResponse.next();
  }

  // Allow access to your custom signup API route even for unauthenticated users
  if (nextUrl.pathname === "/api/auth/signup") {
    return NextResponse.next();
  }

  // Redirect unauthenticated users trying to access protected routes to login
  if (!isLoggedIn && !isPublicRoute && !isAuthRoute) {
    const loginUrl = new URL("/login", nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", nextUrl.href);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from auth pages (login/signup)
  if (isLoggedIn && isAuthRoute) {
    return NextResponse.redirect(new URL("/", nextUrl.origin));
  }

  // Allow access to public routes and protected routes for logged-in users
  return NextResponse.next();
});
