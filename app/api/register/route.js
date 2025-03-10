import { NextResponse } from "next/server";
import { queryPromise } from "@/lib/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Sab fields required hain" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if user already exists
    const existingUser = await queryPromise("SELECT * FROM register WHERE email = ?", [
      email,
    ]);

    if (existingUser.length > 0) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    // Insert new user
    await queryPromise("INSERT INTO register (name, email, password) VALUES (?, ?, ?)", [
      name,
      email,
      hashedPassword,
    ]);

    // Get newly registered user ID
    const newUser = await queryPromise("SELECT * FROM register WHERE email = ?", [
      email,
    ]);

    const userId = newUser[0].id;

    // Generate JWT Token
    const token = jwt.sign({ id: userId, email: email }, SECRET_KEY, {
      expiresIn: "1h",
    });

    // Save Token in Database
    await queryPromise("INSERT INTO user_tokens (user_id, token) VALUES (?, ?)", [
      userId,
      token,
    ]);

    return NextResponse.json(
      { message: "User registered successfully", token },
      { status: 201 }
    );
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
