// http://localhost:3000/api/admin/signup

import pool from "../../../../lib/db"; // Adjust path if needed
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const jwt_key = process.env.JWT_SAFE_KEY;

export async function POST(request) {
  let conn;
  try {
    // Parse request body
    const { username, email, password, confirmPassword, isAdmin } =
      await request.json();

    // Validate input manually (similar to express-validator in your example)
    if (!username || !email || !password || !confirmPassword) {
      return new NextResponse(
        JSON.stringify({ error: "All fields are required." }),
        { status: 400 }
      );
    }

    if (!email.includes("@")) {
      return new NextResponse(
        JSON.stringify({ error: "Please enter a valid email address." }),
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return new NextResponse(
        JSON.stringify({
          error: "Password must be at least 8 characters long.",
        }),
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return new NextResponse(
        JSON.stringify({ error: "Passwords mismatch." }),
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingEmail = await pool.query(
      "SELECT * FROM admin_signup WHERE email = ?",
      [email]
    );
    if (-existingEmail.length > 0) {
      return new NextResponse(
        JSON.stringify({ message: "Email already exists." }),
        { status: 409 }
      );
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    conn = await pool.getConnection();
    const query =
      "INSERT INTO admin_signup (id, username, email, password, isAdmin) VALUES (UUID(), ?, ?, ?, ?)";
    await conn.query(query, [username, email, hashedPassword, isAdmin]);

    // Generate JWT Token
    const token = jwt.sign({ email: email }, jwt_key, { expiresIn: "1d" });

    const res = new NextResponse(
      JSON.stringify({ message: "Admin account created successfully", token }),
      { status: 201 }
    );

    // Set token in cookies
    res.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/", // Ensure the cookie is available throughout the app
      maxAge: 60 * 60 * 24, // Cookie expiry time (1 day)
    });

    return res;
  } catch (error) {
    console.error("Error creating user:", error.message);
    return new NextResponse(
      JSON.stringify({
        message: "Internal Server Error",
        error: error.message,
      }),
      { status: 500 }
    );
  } finally {
    if (conn) {
      try {
        await conn.release();
      } catch (error) {
        console.error("Error releasing database connection:", error.message);
      }
    }
  }
}
