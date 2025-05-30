import { ADMIN_CODE } from "@/const/cookies";
import { updateShipmentStatus } from "@/lib/db/index";
import type { ShipmentStatus } from "@/lib/db/shipments/query";
import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

export type UpdateShipmentStatusRequest = {
  shipmentId: number;
  status: ShipmentStatus;
};

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const adminToken = cookieStore.get(ADMIN_CODE)?.value || "";
    if (adminToken !== process.env.ADMIN_CODE) {
      return NextResponse.json({ message: "Unauthorized", data: null }, { status: 401 });
    }

    const body: UpdateShipmentStatusRequest = await request.json();
    const { shipmentId, status } = body;

    await updateShipmentStatus(shipmentId, status);

    return NextResponse.json({ message: "OK", data: null }, { status: 200 });
  } catch (error) {
    console.error("ERROR_CODE_0001:", error);
    return NextResponse.json({ message: "Internal server error", data: null }, { status: 500 });
  }
}
