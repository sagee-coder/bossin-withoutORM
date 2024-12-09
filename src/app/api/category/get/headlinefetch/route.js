// http://localhost:3000/api/category/get/headlinefetch

import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  let conn;
  try {
    conn = await pool.getConnection();

    const selectQuery = `
      SELECT * FROM services
    `;

    const rows = await conn.query(selectQuery);

    return new NextResponse(JSON.stringify(rows), { status: 200 });
  } catch (error) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to fetch services" }),
      { status: 500 }
    );
  } finally {
    if (conn) {
      await conn.end();
    }
  }
}
