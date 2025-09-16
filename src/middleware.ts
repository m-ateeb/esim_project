import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname

    // Check if user is authenticated
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url))
    }

    // Check if user is active
    if (!token.isActive) {
      return NextResponse.redirect(new URL("/account-suspended", req.url))
    }

    // Admin routes protection
    if (path.startsWith("/admin")) {
      if (token.role !== "ADMIN" && token.role !== "MODERATOR") {
        return NextResponse.redirect(new URL("/dashboard", req.url))
      }
    }

    // User dashboard protection
    if (path.startsWith("/dashboard")) {
      if (token.role !== "USER" && token.role !== "ADMIN" && token.role !== "MODERATOR") {
        return NextResponse.redirect(new URL("/", req.url))
      }
    }

    // Checkout protection
    if (path.startsWith("/checkout")) {
      if (token.role !== "USER" && token.role !== "ADMIN" && token.role !== "MODERATOR") {
        return NextResponse.redirect(new URL("/login", req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/checkout/:path*",
    "/cart",
  ],
}
