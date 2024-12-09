// http://localhost:3000/api/category/add/subservices
// Sub Services Headline Post Request

import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request) {
  let conn;
  try {
    const { headline, service_id } = await request.json();

    if (!headline || !service_id) {
      return new NextResponse(
        JSON.stringify({ error: "All fields are required" }),
        { status: 400 }
      );
    }

    conn = await pool.getConnection();

    // Insert the sub service headline
    const insertQuery = await pool.query(
      "INSERT INTO sub_services (service_name, service_id) VALUES (?, ?)",
      [headline, service_id]
    );

    const selectQuery = await pool.query(
      "SELECT id FROM sub_services WHERE id = LAST_INSERT_ID()"
    );

    const newUuid = selectQuery[0]?.id;

    return new NextResponse(
      JSON.stringify({
        message: "Sub Service Headline Added Successfully",
        headline: headline,
        serviceId: service_id,
        id: newUuid,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error Adding the Sub Service:", error.message);
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
