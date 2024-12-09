// http://localhost:3000/api/category/get/fetchdetails

import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request) {
  let conn;
  try {
    // Establish a connection to the database
    conn = await pool.getConnection();

    // Define the SQL query to fetch service details
    const selectQuery = `
      SELECT 
        s.id AS service_id,
        s.service_headline,
        s.created_at AS service_created_at,
        
        ss.id AS sub_service_id,
        ss.service_name,
        ss.created_at AS sub_service_created_at,
        
        si.id AS service_item_id,
        si.service_item_name,
        si.service_item_price,
        si.created_at AS service_item_created_at,
        
        sil.id AS service_item_list_id,
        sil.service_item_list_name,
        sil.service_item_list_price,
        sil.created_at AS service_item_list_created_at
      FROM 
        services s
        LEFT JOIN sub_services ss ON s.id = ss.service_id
        LEFT JOIN services_items si ON ss.id = si.sub_service_id
        LEFT JOIN services_items_list sil ON si.id = sil.service_item_id
      ORDER BY 
        s.created_at DESC,
        ss.created_at DESC,
        si.created_at DESC,
        sil.created_at DESC
    `;

    // Execute the query
    const rows = await conn.query(selectQuery);

    // Return error if no data is found
    if (rows.length === 0) {
      return NextResponse.json({ error: "No data found" }, { status: 400 });
    }

    // Initialize data structures to organize the data
    const serviceData = [];
    const serviceMap = new Map();

    // Iterate over the rows to construct the hierarchical data structure
    rows.forEach(row => {
      // Process services
      if (!serviceMap.has(row.service_headline)) {
        serviceMap.set(row.service_headline, {
          id: row.service_id,
          headline: row.service_headline,
          created_at: row.service_created_at,
          sub_services: new Map()
        });
      }

      const service = serviceMap.get(row.service_headline);
      // Process sub-services
      if (!service.sub_services.has(row.service_name)) {
        service.sub_services.set(row.service_name, {
          id: row.sub_service_id,
          service_name: row.service_name,
          created_at: row.sub_service_created_at,
          service_items: new Map()
        });
      }

      const subService = service.sub_services.get(row.service_name);
      // Process service items
      if (!subService.service_items.has(row.service_item_name)) {
        subService.service_items.set(row.service_item_name, {
          id: row.service_item_id,
          service_item_name: row.service_item_name,
          service_item_price: row.service_item_price,
          created_at: row.service_item_created_at,
          item_lists: []
        });
      }

      // Add service item lists if present
      if (row.service_item_list_name) {
        const serviceItem = subService.service_items.get(row.service_item_name);
        serviceItem.item_lists.push({
          id: row.service_item_list_id,
          service_item_list_name: row.service_item_list_name,
          service_item_list_price: row.service_item_list_price,
          created_at: row.service_item_list_created_at
        });
      }
    });

    // Transform the Map structure to an array structure suitable for JSON response
    serviceMap.forEach(service => {
      const subServices = [];
      service.sub_services.forEach(subService => {
        const serviceItems = [];
        subService.service_items.forEach(serviceItem => {
          serviceItems.push({ ...serviceItem });
        });
        subServices.push({ ...subService, service_items: serviceItems });
      });
      serviceData.push({ ...service, sub_services: subServices });
    });

    // Return the organized service data
    return NextResponse.json(serviceData, { status: 200 });
  } catch (error) {
    // Handle and log any errors
    console.error("Error fetching services:", error);
    return NextResponse.json(
      { error: "Failed to fetch services" },
      { status: 500 }
    );
  } finally {
    // Ensure the database connection is released
    if (conn) {
      await conn.release();
    }
  }
}

