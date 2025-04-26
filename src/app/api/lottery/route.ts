import { getLotteryEvents } from "@/lib/db";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_CODE } from "@/const/cookies";

const ENV_ADMIN_CODE = process.env.ADMIN_CODE || "";

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const adminToken = cookieStore.get(ADMIN_CODE)?.value || "";
  if (adminToken !== ENV_ADMIN_CODE) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const lotteryEvents = await getLotteryEvents();
    return NextResponse.json({ lotteryEvents }, { status: 200 });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}
