import { NextResponse } from "next/server";
import { queryPromise } from "@/lib/db";

export async function POST(req) {
  try {
    const authHeader = req.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json(
        { message: "Token required hai" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1]; 

    if (!token) {
      return NextResponse.json(
        { message: "Invalid token" },
        { status: 401 }
      );
    }


    await queryPromise("DELETE FROM user_tokens WHERE token = ?", [token]);

    return NextResponse.json(
      { message: "Logout successful" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
