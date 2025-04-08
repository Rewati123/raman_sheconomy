import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

export function authMiddleware(req) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = new URL(req.url);

  // If user is on login page and has valid token, redirect to dashboard
  if (pathname === "/" && token) {
    try {
      jwt.verify(token, SECRET_KEY);
      return NextResponse.redirect(new URL("/dashboard", req.url));
    } catch (error) {
      // Invalid token, let them stay on login page
    }
  }

  // If user is not on login page and has no token, redirect to login
  if (pathname !== "/" && !token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // If user has token, verify it
  if (token) {
    try {
      jwt.verify(token, SECRET_KEY);
      return NextResponse.next();
    } catch (error) {
      console.error("Invalid Token:", error);
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

// Middleware will run on all routes
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};