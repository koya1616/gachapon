import { ADMIN_CODE } from "@/const/cookies";
import { getAuctions } from "@/lib/db/auctions/query";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();
  const adminToken = cookieStore.get(ADMIN_CODE)?.value || "";
  if (adminToken !== process.env.ADMIN_CODE) {
    return NextResponse.json({ message: "Unauthorized", data: null }, { status: 401 });
  }

  try {
    const auctions = await getAuctions();
    return NextResponse.json({ message: "OK", data: auctions }, { status: 200 });
  } catch (error) {
    console.error("ERROR_CODE_0009:", error);
    return NextResponse.json({ message: "Internal server error", data: null }, { status: 500 });
  }
}
