import { getSessionCookie } from "better-auth/cookies";
import { NextRequest, NextResponse } from "next/server";

const authRoutes = ["/login", "/signup", "/email-login"];
const protectedRoutes = [
  "/",
  "/dashboard",
  "/leads",
  "/campaigns",
  "/profile",
  "/settings",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  try {
    const sessionCookie = getSessionCookie(request);
    const isLoggedIn = !!sessionCookie;

    const isAuthRoute = authRoutes.includes(pathname);
    const isProtectedRoute = protectedRoutes.some(
      (route) => pathname === route || pathname.startsWith(route + "/"),
    );

    // If user is logged in and trying to access auth routes (login, signup, etc)
    if (isLoggedIn && isAuthRoute) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // If user is not logged in and trying to access protected routes
    if (!isLoggedIn && isProtectedRoute) {
      const loginUrl = new URL("/login", request.url);
      if (pathname !== "/") {
        loginUrl.searchParams.set("callbackUrl", pathname);
      }
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);

    // On error, redirect to login for protected routes
    if (protectedRoutes.some((route) => pathname.startsWith(route))) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
