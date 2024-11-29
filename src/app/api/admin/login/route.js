// http://localhost:3000/api/admin/login
import pool from '../../../../lib/db.js'; // Adjust path if needed
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

const jwt_key = process.env.JWT_SAFE_KEY;

export async function POST(request) {
  try {
    // Parse request body
    const { email, password } = await request.json();

    // Input validation (you can handle more validations here as needed)
    if (!email || !password) {
      return new NextResponse(
        JSON.stringify({ error: 'Email and password are required.' }),
        { status: 400 }
      );
    }

    // Check if the user exists
    const userResult = await pool.query('SELECT * FROM admin_signup WHERE email = ?', [email]);

    if (userResult.length === 0) {
      return new NextResponse(
        JSON.stringify({ message: 'Invalid email. Please check your details.' }),
        { status: 401 }
      );
    }

    const user = userResult[0];

    // Compare provided password with hashed password in DB
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return new NextResponse(
        JSON.stringify({ message: 'Invalid credentials. Please check your password.' }),
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = jwt.sign({ email: email }, jwt_key, { expiresIn: '1d' });

    // Set token in cookies (Next.js automatically handles cookies in API responses)
    const res = new NextResponse(
      JSON.stringify({ message: 'Login successful', token: token }),
      { status: 200 }
    );

    res.cookies.set('token', token, {
      httpOnly: true, // Prevent client-side access
      secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
      sameSite: 'strict', // Restrict cookie to same-site requests
      path: '/', // Ensure the cookie is available throughout the app
      maxAge: 60 * 60 * 24, // Cookie expiry time (1 day)
    });


    return new NextResponse(
      JSON.stringify({ message: 'admin successfully logged in' }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error during login:', error.message);
    return new NextResponse(
      JSON.stringify({ message: 'Internal Server Error', error: error.message }),
      { status: 500 }
    );
  }
}