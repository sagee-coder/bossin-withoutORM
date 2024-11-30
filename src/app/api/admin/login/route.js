import pool from "../../../../lib/db.js"; // Adjust path if needed
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const jwt_key = process.env.JWT_SAFE_KEY;

export async function POST(request) {
  try {
    // Check if the user is already logged in
    const cookie = request.cookies.get("token");
    if (cookie) {
      try {
        const verified = jwt.verify(cookie, jwt_key);
        return new NextResponse(
          JSON.stringify({ message: "You are already logged in." }),
          { status: 200 }
        );
      } catch (err) {
        console.error("Token verification failed:", err.message);
      }
    }

    // Parse request body
    const { email, password } = await request.json();

    // Input validation
    if (!email || !password) {
      return new NextResponse(
        JSON.stringify({ error: "Email and password are required." }),
        { status: 400 }
      );
    }

    // Check if the user exists in admin_signup
    const [userResult] = await pool.query(
      "SELECT * FROM admin_signup WHERE email = ?",
      [email]
    );

    if (!userResult) {
      return new NextResponse(
        JSON.stringify({
          message: "Invalid email. Please check your details.",
        }),
        { status: 401 }
      );
    }

    const user = userResult;

    // Compare provided password with hashed password in DB
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return new NextResponse(
        JSON.stringify({
          message: "Invalid credentials. Please check your password.",
        }),
        { status: 401 }
      );
    }

    // Check if the login record already exists
    const [loginCheck] = await pool.query(
      "SELECT * FROM admin_login WHERE email = ?",
      [email]
    );

    if (loginCheck) {
      return new NextResponse(
        JSON.stringify({ message: "You are already logged in." }),
        { status: 200 }
      );
    }

    // Generate JWT token
    const token = jwt.sign({ email }, jwt_key, { expiresIn: "1d" });

    console.log(user.isAdmin);

    const message =
      user.isAdmin === 0 ? "Login successful" : "Admin Login successful";

    const response = new NextResponse(
      JSON.stringify({ message: message, token }),
      { status: 200 }
    );

    // Set token in cookies

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day
    });

    // Record the login (insert into admin_login table)
    await pool.query("INSERT INTO admin_login (email) VALUES (?)", [email]);

    return response;
  } catch (error) {
    console.error("Error during login:", error.message);
    return new NextResponse(
      JSON.stringify({
        message: "Internal Server Error",
        error: error.message,
      }),
      { status: 500 }
    );
  }
}
