import { ADMIN_CODE } from "@/const/cookies";
import { getLotteryEvents } from "@/lib/db";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();
  const adminToken = cookieStore.get(ADMIN_CODE)?.value || "";
  if (adminToken !== process.env.ADMIN_CODE) {
    return NextResponse.json({ message: "Unauthorized", data: null }, { status: 401 });
  }

  const lotteryEvents = await getLotteryEvents();
  return NextResponse.json({ message: "OK", data: lotteryEvents }, { status: 200 });
}
