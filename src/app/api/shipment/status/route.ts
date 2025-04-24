import { type NextRequest, NextResponse } from "next/server";
import { updateShipmentStatus, findShipmentByMerchantPaymentId } from "@/lib/db";
import { cookies } from "next/headers";
import { ADMIN_CODE } from "@/const/cookies";

const ENV_ADMIN_CODE = process.env.ADMIN_CODE || "";

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const adminToken = cookieStore.get(ADMIN_CODE)?.value || "";
    if (adminToken !== ENV_ADMIN_CODE) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { shipmentId, status } = body;

    const validStatuses = ["shipped", "delivered", "payment_failed", "cancelled"] as const;
    type ShipmentStatus = (typeof validStatuses)[number];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ message: "Invalid status" }, { status: 400 });
    }

    await updateShipmentStatus(shipmentId, status as ShipmentStatus);

    return NextResponse.json({ message: "Shipment status updated successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
