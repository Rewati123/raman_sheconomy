import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

export function authMiddleware(req) {
  const token = req.cookies.get("token")?.value; 

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    jwt.verify(token, SECRET_KEY); 
    return NextResponse.next(); 
  } catch (error) {
    console.error("Invalid Token:", error);
    return NextResponse.redirect(new URL("/login", req.url)); 
  }
}

// Middleware sirf in routes pe chalega
export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*"], 
};