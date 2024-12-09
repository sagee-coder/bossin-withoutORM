// http://localhost:3000/api/category/add/servicesitemslists
// Services Items  Post Request

import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request) {
  let conn;
  try {
    const { serviceItem_name, serviceItem_price, service_item_id } =
      await request.json();

    if (!serviceItem_name || !serviceItem_price || !service_item_id) {
      return new NextResponse(
        JSON.stringify({ error: "ALl filed are required" })
      );
    }

    conn = await pool.getConnection();

    const insertQuery = await pool.query(
      "INSERT INTO services_items_list (service_item_list_name, service_item_list_price, service_item_id) VALUES (?, ?, ?)",
      [serviceItem_name, serviceItem_price, service_item_id]
    );

    const selectQuery = await pool.query(
      "SELECT id from services_items_list WHERE id = LAST_INSERT_ID()"
    );

    const newUuid = await selectQuery[0]?.id;

    return new NextResponse(
      JSON.stringify({
        message: "Service Item Add Successfully",
        serviceName: serviceItem_name,
        servicePrice: serviceItem_price,
        subServiceID: service_item_id,
        id: newUuid,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error Adding the Service Item List:", error.message);
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
