import { getLotteryEvents } from "@/lib/db";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_CODE } from "@/const/cookies";

export async function GET() {
  const cookieStore = await cookies();
  const adminToken = cookieStore.get(ADMIN_CODE)?.value || "";
  if (adminToken !== process.env.ADMIN_CODE) {
    return NextResponse.json({ message: "Unauthorized", data: null }, { status: 401 });
  }

  const lotteryEvents = await getLotteryEvents();
  return NextResponse.json({ message: "OK", data: lotteryEvents }, { status: 200 });
}
