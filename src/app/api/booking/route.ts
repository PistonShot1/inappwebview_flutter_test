import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const shop_id = searchParams.get("shop_id");
  const start_date = searchParams.get("start_date");
  const end_date = searchParams.get("end_date");
  const specialist_ids = searchParams.get("specialist_ids");

  try {
    const apiUrl = `http://35.186.157.104/staging/booking/available_slots?shop_id=${shop_id}&start_date=${start_date}&end_date=${end_date}&specialist_ids=${specialist_ids}`;

    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching available slots:", error);
    return NextResponse.json(
      { error: "Failed to fetch available slots" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const requiredFields = [
      "shop_id",
      "specialist_id",
      "user_id",
      "booking_date_time",
      "services_id",
    ];
    const missingFields = requiredFields.filter((field) => !body[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(", ")}` },
        { status: 400 }
      );
    }

    // Validate services_id is an array
    if (!Array.isArray(body.services_id)) {
      return NextResponse.json(
        { error: "services_id must be an array" },
        { status: 400 }
      );
    }

    // Make API call to create booking
    const apiUrl = "http://35.186.157.104/staging/booking/lock_available_slot";

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        shop_id: body.shop_id,
        specialist_id: body.specialist_id,
        user_id: body.user_id,
        booking_date_time: body.booking_date_time,
        services_id: body.services_id,
        ...(body.reservation_name && {
          reservation_name: body.reservation_name,
        }),
        ...(body.reservation_phone && {
          reservation_phone: body.reservation_phone,
        }),
        ...(body.reservation_email && {
          reservation_email: body.reservation_email,
        }),
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: "Failed to create booking", details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
