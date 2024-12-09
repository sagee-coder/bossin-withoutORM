// The `LAST_INSERT_ID()` function returns the value of the auto-increment
// column that was updated by the previous INSERT statement. In this case,
// it returns the UUID of the newly inserted row.
//
// The `SELECT id FROM services WHERE id = LAST_INSERT_ID()` query fetches
// the UUID of the newly inserted row from the database.
//
// The `rows` variable is an array of objects, where each object represents
// a row in the result set. Since we're only inserting one row, the array
// will contain only one object.
//
// We access the first (and only) row directly using `rows[0]`, and then
// access the `id` property of that row using the `?.id` syntax. This is
// equivalent to writing `rows[0] && rows[0].id`.

// http://localhost:3000/api/category/add/services
// Service Headline Post Request

import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request) {
  let conn;
  try {
    const { headline } = await request.json();

    if (!headline) {
      return NextResponse.json(
        { error: "Headline is required" },
        { status: 400 }
      );
    }

    conn = await pool.getConnection();

    // Insert the new service headline
    const insertQuery = `
      INSERT INTO services (service_headline) VALUES (?)
    `;
    const insertResult = await conn.query(insertQuery, [headline]); 

    console.log("Insert Result:", insertResult); 

    // Fetch the UUID of the newly inserted row
    const selectQuery = `
      SELECT id FROM services WHERE id = LAST_INSERT_ID()
    `;
    const rows = await conn.query(selectQuery); 

    // console.log("Select Result:", rows); 

    const newUuid = rows[0]?.id; // Access the first row directly

    if (!newUuid) {
      throw new Error("Failed to retrieve the new ID.");
    }

    return NextResponse.json({
      message: "Service Headline Added Successfully",
      headline: headline,
      id: newUuid, // Include UUID in the response
    });
  } catch (error) {
    console.error("Error creating service headline:", error.message);
    return NextResponse.json(
      {
        message: "Internal Server Error",
        error: error.message,
      },
      { status: 500 }
    );
  } finally {
    if (conn) {
      try {
        await conn.release(); // Ensure the connection is released
      } catch (releaseError) {
        console.error("Error releasing database connection:", releaseError.message);
      }
    }
  }
}