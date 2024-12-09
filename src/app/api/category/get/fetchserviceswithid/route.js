// http://localhost:3000/api/category/get/fetchserviceswithid/:id

//ID is Services Table id
import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request) {
  let conn;
  try {
    conn = await pool.getConnection();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

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
      WHERE s.id = ?
      ORDER BY 
        s.created_at DESC,
        ss.created_at DESC,
        si.created_at DESC,
        sil.created_at DESC
    `;

    const rows = await conn.query(selectQuery, [id]);

    // Check if rows are returned
    if (rows.length === 0) {
      return NextResponse.json(
        { message: "No services found" },
        { status: 404 }
      );
    }

    // Transform the flat data into a hierarchical structure
    // Initialize the service data structure
    const serviceData = {
      id: rows[0].service_id,
      serviceHeadline: rows[0].service_headline,
      created_at: rows[0].service_created_at,
      sub_services: []
    };

    // Create a map to store unique sub-services
    // This map will be used to group the sub-services and service items
    const subServicesMap = new Map();
    const serviceItemsMap = new Map();

    // Iterate through the rows and create the hierarchical structure
    rows.forEach(row => {
      if (row.sub_service_id && !subServicesMap.has(row.sub_service_id)) {
        // Create a new sub-service and add it to the map
        const subService = {
          id: row.sub_service_id,
          service_name: row.service_name,
          created_at: row.sub_service_created_at,
          service_items: []
        };
        subServicesMap.set(row.sub_service_id, subService);
        // Add the sub-service to the service data
        serviceData.sub_services.push(subService);
      }

      if (row.service_item_id && !serviceItemsMap.has(row.service_item_id)) {
        // Create a new service item and add it to the map
        const serviceItem = {
          id: row.service_item_id,
          service_item_name: row.service_item_name,
          service_item_price: row.service_item_price,
          created_at: row.service_item_created_at,
          item_lists: []
        };
        serviceItemsMap.set(row.service_item_id, serviceItem);

        // Get the sub-service that the service item belongs to
        const subService = subServicesMap.get(row.sub_service_id);
        if (subService) {
          // Add the service item to the sub-service
          subService.service_items.push(serviceItem);
        }
      }

      // Add the service item list to the service item
      if (row.service_item_list_id) {
        const serviceItem = serviceItemsMap.get(row.service_item_id);
        if (serviceItem) {
          serviceItem.item_lists.push({
            id: row.service_item_list_id,
            service_item_list_name: row.service_item_list_name,
            service_item_list_price: row.service_item_list_price,
            created_at: row.service_item_list_created_at
          });
        }
      }
    });

    // Return the transformed data
    return NextResponse.json(serviceData, { status: 200 });
  } catch (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json(
      { error: "Failed to fetch services" },
      { status: 500 }
    );
  } finally {
    if (conn) {
      await conn.release();
    }
  }
}


