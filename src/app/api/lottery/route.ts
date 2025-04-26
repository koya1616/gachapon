import { getLotteryEvents } from "@/lib/db";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_CODE } from "@/const/cookies";

const ENV_ADMIN_CODE = process.env.ADMIN_CODE || "";

export async function GET() {
  const cookieStore = await cookies();
  const adminToken = cookieStore.get(ADMIN_CODE)?.value || "";
  if (adminToken !== ENV_ADMIN_CODE) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const lotteryEvents = await getLotteryEvents();
    return NextResponse.json(lotteryEvents, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch products" }, { status: 500 });
  }
}
