// http://localhost:3000/api/category/add/servicesitems
// Services Items  Post Request

import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request) {
  let conn;
  try {
    const { service_name, service_price, sub_service_id } =
      await request.json();

    if (!service_name || !sub_service_id) {
      return new NextResponse(
        JSON.stringify({ error: "Service Name and SubServiceId Are required" })
      );
    }

    conn = await pool.getConnection();

    const insertQuery = await pool.query(
      "INSERT INTO services_items (service_item_name, service_item_price, sub_service_id) VALUES (?, ?, ?)",
      [service_name, service_price, sub_service_id]
    );

    const selectQuery = await pool.query(
      "SELECT id from services_items WHERE id = LAST_INSERT_ID()"
    );

    const newUuid = await selectQuery[0]?.id;

    return new NextResponse(
      JSON.stringify({
        message: "Service Item Add Successfully",
        serviceName: service_name,
        servicePrice: service_price,
        subServiceID: sub_service_id,
        id: newUuid,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error Adding the Service Item:", error.message);
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
