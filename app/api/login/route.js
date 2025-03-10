import { NextResponse } from "next/server";
import { queryPromise } from "@/lib/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email aur password required hain" },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await queryPromise("SELECT * FROM register WHERE email = ?", [email]);

    if (user.length === 0) {
      return NextResponse.json(
        { message: "User exist nahi karta" },
        { status: 400 }
      );
    }

    const validUser = user[0];

    // Verify password
    const isMatch = await bcrypt.compare(password, validUser.password);
    if (!isMatch) {
      return NextResponse.json(
        { message: "Galat password hai" },
        { status: 401 }
      );
    }

    // Generate JWT Token
    const token = jwt.sign({ id: validUser.id, email: validUser.email }, SECRET_KEY, {
      expiresIn: "1h",
    });

    // Save Token in Database
    await queryPromise("INSERT INTO user_tokens (user_id, token) VALUES (?, ?)", [
      validUser.id,
      token,
    ]);

    return NextResponse.json(
      { message: "Login successful", token },
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
