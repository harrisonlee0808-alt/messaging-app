import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { auth } from "@/lib/auth"

export async function middleware(request: NextRequest) {
  const session = await auth()
  const pathname = request.nextUrl.pathname

  // Public routes that don't require authentication
  const publicRoutes = ["/", "/auth/signin", "/auth/signup"]
  const isPublicRoute = publicRoutes.includes(pathname) || pathname.startsWith("/api/auth")

  // If user is authenticated and tries to access auth pages, redirect to dashboard
  if (session && (pathname === "/auth/signin" || pathname === "/auth/signup")) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // If user is not authenticated and tries to access protected routes, redirect to sign in
  if (!session && !isPublicRoute && !pathname.startsWith("/api")) {
    const signInUrl = new URL("/auth/signin", request.url)
    signInUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(signInUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}

