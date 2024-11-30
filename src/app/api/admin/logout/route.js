// http://localhost:3000/api/admin/logout
import { NextResponse } from "next/server";
import pool from "@/lib/db";
import jwt from "jsonwebtoken";

const jwt_key = process.env.JWT_SAFE_KEY;

export async function POST(request) {
  try {
    const tokenCookie = request.cookies.get("token");
    const token = tokenCookie?.value;
    // console.log(token)

    if (!token) {
      return new NextResponse(
        JSON.stringify({ message: "Unauthorized: No token provided" }),
        { status: 401 }
      );
    }

    // verfiy The Token
    const decoded = jwt.verify(token, jwt_key);
    const emailToken = decoded.email;

    const { email } = await request.json(); // Extract email from the request body

    if (!email) {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 400 }
      );
    }

    if (email !== emailToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const result = await pool.query(
      "DELETE FROM admin_login WHERE email = ?",
      [email]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { message: "No user found with the provided email" },
        { status: 404 }
      );
    }

    // Create a response to clear the cookie
    const res = new NextResponse(
      JSON.stringify({ message: "Logout successful" }),
      { status: 200 }
    );

    // Clear the token cookie
    res.cookies.set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 0,
    });

    return res;
  } catch (error) {
    console.error("Error during logout:", error.message);
    return new NextResponse(
      JSON.stringify({
        message: "Internal Server Error",
        error: error.message,
      }),
      { status: 500 }
    );
  }
}
